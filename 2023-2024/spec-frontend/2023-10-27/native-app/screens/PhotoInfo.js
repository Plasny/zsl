import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import theme from "./theme";
import Btn from "../components/Btn";
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from "expo-media-library";
import { serverAddr, serverPort } from "../app-settings";

export default function PhotoInfo(props) {
    const img = props.route.params.img
    const size = Dimensions.get("window").width - 40

    const s = StyleSheet.create({
        main: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.darkColor
        },
        text: {
            fontSize: 15,
            color: theme.lightColor
        },
        img: {
            width: size,
            height: img.height / img.width * size
        }
    })

    const shareImg = async () => {
        await Sharing.shareAsync(img.uri)
    }

    const deleteImg = async () => {
        try {
            await MediaLibrary.deleteAssetsAsync(img.id)
            await props.route.params.loadPhotos()
        } catch (err) {
            console.log('error', err)
        }

        props.navigation.goBack()
    }

    const uploadImg = async () => {
        const data = new FormData();
        data.append("photo", {
            uri: img.uri,
            type: "image/jpeg",
            name: img.filename,
        })
        data.append("photoName", img.filename)

        try {
            const res = await fetch(`http://${serverAddr}:${serverPort}/files`, {
                method: 'POST',
                body: data
            })

            console.log(res)
        } catch (err) {
            alert("We were unable to upload the photo")
            return
        }

        alert("Photo uploaded")
    }

    return (
        <View style={s.main}>
            <Image style={s.img} source={{ uri: img.uri }} />
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                <Text style={s.text}>Filename: {img.filename}</Text>
                <Text style={s.text}>Created: {new Date(img.creationTime).toLocaleString()}</Text>
                <Text style={s.text}>Size: {img.width} x {img.height}</Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10 }}>
                <Btn text="Share" fn={shareImg} />
                <Btn text="Delete" fn={deleteImg} />
                <Btn text="Upload" fn={uploadImg} />
            </View>
        </View>
    )
}

