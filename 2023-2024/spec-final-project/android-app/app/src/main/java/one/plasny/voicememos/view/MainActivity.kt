package one.plasny.voicememos.view

import android.content.Intent
import android.os.Bundle
import android.text.format.DateUtils
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.Icon
import androidx.compose.material3.ListItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.tooling.preview.PreviewParameter
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.Flow
import okio.Path.Companion.toPath
import one.plasny.voicememos.R
import one.plasny.voicememos.model.AppDatabase
import one.plasny.voicememos.model.VoiceMemo
import one.plasny.voicememos.repository.AppRepository
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val repo = AppRepository(AppDatabase.getDatabase(this.applicationContext).voiceMemoDao())
        val memosFlow = repo.allMemos

        setContent {
            Base {
                MemosList(padding = it, memosFlow = memosFlow)
            }
        }
    }
}

@Preview
@Composable
fun MemosList(
    @PreviewParameter(
        MemoListFlowPreviewParameterProvider::class,
        limit = 0
    ) memosFlow: Flow<List<VoiceMemo>>,
    padding: PaddingValues = PaddingValues(8.dp)
) {
    val activity = LocalContext.current
    val list = memosFlow.collectAsState(initial = emptyList())

    LazyColumn(
        modifier = Modifier
            .padding(padding)
            .fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        items(list.value) { memo ->
            val icon = if (memo.transcription == null) R.drawable.outline_voice_note
            else R.drawable.outline_speech_to_text

            ListItem(
                modifier = Modifier.clickable {
                    val intent = Intent(activity, VoiceMemoActivity::class.java)
                    intent.putExtra("memo", memo)
                    activity.startActivity(intent)

//                    val intent = Intent(Intent.ACTION_VIEW)
//                    intent.setDataAndType(Uri.parse(memo.audioFilePath), "audio/*")
//                    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
//                    activity.startActivity(Intent.createChooser(intent, "select app"))
                },
                leadingContent = {
                    Icon(
                        painter = painterResource(
                            id = icon
                        ),
                        contentDescription = null
                    )
                },
                headlineContent = {
                    Text(text = memo.audioFilePath.toPath().name)
                },
                supportingContent = {
                    val instantWithZone =
                        Instant.ofEpochMilli(memo.timestamp).atZone(ZoneId.systemDefault())
                    val date = DateTimeFormatter
                        .ofPattern("yyyy-MM-dd HH:mm")
                        .format(instantWithZone)

                    Row(
                        modifier = Modifier.horizontalScroll(rememberScrollState())
                    ) {
                        Row(
                            modifier = Modifier.padding(end = 16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Icon(
                                painter = painterResource(id = R.drawable.outline_calendar_clock),
                                contentDescription = null,
                                modifier = Modifier.padding(end = 8.dp)
                            )
                            Text(date)
                        }
                        Row(
                            modifier = Modifier.padding(end = 16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                painter = painterResource(id = R.drawable.outline_timelapse),
                                contentDescription = null,
                                modifier = Modifier.padding(end = 8.dp)
                            )
                            val duration = Duration.ofMillis(memo.duration)
                            Text(DateUtils.formatElapsedTime(duration.seconds))
                        }
                        if (memo.location) {
                            Row(
                                modifier = Modifier.padding(end = 16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    painter = painterResource(id = R.drawable.outline_location),
                                    contentDescription = null,
                                    modifier = Modifier.padding(end = 8.dp)
                                )
                                Text("location")
                            }
                        }
                        if (memo.synced) {
                            Row(
                                modifier = Modifier.padding(end = 16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    painter = painterResource(id = R.drawable.outlined_sync),
                                    contentDescription = null,
                                    modifier = Modifier.padding(end = 8.dp)
                                )
                                Text("synced")
                            }
                        }
                    }
                }
            )
        }
    }
}