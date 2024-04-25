package one.plasny.voicememos.view_model

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import android.widget.Toast
import androidx.lifecycle.ViewModel
import com.aallam.openai.api.audio.TranscriptionRequest
import com.aallam.openai.api.chat.ChatCompletionRequest
import com.aallam.openai.api.chat.ChatMessage
import com.aallam.openai.api.chat.ChatRole
import com.aallam.openai.api.file.FileSource
import com.aallam.openai.api.model.ModelId
import com.aallam.openai.client.OpenAI
import com.aallam.openai.client.OpenAIConfig
import com.google.gson.annotations.SerializedName
import com.mapbox.geojson.Point
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import okio.FileSystem
import okio.Path.Companion.toPath
import one.plasny.voicememos.data_store.configDataStore
import one.plasny.voicememos.model.VoiceMemo
import one.plasny.voicememos.repository.AppRepository
import one.plasny.voicememos.view.MainActivity
import one.plasny.voicememos.view.MapActivity
import retrofit2.HttpException
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Header
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part

enum class BtnState(val enabled: Boolean) {
    Disabled(false),
    Loading(false),
    Enabled(true),
}

enum class SyncStatus(val str: String, val v: Boolean) {
    Synced(str = "Synced", v = true),
    NotSynced(str = "Not synced", v = false)
}

data class ResponseMessage(
    @SerializedName("message")
    val message: String
)

interface VoiceMemoService {
    @Multipart
    @POST("/api/memos")
    suspend fun saveMemo(
        @Header("Authorization") auth: String,
        @Part("timestamp") timestamp: RequestBody,
        @Part("duration") duration: RequestBody,
        @Part audio: MultipartBody.Part,
        @Part("location") location: RequestBody,
        @Part("latitude") latitude: RequestBody?,
        @Part("longitude") longitude: RequestBody?,
        @Part("transcription") transcription: RequestBody?,
    ): ResponseMessage
}

class DetailsViewModel(
    private val context: Context,
    private val repository: AppRepository,
    _memo: VoiceMemo
) : ViewModel() {
    private lateinit var client: OpenAI
    var transcriptionAvailable = MutableStateFlow(BtnState.Disabled)
    var error = MutableStateFlow("")
    var memo = MutableStateFlow(_memo)
    var synced = MutableStateFlow(if (_memo.synced) SyncStatus.Synced else SyncStatus.NotSynced)

    init {
        Log.d("xxx", "details init start")

        CoroutineScope(Dispatchers.Main).launch {
            val openaiApiKey = context.configDataStore.data.map { conf ->
                conf.openaiApiKey
            }.first()

            if (openaiApiKey != "") {
                transcriptionAvailable.value = BtnState.Enabled
            }

            client = OpenAI(
                OpenAIConfig(token = openaiApiKey)
            )

            Log.d("xxx", "details init end")
        }
    }

    fun syncWithServer() {
        CoroutineScope(Dispatchers.Main).launch {
            if (context.configDataStore.data.first().apiToken == "") {
                val toast =
                    Toast.makeText(context, "You need to be logged in to sync", Toast.LENGTH_LONG)
                toast.show()
                return@launch
            }

            val retrofit = Retrofit.Builder()
                .baseUrl(context.configDataStore.data.first().serverAddr)
                .addConverterFactory(GsonConverterFactory.create())
                .build()

            val apiService = retrofit.create(VoiceMemoService::class.java)

            val m = memo.value
            val timestamp = m.timestamp.toString().toRequestBody(MultipartBody.FORM)
            val duration = m.duration.toString().toRequestBody(MultipartBody.FORM)
            val file = m.audioFilePath.toPath().toFile()
            val requestFile = file
                .asRequestBody(MultipartBody.FORM)
            val audio = MultipartBody.Part.createFormData(
                "audio", file.name, requestFile
            )
            val location = m.location.toString().toRequestBody(MultipartBody.FORM)
            val longitude = if (m.location) {
                m.longitude.toString().toRequestBody(MultipartBody.FORM)
            } else {
                null
            }
            val latitude = if (m.location) {
                m.latitude.toString().toRequestBody(MultipartBody.FORM)
            } else {
                null
            }
            val transcription = if (m.transcription != null && m.transcription != "") {
                m.transcription!!.toRequestBody(MultipartBody.FORM)
            } else {
                null
            }

            try {
                val res = apiService.saveMemo(
                    auth = "Bearer " + context.configDataStore.data.first().apiToken,
                    audio = audio,
                    timestamp = timestamp,
                    duration = duration,
                    location = location,
                    latitude = latitude,
                    longitude = longitude,
                    transcription = transcription
                )

                val toast = Toast.makeText(context, "Sync succesful", Toast.LENGTH_SHORT)
                toast.show()

                memo.update {
                    it.synced = true
                    it
                }
                synced.value = SyncStatus.Synced
                repository.updateOne(memo.value)
            } catch (e: HttpException) {
                val toast = Toast.makeText(context, "Sync error", Toast.LENGTH_LONG)
                toast.show()
            } catch (e: Exception) {
                val toast = Toast.makeText(context, "Network error", Toast.LENGTH_LONG)
                toast.show()
            }
        }
    }

    fun delete() {
        repository.deleteOne(memo.value)
        memo.value.audioFilePath.toPath().toFile().delete()
        context.startActivity(Intent(context, MainActivity::class.java))
    }

    fun launchMap() {
        if (!memo.value.location) return

        val intent = Intent(context, MapActivity::class.java)
        intent.putExtra("point", Point.fromLngLat(memo.value.longitude!!, memo.value.latitude!!))
        context.startActivity(intent)
    }

    fun launchInOtherApp() {
        val intent = Intent(Intent.ACTION_VIEW)
        intent.setDataAndType(Uri.parse(memo.value.audioFilePath), "audio/*")
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        context.startActivity(Intent.createChooser(intent, "select app"))
    }

    fun transcribe() {
        transcriptionAvailable.value = BtnState.Loading

        CoroutineScope(Dispatchers.Main).launch {
            try {
                val transcription = client.transcription(
                    request = TranscriptionRequest(
                        audio = FileSource(
                            path = memo.value.audioFilePath.toPath(),
                            fileSystem = FileSystem.SYSTEM
                        ),
                        model = ModelId("whisper-1")
                    ),
                )

                try {
                    val chatCompletion = client.chatCompletion(
                        request = ChatCompletionRequest(
                            model = ModelId("gpt-3.5-turbo"),
                            messages = listOf(
                                ChatMessage(
                                    role = ChatRole.System,
                                    content = "You are a helpful assistant! Your role is to fix punctuation and change words which feel out of place to ones which sound similarly and fit the context better. Don't rearrange the words. Output whole message, don't skip any words."
                                ),
                                ChatMessage(
                                    role = ChatRole.User,
                                    content = transcription.text
                                )
                            )
                        )
                    )

                    val betterTranscription = chatCompletion.choices.first().message.content
                    if (transcription.text.length > betterTranscription.toString().length) {
                        memo.value.transcription = transcription.text
                    } else {
                        memo.value.transcription = betterTranscription
                    }
                } catch (err: Exception) {
                    Log.d("ai-completion", err.message.toString())
                    memo.value.transcription = transcription.text
                }

                repository.updateOne(memo.value)

                transcriptionAvailable.value = BtnState.Enabled
            } catch (err: Exception) {
                error.value = err.message.toString()
                transcriptionAvailable.value = BtnState.Disabled
            }
        }
    }
}