package one.plasny.voicememos.view

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.tooling.preview.PreviewParameter
import androidx.compose.ui.tooling.preview.PreviewParameterProvider
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.TextUnitType
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.launch
import one.plasny.voicememos.model.VoiceMemo
import one.plasny.voicememos.ui.theme.VoiceMemosTheme

class PaddingValuesPreviewParameterProvider : PreviewParameterProvider<PaddingValues> {
    override val values = sequenceOf(PaddingValues(8.dp))
}

class MemoListFlowPreviewParameterProvider : PreviewParameterProvider<Flow<List<VoiceMemo>>> {
    private val flow = flowOf(
        listOf(
            VoiceMemo(
                audioFilePath = "tmp-0.wav",
                duration = 200,
                latitude = null,
                longitude = null,
                location = false,
                timestamp = 1514041366100,
                transcription = null
            ),
            VoiceMemo(
                audioFilePath = "tmp-1.wav",
                duration = 30000,
                latitude = null,
                longitude = null,
                location = true,
                timestamp = 1814081766200,
                transcription = "asdf"
            ),
            VoiceMemo(
                audioFilePath = "tmp-2.wav",
                duration = 22000,
                latitude = null,
                longitude = null,
                location = false,
                timestamp = 1733081766200,
                transcription = null,
                synced = true
            )
        )
    )
    override val values = sequenceOf(flow)
}

class HelloWorldPreviewParameterProvider :
    PreviewParameterProvider<@Composable (padding: PaddingValues) -> Unit> {
    override val values = sequenceOf<@Composable (padding: PaddingValues) -> Unit>(
        @Composable { padding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Center,
                    fontSize = TextUnit(value = 10.0f, type = TextUnitType.Em),
                    text = "Hello World"
                )
            }
        }
    )
}

@Preview
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Base(
    page: Pages = Pages.List,
    drawerGestures: Boolean = true,
    topBar: (@Composable () -> Unit)? = null,
    @PreviewParameter(HelloWorldPreviewParameterProvider::class, limit = 1)
    inner: @Composable (padding: PaddingValues) -> Unit
) {
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    VoiceMemosTheme {
        ModalNavigationDrawer(
            drawerState = drawerState,
            gesturesEnabled = drawerState.isOpen || drawerGestures,
            drawerContent = {
                NavigationContent(
                    currentPage = page,
                    closeDrawer = {
                        scope.launch {
                            drawerState.snapTo(DrawerValue.Closed)
                        }
                    }
                )
            }
        ) {
            Scaffold(
                topBar = {
                    if (topBar != null) {
                        topBar()
                    } else {
                        CenterAlignedTopAppBar(
                            title = { Text(page.title) },
                            navigationIcon = {
                                IconButton(onClick = {
                                    scope.launch {
                                        drawerState.apply {
                                            if (isClosed) open() else close()
                                        }
                                    }
                                }) {
                                    Icon(
                                        imageVector = Icons.Filled.Menu,
                                        contentDescription = "Menu"
                                    )
                                }

                            },
                        )
                    }
                }
            ) { padding ->
                inner(padding)
            }

        }
    }
}
