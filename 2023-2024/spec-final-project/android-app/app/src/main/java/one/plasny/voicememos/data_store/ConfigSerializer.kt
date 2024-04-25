package one.plasny.voicememos.data_store

import android.content.Context
import androidx.datastore.core.CorruptionException
import androidx.datastore.core.DataStore
import androidx.datastore.core.Serializer
import androidx.datastore.dataStore
import com.google.protobuf.InvalidProtocolBufferException
import one.plasny.voicememos.protobufs.config.Config
import java.io.InputStream
import java.io.OutputStream

object ConfigSerializer : Serializer<Config> {
    override val defaultValue: Config = Config.getDefaultInstance()

    override suspend fun readFrom(input: InputStream): Config {
        try {
            return Config.parseFrom(input)
        } catch (exception: InvalidProtocolBufferException) {
            throw CorruptionException("Cannot read proto.", exception)
        }
    }

    override suspend fun writeTo(
        t: Config,
        output: OutputStream
    ) = t.writeTo(output)
}

val Context.configDataStore: DataStore<Config> by dataStore(
    fileName = "config.pb",
    serializer = ConfigSerializer
)