package one.plasny.voicememos.model

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    version = 1,
    entities = [VoiceMemo::class],
    autoMigrations = [
    ]
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun voiceMemoDao(): VoiceMemoDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "voicememos.db"
                )
                    .allowMainThreadQueries() // todo change later to seperate thread
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}