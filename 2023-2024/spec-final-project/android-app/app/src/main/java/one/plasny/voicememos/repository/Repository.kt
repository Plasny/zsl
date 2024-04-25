package one.plasny.voicememos.repository

import kotlinx.coroutines.flow.Flow
import one.plasny.voicememos.model.VoiceMemo
import one.plasny.voicememos.model.VoiceMemoDao

class AppRepository(private val voiceMemoDao: VoiceMemoDao) {
    val allMemos: Flow<List<VoiceMemo>> = voiceMemoDao.getAll()

    fun insert(memo: VoiceMemo) {
        voiceMemoDao.insertOne(memo)
    }

    fun deleteOne(memo: VoiceMemo) {
        voiceMemoDao.deleteOne(memo)
    }

    fun deleteAll() {
        voiceMemoDao.deleteAll()
    }

    fun updateOne(memo: VoiceMemo) {
        voiceMemoDao.updateOne(memo)
    }
}