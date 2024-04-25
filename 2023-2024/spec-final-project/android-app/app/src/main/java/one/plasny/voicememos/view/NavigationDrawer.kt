package one.plasny.voicememos.view

import android.content.Intent
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.NavigationDrawerItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.tooling.preview.PreviewParameter
import androidx.compose.ui.tooling.preview.PreviewParameterProvider
import androidx.compose.ui.unit.dp
import one.plasny.voicememos.R

enum class Pages(val title: String) {
    List("MAIN"),
    Map("Mapa notatek"),
    Config("Ustawienia"),
    About("O programie"),
    Details("informacje")
}

class PagesPreviewParameterProvider : PreviewParameterProvider<Pages> {
    override val values = sequenceOf(Pages.List, Pages.Map, Pages.Config, Pages.About)
}

@Preview(showBackground = true)
@Composable
fun NavigationContent(
    @PreviewParameter(PagesPreviewParameterProvider::class) currentPage: Pages,
    closeDrawer: () -> Unit = {}
) {
    val ctx = LocalContext.current

    ModalDrawerSheet {
        Spacer(Modifier.height(12.dp))
        // Text(
        //     text = stringResource(id = R.string.app_name),
        //     modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding),
        // )
        // Spacer(Modifier.height(12.dp))
        NavigationDrawerItem(
            icon = {
                Icon(
                    painter = painterResource(id = R.drawable.outline_queue_music),
                    contentDescription = "Lista nagrań"
                )
            },
            label = { Text("Lista nagrań") },
            selected = currentPage == Pages.List,
            modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding),
            onClick = {
                if (currentPage != Pages.List) {
                    closeDrawer()
                    val intent = Intent(ctx, MainActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    ctx.startActivity(intent)
                }
            }
        )
        NavigationDrawerItem(
            icon = {
                Icon(
                    painter = painterResource(id = R.drawable.outline_travel_explore),
                    contentDescription = "Globus z lupą"
                )
            },
            label = { Text("Mapa nagrań") },
            selected = currentPage == Pages.Map,
            modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding),
            onClick = {
                if (currentPage != Pages.Map) {
                    closeDrawer()
                    ctx.startActivity(Intent(ctx, MapActivity::class.java))
                }
            }
        )
        Divider(
            modifier = Modifier
                .padding(NavigationDrawerItemDefaults.ItemPadding)
                .padding(vertical = 4.dp),
        )
        NavigationDrawerItem(
            icon = {
                Icon(
                    imageVector = Icons.Outlined.Settings,
                    contentDescription = "Zębatka"
                )
            },
            label = { Text(Pages.Config.title) },
            selected = currentPage == Pages.Config,
            modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding),
            onClick = {
                if (currentPage != Pages.Config) {
                    closeDrawer()
                    ctx.startActivity(Intent(ctx, ConfigActivity::class.java))
                }
            }
        )
        NavigationDrawerItem(
            icon = {
                Icon(
                    imageVector = Icons.Outlined.Info,
                    contentDescription = "Informacja"
                )
            },
            label = { Text(Pages.About.title) },
            selected = currentPage == Pages.About,
            modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding),
            onClick = {
                if (currentPage != Pages.About) {
                    closeDrawer()
                    ctx.startActivity(Intent(ctx, AboutActivity::class.java))
                }
            }
        )
    }
}

