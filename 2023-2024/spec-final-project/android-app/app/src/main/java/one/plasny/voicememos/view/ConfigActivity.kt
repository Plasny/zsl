package one.plasny.voicememos.view

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.tooling.preview.PreviewParameter
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.TextUnitType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.mapbox.common.MapboxOptions
import kotlinx.coroutines.launch
import one.plasny.voicememos.R
import one.plasny.voicememos.protobufs.config.Config
import one.plasny.voicememos.view_model.ConfigViewModel
import one.plasny.voicememos.view_model.SetConfigRes

class ConfigActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            Base(
                page = Pages.Config
            ) { padding ->
                ConfigView(
                    padding = padding,
                    configViewModel = ConfigViewModel(this.applicationContext)
                )
            }
        }
    }
}

@Preview
@Composable
fun ConfigView(
    @PreviewParameter(
        PaddingValuesPreviewParameterProvider::class,
        limit = 0
    ) padding: PaddingValues,
    configViewModel: ConfigViewModel = viewModel()
) {
    val scope = rememberCoroutineScope()
    val configState by configViewModel.configState.collectAsState(initial = Config.getDefaultInstance())

    var serverURL by remember {
        mutableStateOf("")
    }
    var username by remember {
        mutableStateOf("")
    }
    var password by remember {
        mutableStateOf("")
    }
    var message by remember {
        mutableStateOf(SetConfigRes.Empty)
    }

    if (configState.apiToken != "") message = SetConfigRes.LoggedIn
    serverURL = configState.serverAddr
    username = configState.username
    MapboxOptions.accessToken = configState.mapboxApiKey


    fun loggedIn(): Boolean {
        return message == SetConfigRes.LoggedIn
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(padding),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        item {
            Text(
                text = "Konto",
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
            )
            ListItem(
                leadingContent = {
                    Icon(
                        painter = painterResource(id = R.drawable.outline_link),
                        contentDescription = "link do strony"
                    )
                },
                headlineContent = {
                    OutlinedTextField(
                        value = serverURL,
                        onValueChange = { serverURL = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = {
                            Text("Adres serwera")
                        },
                        enabled = !loggedIn(),
                        singleLine = true,
                        isError = message == SetConfigRes.ServerError
                                || message == SetConfigRes.NetworkError
                                || message == SetConfigRes.WrongUrl
                    )
                }
            )
            ListItem(
                leadingContent = {
                    Icon(
                        imageVector = Icons.Outlined.Person,
                        contentDescription = "osoba"
                    )
                },
                headlineContent = {
                    OutlinedTextField(
                        value = username,
                        onValueChange = { username = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = {
                            Text("Nazwa użytkownika")
                        },
                        enabled = !loggedIn(),
                        singleLine = true,
                        isError = message == SetConfigRes.LoginError,
                    )
                }
            )

            if (!loggedIn()) {
                ListItem(
                    leadingContent = {
                        Icon(
                            painter = painterResource(id = R.drawable.outline_password),
                            contentDescription = "hasło"
                        )
                    },
                    headlineContent = {
                        OutlinedTextField(
                            value = password,
                            onValueChange = { password = it },
                            modifier = Modifier.fillMaxWidth(),
                            label = {
                                Text("Hasło")
                            },
                            singleLine = true,
                            isError = message == SetConfigRes.LoginError,
                            visualTransformation = PasswordVisualTransformation(),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
                        )
                    }
                )
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = message.str,
                    color = if (message != SetConfigRes.Ok && !loggedIn()) MaterialTheme.colorScheme.error
                    else MaterialTheme.colorScheme.primary,
                    fontSize = TextUnit(14.0f, TextUnitType.Sp),
                )
                Button(
                    onClick = {
                        scope.launch {
                            Log.d("xxx", "start")
                            if (loggedIn()) {
                                message = configViewModel.logout()
                            } else {
                                message = configViewModel.setServerConfig(
                                    serverURL = serverURL,
                                    username = username,
                                    password = password
                                )
                            }
                        }
                    }
                ) {
                    Text(text = if (loggedIn()) "Logout" else "Login")
                }
            }
        }

        item {
            Text(
                text = "Klucze API",
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
            )
            ListItem(
                leadingContent = {
                    Icon(
                        painter = painterResource(id = R.drawable.outline_key),
                        contentDescription = "klucz"
                    )
                },
                headlineContent = {
                    OutlinedTextField(
                        value = configState.mapboxApiKey,
                        onValueChange = {
                            scope.launch {
                                configViewModel.setMapboxApiKey(it)
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        label = {
                            Text("Mapbox api key")
                        },
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
                    )
                }
            )
            ListItem(
                leadingContent = {
                    Icon(
                        painter = painterResource(id = R.drawable.outline_key),
                        contentDescription = "klucz"
                    )
                },
                headlineContent = {
                    OutlinedTextField(
                        value = configState.openaiApiKey,
                        onValueChange = {
                            scope.launch {
                                configViewModel.setOpenaiApiKey(it)
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        label = {
                            Text("OpenAI api key")
                        },
                        visualTransformation = PasswordVisualTransformation(),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
                    )
                }
            )
        }
    }
}