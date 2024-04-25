package one.plasny.voicememos.view

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.text.format.DateUtils
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.annotation.RequiresApi
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ArrowBack
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import one.plasny.voicememos.R
import one.plasny.voicememos.model.AppDatabase
import one.plasny.voicememos.model.VoiceMemo
import one.plasny.voicememos.repository.AppRepository
import one.plasny.voicememos.view_model.BtnState
import one.plasny.voicememos.view_model.DetailsViewModel
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

class VoiceMemoActivity : ComponentActivity() {
    @RequiresApi(Build.VERSION_CODES.TIRAMISU)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val memo = intent.getParcelableExtra("memo", VoiceMemo::class.java)
        if (memo == null) {
            Log.w("xxx", "null voice memo")
            this.startActivity(Intent(this, MainActivity::class.java))
            return
        }

        val detailsViewModel = DetailsViewModel(
            this,
            AppRepository(AppDatabase.getDatabase(this).voiceMemoDao()),
            memo
        )

        setContent {
            Base(
                page = Pages.Details,
                drawerGestures = false,
                topBar = {
                    CustomTopBar(
                        viewModel = detailsViewModel,
                        finish = { finish() }
                    )
                }
            ) {
                VoiceMemoView(it, detailsViewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Preview
@Composable
fun CustomTopBar(viewModel: DetailsViewModel? = null, finish: (() -> Unit)? = null) {
    TopAppBar(
        title = {},
        navigationIcon = {
            IconButton(onClick = {
                if (finish != null) finish()
            }) {
                Icon(
                    imageVector = Icons.Outlined.ArrowBack,
                    contentDescription = "Arrow Back"
                )
            }
        },
        actions = {
            IconButton(
                onClick = {
                    viewModel?.syncWithServer()
                }
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.outlined_sync),
                    contentDescription = "Sync"
                )
            }
            IconButton(
                onClick = {
                    viewModel?.delete()
                }
            ) {
                Icon(
                    imageVector = Icons.Outlined.Delete,
                    contentDescription = "Trash bin"
                )
            }
        }
    )
}

@Composable
fun VoiceMemoView(
    padding: PaddingValues = PaddingValues(8.dp),
    detailsViewModel: DetailsViewModel
) {
    val memo by detailsViewModel.memo.collectAsState()
    val transcribeBtnState by detailsViewModel.transcriptionAvailable.collectAsState()
    val error by detailsViewModel.error.collectAsState()
    val synced by detailsViewModel.synced.collectAsState()

    val instantWithZone = Instant.ofEpochMilli(memo.timestamp).atZone(ZoneId.systemDefault())
    val date = DateTimeFormatter
        .ofPattern("dd MMMM yyyy")
        .format(instantWithZone)
    val time = DateTimeFormatter
        .ofPattern("HH:mm")
        .format(instantWithZone)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(padding)
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize(0.9f)
        ) {
            item {
                Row {
                    Row(
                        modifier = Modifier
                            .weight(1.0f)
                            .padding(horizontal = 16.dp, vertical = 8.dp)
                    ) {
                        Icon(
                            painter = painterResource(id = R.drawable.outline_calendar_today),
                            contentDescription = null
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        Text(
                            text = date
                        )
                    }
                    Row(
                        modifier = Modifier
                            .weight(1.0f)
                            .padding(horizontal = 16.dp, vertical = 8.dp)
                    ) {
                        Icon(
                            painter = painterResource(id = R.drawable.outline_clock),
                            contentDescription = null
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        Text(
                            text = time
                        )
                    }
                }
            }

            item {
                Row {
                    Row(
                        modifier = Modifier
                            .weight(1.0f)
                            .padding(horizontal = 16.dp, vertical = 8.dp)
                    ) {
                        Icon(
                            painter = painterResource(id = R.drawable.outline_timelapse),
                            contentDescription = null
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        val duration = Duration.ofMillis(memo.duration)
                        Text(DateUtils.formatElapsedTime(duration.seconds))
                    }
                    Row(
                        modifier = Modifier
                            .weight(1.0f)
                            .padding(horizontal = 16.dp, vertical = 8.dp)
                    ) {
                        Icon(
                            painter = painterResource(id = R.drawable.outlined_sync),
                            contentDescription = null
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        Text(text = synced.str)
                    }
                }
            }

            item {
                ListItem(
                    modifier = Modifier.clickable {
                        detailsViewModel.launchMap()
                    },
                    leadingContent = {
                        Icon(
                            painter = painterResource(id = R.drawable.outline_location),
                            contentDescription = null
                        )
                    },
                    headlineContent = {
                        if (memo.location) {
                            Text(text = "latitude: ${memo.latitude}\nlongitude: ${memo.longitude}")
                        } else {
                            Text(text = "Unknown")
                        }
                    }
                )
            }

            item {
                ListItem(
                    leadingContent = {
                        Icon(
                            painter = painterResource(id = R.drawable.outline_audio_file),
                            contentDescription = "file path"
                        )
                    },
                    headlineContent = {
                        Text(text = memo.audioFilePath)
                    }
                )
            }

            if (memo.transcription != null) {
                item {
                    ListItem(
                        leadingContent = {
                            Icon(
                                painter = painterResource(id = R.drawable.outline_speech_to_text),
                                contentDescription = "transcription"
                            )
                        },
                        headlineContent = {
                            Text(text = memo.transcription!!)
                        }
                    )
                }
            }

        }
        Column(
            modifier = Modifier
                .fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.padding(16.dp)
            ) {
                Button(
                    modifier = Modifier.weight(1.0f),
                    onClick = {
                        detailsViewModel.launchInOtherApp()
                    }
                ) {
                    Text(text = "Play in other app")
                }
                Spacer(modifier = Modifier.width(16.dp))
                Button(
                    modifier = Modifier.weight(1.0f),
                    enabled = transcribeBtnState.enabled,
                    onClick = {
                        detailsViewModel.transcribe()
                    },
                ) {
                    if (transcribeBtnState == BtnState.Loading) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(30.dp)
                        )
                    } else {
                        Text(text = "Transcribe")
                    }
                }
            }

            Text(
                text = error,
                color = Color.Red
            )
        }
    }
}
