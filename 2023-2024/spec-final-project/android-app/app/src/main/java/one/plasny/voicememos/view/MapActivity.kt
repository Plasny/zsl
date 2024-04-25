package one.plasny.voicememos.view

import android.Manifest
import android.app.Service
import android.content.Intent
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.location.LocationManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.annotation.RequiresApi
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.zIndex
import androidx.core.app.ActivityCompat
import androidx.core.graphics.drawable.toBitmap
import androidx.lifecycle.lifecycleScope
import com.mapbox.android.gestures.MoveGestureDetector
import com.mapbox.common.MapboxOptions
import com.mapbox.geojson.Point
import com.mapbox.maps.CameraOptions
import com.mapbox.maps.MapView
import com.mapbox.maps.Style
import com.mapbox.maps.plugin.animation.MapAnimationOptions
import com.mapbox.maps.plugin.animation.flyTo
import com.mapbox.maps.plugin.annotation.annotations
import com.mapbox.maps.plugin.annotation.generated.PointAnnotationOptions
import com.mapbox.maps.plugin.annotation.generated.createPointAnnotationManager
import com.mapbox.maps.plugin.gestures.OnMoveListener
import com.mapbox.maps.plugin.gestures.addOnMoveListener
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import one.plasny.voicememos.R
import one.plasny.voicememos.data_store.configDataStore
import one.plasny.voicememos.model.AppDatabase
import one.plasny.voicememos.model.VoiceMemo
import one.plasny.voicememos.repository.AppRepository

class MapActivity : ComponentActivity() {
    @RequiresApi(Build.VERSION_CODES.TIRAMISU)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val repo = AppRepository(AppDatabase.getDatabase(this.applicationContext).voiceMemoDao())
        val point = intent.getParcelableExtra("point", Point::class.java)

        lifecycleScope.launch {
            MapboxOptions.accessToken = configDataStore.data.map { conf ->
                conf.mapboxApiKey
            }.catch {
                Log.d("xxx", "error " + it.message.toString())
            }.first()

            if (MapboxOptions.accessToken != "") {
                Log.d("xxx", "map")
                val memos: List<VoiceMemo> = repo.allMemos.first().filter { memo ->
                    memo.location
                }

                setContent {
                    Base(
                        page = Pages.Map,
                        drawerGestures = false
                    ) {
                        Map(
                            memos = memos,
                            point = point
                        )
                    }
                }
            } else {
                setContent {
                    Base(
                        page = Pages.Map
                    ) {
                        Other(padding = it)
                    }
                }
            }
        }
    }
}

const val pointZoom = 15.0
const val locationZoom = 10.0
const val nothingZoom = 5.0

@Composable
fun Map(
    memos: List<VoiceMemo> = emptyList(),
    point: Point? = null
) {
    val ctx = LocalContext.current
    val locationManager = ctx.getSystemService(Service.LOCATION_SERVICE) as LocationManager
    val location = if (ActivityCompat.checkSelfPermission(
            ctx,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
            ctx,
            Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED
    ) {
        locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
    } else {
        null
    }


    val annotationMemoMap: MutableMap<String, VoiceMemo> =
        emptyMap<String, VoiceMemo>().toMutableMap()
    var currentMemo: VoiceMemo? by remember {
        mutableStateOf(null)
    }
    var show: Boolean by remember {
        mutableStateOf(false)
    }

    AndroidView(
        factory = {
            MapView(it).also { mapView ->
                val mode =
                    when (it.resources.configuration.uiMode.and(Configuration.UI_MODE_NIGHT_MASK)) {
                        Configuration.UI_MODE_NIGHT_YES -> Style.DARK
                        else -> Style.STANDARD
                    }

                mapView.mapboxMap.loadStyle(mode)

                val zoom = point?.let { pointZoom } ?: location?.let { locationZoom } ?: nothingZoom
                val point = if (point != null) point else Point.fromLngLat(location?.longitude ?: 0.0, location?.latitude ?: 50.0)
                mapView.mapboxMap.setCamera(
                    CameraOptions.Builder()
                        .zoom(zoom)
                        .center(point)
                        .pitch(0.0)
                        .build()
                )

                val pointAnnotationManager = mapView.annotations.createPointAnnotationManager()
                memos.forEach { memo ->
                    val point = Point.fromLngLat(memo.longitude!!, memo.latitude!!)
                    val annotation = pointAnnotationManager.create(
                        PointAnnotationOptions()
                            .withPoint(point)
                            .withIconImage(
                                ctx.getDrawable(R.drawable.outline_location)!!
                                    .toBitmap(64, 64)
                            )
                    )

                    annotationMemoMap.put(annotation.id, memo)
                }

                pointAnnotationManager.addClickListener { pointAnnotation ->
                    val currentZoom = mapView.mapboxMap.cameraState.zoom
                    val zoom = if (currentZoom > pointZoom) currentZoom else pointZoom
                    Log.d("zoom", "cz: ${currentZoom}, pz: ${pointZoom}, final: ${zoom}")

                    mapView.mapboxMap.flyTo(
                        CameraOptions.Builder().center(pointAnnotation.point).zoom(zoom).build(),
                        MapAnimationOptions.Builder().duration(1000).build(),
                    )

                    currentMemo = annotationMemoMap.get(pointAnnotation.id)!!
                    show = true
                    true
                }

                mapView.mapboxMap.addOnMoveListener(listener = object : OnMoveListener {
                    override fun onMove(detector: MoveGestureDetector): Boolean {
                        return false
                    }

                    override fun onMoveBegin(detector: MoveGestureDetector) {
                        show = false
                    }

                    override fun onMoveEnd(detector: MoveGestureDetector) {}
                })
            }
        },
    )
    Box(
        modifier = Modifier
            .fillMaxSize()
            .zIndex(1f)
    ) {
        AnimatedVisibility(
            visible = show,
            enter = scaleIn(transformOrigin = TransformOrigin(0.5f, 2.0f)),
            exit = scaleOut(transformOrigin = TransformOrigin(0.5f, 2.0f)),
            modifier = Modifier
                .fillMaxWidth(0.7f)
                .height(48.dp)
                .offset(y = (-24).dp)
                .align(Alignment.BottomCenter)
        ) {
            Button(
                onClick = {
                    val intent = Intent(ctx, VoiceMemoActivity::class.java)
                    intent.putExtra("memo", currentMemo)
                    ctx.startActivity(intent)
                }
            ) {
                Text(text = "Open")
            }
        }
    }
}

@Composable
fun Other(padding: PaddingValues) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(padding),
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "To use map enter mapbox api key in settings",
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxWidth()
        )
    }
}
