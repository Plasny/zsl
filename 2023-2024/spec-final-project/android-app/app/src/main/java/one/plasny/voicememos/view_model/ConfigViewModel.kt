package one.plasny.voicememos.view_model

import android.content.Context
import android.util.Log
import androidx.lifecycle.ViewModel
import com.mapbox.common.MapboxOptions
import one.plasny.voicememos.data_store.configDataStore
import one.plasny.voicememos.model.LoginRequest
import one.plasny.voicememos.model.LoginResponse
import retrofit2.HttpException
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import java.net.URL


interface ApiService {
    @GET("/api/status")
    suspend fun getStatus()

    @POST("/api/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse
}

enum class SetConfigRes(val str: String) {
    ServerError("Server unavailable"),
    NetworkError("Network error"),
    LoginError("Wrong credentials"),
    WrongUrl("Bad address/url"),
    Ok("Success ✅"),
    Empty(""),
    LoggedIn("You are logged in ✅")
}

class ConfigViewModel(context: Context) : ViewModel() {
    private val _configState = context.configDataStore
    val configState = context.configDataStore.data

    // suspend fun checkServer(serverURL: String): Error? {
    //     val url: URL
    //     try {
    //         url = URL(serverURL)
    //     } catch (e: MalformedURLException) {
    //         return Error("Bad url")
    //     }

    //     val retrofit = Retrofit.Builder()
    //         .baseUrl(url)
    //         .addConverterFactory(GsonConverterFactory.create())
    //         .build()

    //     val apiService = retrofit.create(ApiService::class.java)

    //     try {
    //         apiService.getStatus()
    //     } catch (e: HttpException) {
    //         return Error("Server unavailable")
    //     } catch (e: Throwable) {
    //         Log.e("xxx", e.toString())
    //         return Error("Network error")
    //     }

    //     return null
    // }

    suspend fun logout(): SetConfigRes {
        _configState.updateData { conf ->
            conf.toBuilder()
                .setUsername("")
                .setApiToken("")
                .build()
        }

        return SetConfigRes.Empty
    }

    suspend fun setServerConfig(
        serverURL: String,
        username: String,
        password: String
    ): SetConfigRes {
        val url: URL
        try {
            url = URL(serverURL)
        } catch (e: Throwable) {
            return SetConfigRes.WrongUrl
        }

        val retrofit = Retrofit.Builder()
            .baseUrl(url)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val apiService = retrofit.create(ApiService::class.java)

        try {
            val response = apiService.login(LoginRequest(username, password))
            // Log.d("token", response.token)

            _configState.updateData { conf ->
                conf.toBuilder()
                    .setServerAddr(serverURL)
                    .setUsername(username)
                    .setApiToken(response.token)
                    .build()
            }
        } catch (e: HttpException) {
            if (e.code() == 401) {
                return SetConfigRes.LoginError
            }
            return SetConfigRes.ServerError
        } catch (e: Throwable) {
            Log.e("xxx", e.toString())
            return SetConfigRes.NetworkError
        }

        return SetConfigRes.Ok
    }

    suspend fun setOpenaiApiKey(key: String) {
        _configState.updateData { conf ->
            conf.toBuilder()
                .setOpenaiApiKey(key)
                .build()
        }
    }

    suspend fun setMapboxApiKey(key: String) {
        _configState.updateData { conf ->
            conf.toBuilder()
                .setMapboxApiKey(key)
                .build()
        }

        MapboxOptions.accessToken = key
    }
}