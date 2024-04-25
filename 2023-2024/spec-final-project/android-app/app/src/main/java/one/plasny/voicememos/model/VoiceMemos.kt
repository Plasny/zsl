package one.plasny.voicememos.model

import android.os.Parcelable
import androidx.room.ColumnInfo
import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow
import kotlinx.parcelize.Parcelize

data class Tag(
    val name: String
)

@Entity
@Parcelize
data class VoiceMemo(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    @ColumnInfo(name = "audio_file") val audioFilePath: String,
    val timestamp: Long,
    val location: Boolean,
    @ColumnInfo(name = "location_longitude") val longitude: Double?,
    @ColumnInfo(name = "location_latitude") val latitude: Double?,
    // val tags: List<Tag>,
    val duration: Long,
    var transcription: String?,
    var synced: Boolean = false,
) : Parcelable

@Dao
interface VoiceMemoDao {
    @Query("SELECT * FROM voicememo")
    fun getAll(): Flow<List<VoiceMemo>>

    @Query("SELECT * FROM voicememo WHERE id = :id")
    fun getOne(id: Int): VoiceMemo

    @Insert
    fun insertOne(voiceMemo: VoiceMemo)

    @Delete
    fun deleteOne(voiceMemo: VoiceMemo)

    @Query("DELETE FROM voicememo")
    fun deleteAll()

    @Update
    fun updateOne(voiceMemo: VoiceMemo)
}