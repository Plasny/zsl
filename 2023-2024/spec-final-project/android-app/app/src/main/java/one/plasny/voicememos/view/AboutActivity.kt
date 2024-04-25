package one.plasny.voicememos.view

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

class AboutActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            AboutPage()
        }
    }
}

@Preview
@Composable
fun AboutPage() {
    Base(
        page = Pages.About
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
        ) {
            item {
                Text(
                    text = "VoiceMemos",
                    fontSize = MaterialTheme.typography.headlineMedium.fontSize,
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Aplikacja umożliwiająca nagrywanie notatek głosowych z zegarka. Może też zapisywać lokalizacje, w której nagrywamy, a później zamienić ją na tekst.",
                    textAlign = TextAlign.Justify,
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(24.dp))
            }
            item {
                Text(
                    text = "Wymagania",
                    fontSize = MaterialTheme.typography.headlineSmall.fontSize,
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Aby to umożliwć należy w GadgetBridge, w ustawieniach deweloperskich urządzenia ustawić voice service package na: ",
                    textAlign = TextAlign.Justify,
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                )
                SelectionContainer {
                    Text(
                        text = "one.plasny.voicememos",
                        fontStyle = FontStyle.Italic,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier
                            .padding(horizontal = 16.dp, vertical = 8.dp)
                            .horizontalScroll(rememberScrollState())
                    )
                }
                Text(
                    text = "i voice service class-ę na: ",
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                )
                SelectionContainer {
                    Text(
                        text = "one.plasny.voicememos.VoiceDataReceiverService",
                        fontStyle = FontStyle.Italic,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier
                            .padding(horizontal = 16.dp, vertical = 8.dp)
                            .horizontalScroll(rememberScrollState())
                    )
                }
                Text(
                    text = "Pogrubiony tekst można skopiować.",
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "Teraz żeby nagrać wiadomość wystarczy uruchomić aplikację asystenta głosowego na zegarku, kiedy jest połączony z naszym telefonem.",
                    textAlign = TextAlign.Justify,
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(24.dp))
            }

            item {
                Text(
                    text = "Dodatkowe wymagania",
                    fontSize = MaterialTheme.typography.headlineSmall.fontSize,
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Jeśli chcemy aby lokalizacja naszej notatki głosowej była zapisywana to musimy dodać uprawnienie, żeby ta aplikacja miała dostęp do lokalizacji cały czas. Można to zrobić w ustawieniach telefonu.",
                    textAlign = TextAlign.Justify,
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Jeśli chcemy skorzystać z funkcji wyświetlania na mapie, to musimy dodać klucz do api Mapbox-a. w Config-u",
                    textAlign = TextAlign.Justify,
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Jeśli chcemy skorzystać z funkcji transkrypcji nagrań, to musimy dodać klucz do api OpenAI w Config-u",
                    textAlign = TextAlign.Justify,
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}