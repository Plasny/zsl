import { useEffect, useState } from "react";
import theme from "./theme";
import { Camera, CameraType } from "expo-camera";
import { Dimensions, StyleSheet, Image, View, BackHandler } from "react-native";
import CircleBtn from "../components/CircleBtn";
import { Path, Svg } from "react-native-svg";
import * as MediaLibrary from "expo-media-library";

export default function CameraScreen(props) {
    const [front, setFront] = useState(false)
    let camera;

    useEffect(() => {
        (async () => {
            let res = await Camera.requestCameraPermissionsAsync()

            if (res.status != "granted") {
                alert("Permission not granted.\nApp will not work without it.")
            }
        })()

        BackHandler.addEventListener("hardwareBackPress", async () => {
            try {
                await props.route.params.loadPhotos()
            } catch(err) {
                console.log('error', err)
            }

            props.navigation.goBack()
            return true
        })
    }, [])

    const takePhoto = async () => {
        const name = "PhotoApp_" + new Date()
            .toISOString()
            .replaceAll(/[-:,.Z]/g, "")
            .replace("T", "_")

        const photo = await camera.takePictureAsync({
            exif: true,
            skipProcessing: true,
        })
        photo.filename = name

        const res = await MediaLibrary.createAssetAsync(photo.uri)
        // console.log(res)
    }


    return (
        <View style={s.view}>
            <Camera
                ref={ref => camera = ref}
                style={s.camera}
                type={front ? CameraType.front : CameraType.back}
                useCamera2Api={true}
            ></Camera>
            <View style={s.btnRow}>
                <CircleBtn size={80} fn={() => setFront(!front)}>
                    <Svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 30 30" fill={theme.lightColor}>
                        <Path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></Path>
                    </Svg>
                </CircleBtn>
                <CircleBtn fn={takePhoto}><View style={s.circle}></View></CircleBtn>
                <CircleBtn size={80} />
            </View>
        </View>
    )
}

const s = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: theme.darkColor,
        alignItems: "center",
        justifyContent: "center",
    },
    camera: {
        width: Dimensions.get("window").width,
        height: 4 / 3 * Dimensions.get("window").width,
        borderWidth: 2,
        borderColor: theme.accentColor,
    },
    btnRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    circle: {
        borderColor: theme.lightColor,
        width: 80,
        height: 80,
        borderRadius: 100,
        borderWidth: 4
    }
})
