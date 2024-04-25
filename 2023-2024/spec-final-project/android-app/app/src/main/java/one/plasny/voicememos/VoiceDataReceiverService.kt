package one.plasny.voicememos

import android.Manifest
import android.app.Service
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationManager
import android.os.Build
import android.os.Environment
import android.os.Handler
import android.os.HandlerThread
import android.os.IBinder
import android.os.Looper
import android.os.Message
import android.os.Messenger
import android.os.Process
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.app.ActivityCompat
import com.arthenica.ffmpegkit.FFmpegKit
import com.arthenica.ffmpegkit.ReturnCode
import com.theeasiestway.opus.Constants.Channels
import com.theeasiestway.opus.Constants.FrameSize
import com.theeasiestway.opus.Constants.SampleRate
import com.theeasiestway.opus.Opus
import one.plasny.voicememos.model.AppDatabase
import one.plasny.voicememos.model.VoiceMemo
import one.plasny.voicememos.repository.AppRepository
import java.io.File
import java.io.FileOutputStream
import java.util.function.Consumer


const val ext = "wav" // mp3, etc
const val folder = "Voice Memos"

class VoiceDataReceiverService : Service() {
    private var startTime: Long = 0
    private lateinit var serviceLooper: Looper
    private lateinit var opusDecoder: Opus
    private var audioBuf: ByteArray = byteArrayOf()

    lateinit var locationManager: LocationManager
    var location: Location? = null

    @RequiresApi(Build.VERSION_CODES.R)
    override fun onCreate() {
        locationManager = this.getSystemService(LOCATION_SERVICE) as LocationManager
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            Log.d("xxx-service", "localization granted")

            locationManager.getCurrentLocation(
                LocationManager.GPS_PROVIDER,
                null,
                application.mainExecutor,
                Consumer {
                    location = it
                }
            )

            if (location == null) {
                location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
            }
        }

        super.onCreate()
    }

    override fun onBind(intent: Intent?): IBinder? {
        Log.d("xxx-service", "start service")

        startTime = System.currentTimeMillis()

        opusDecoder = Opus()
        opusDecoder.decoderInit(SampleRate._48000(), Channels.mono())

        HandlerThread("ServiceStartArguments", Process.THREAD_PRIORITY_BACKGROUND).apply {
            start()
            serviceLooper = looper
        }

        return Messenger(object : Handler(Looper.getMainLooper()) {
            override fun handleMessage(msg: Message) {
                if (msg.what == 0) {
                    val voiceData = msg.data.getByteArray("VOICE_DATA") ?: return
                    val decoded = opusDecoder.decode(voiceData, FrameSize._960()) ?: return
                    audioBuf += decoded
                }
            }
        }).binder
    }

    @RequiresApi(Build.VERSION_CODES.S)
    override fun onUnbind(intent: Intent?): Boolean {
        if (audioBuf.size == 0) {
            Log.d("xxx-service", "emptry stream -> returning")
            return super.onUnbind(intent)
        }

        Log.d("xxx-service", "stream ended")

        val folder = File(
            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_RECORDINGS),
            folder
        )
        folder.mkdir()

        val fileName = "audio-${startTime}"
        val file = File(
            this.filesDir,
            "${fileName}.pcm"
        )
        val fileOut = File(
            folder,
            "${fileName}.${ext}"
        )

        try {
            val outputStream = FileOutputStream(file)
            outputStream.write(audioBuf)
            outputStream.close()
            Log.d("xxx-service", "File saved to: ${file.absolutePath}")
        } catch (e: Exception) {
            Log.d("xxx-service", "Error saving file: ${e.message}")
        }

        val repo = AppRepository(AppDatabase.getDatabase(this.applicationContext).voiceMemoDao())
        repo.insert(
            VoiceMemo(
                audioFilePath = fileOut.path,
                timestamp = startTime,
                duration = System.currentTimeMillis() - startTime,
                location = location != null,
                latitude = location?.latitude,
                longitude = location?.longitude,
                transcription = null,
            )
        )

        val session =
            FFmpegKit.execute("-f s16be -ar 48k -ac 1 -i \"${file.absolutePath}\" \"${fileOut.absolutePath}\"")
        if (ReturnCode.isSuccess(session.returnCode)) {
            Log.d("xxx-service", session.output)
        } else {
            Log.d(
                "xxx-service",
                String.format(
                    "Command failed with state %s and rc %s.%s",
                    session.state,
                    session.returnCode,
                    session.failStackTrace
                )
            )
        }

        file.delete()

        return super.onUnbind(intent)
    }
}