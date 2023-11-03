import * as MediaLibrary from "expo-media-library";
import { StyleSheet, View, FlatList } from "react-native";
import Btn from "../components/Btn";
import { useEffect, useState } from "react";
import theme from './theme';
import PhotoSmall from "../components/Photo";
import * as ImagePicker from "expo-image-picker";
import { serverAddr, serverPort } from "../app-settings";

export default function Start(props) {
    const [gridView, setGridView] = useState(true);
    const [photos, setPhotos] = useState({ assets: [] });
    const [selected, setSelected] = useState([])

    const loadPhotos = async () => {
        setPhotos(await MediaLibrary.getAssetsAsync({
            first: 100,
            mediaType: 'photo',
            sortBy: 'creationTime'
        }))
    }

    const uploadImg = async (asset) => {
        const data = new FormData();
        const name = "PhotoApp_" + new Date()
            .toISOString()
            .replaceAll(/[-:,.Z]/g, "")
            .replace("T", "_") + ".jpg"

        data.append("photo", {
            uri: asset.uri,
            type: "image/jpeg",
            name: name,
        })
        data.append("photoName", name)

        try {
            await fetch(`http://${serverAddr}:${serverPort}/files`, {
                method: 'POST',
                body: data
            })
        } catch (err) {
            alert("We were unable to upload " + name)
        }
    }

    const uploadImgs = async (selected) => {
        let ok = selected.length;

        for (const asset_id of selected) {
            const asset = await MediaLibrary.getAssetInfoAsync(asset_id)
            const data = new FormData();
            data.append("photo", {
                uri: asset.uri,
                type: "image/jpeg",
                name: asset.filename,
            })
            data.append("photoName", asset.filename)

            try {
                await fetch(`http://${serverAddr}:${serverPort}/files`, {
                    method: 'POST',
                    body: data
                })
            } catch (err) {
                // alert("We were unable to upload " + asset.filename)
                ok--;
            }
        }

        alert(`${ok}/${selected.length} photos uploaded succesfully`)
    }

    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync()
            if (status !== 'granted') {
                alert('You did not give permission to display photos and videos from gallery.')
                return
            }

            await loadPhotos()
        })()
    }, [])

    return (
        <View style={s.main}>
            <View style={{ flexDirection: "row" }}>
                <Btn text="grid/list" fn={() => setGridView(!gridView)} />
                <Btn text="camera" fn={() => props.navigation.navigate("Camera", { loadPhotos: loadPhotos })} />
                <Btn text="settings" fn={() => props.navigation.navigate("Settings")} />
            </View>
            <View style={{ flexDirection: "row" }}>
                <Btn text="delete" fn={async () => {
                    await MediaLibrary.deleteAssetsAsync(selected)
                    setSelected([])

                    await loadPhotos()
                }} />
                <Btn text="edit" fn={async () => {
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.All,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                    });

                    if (result.canceled) return

                    await uploadImg(result.assets[0])
                }} />
                <Btn text="upload" fn={async () => {
                    await uploadImgs(selected)
                    setSelected([])
                }} />
            </View>

            <FlatList
                style={s.grid}
                numColumns={gridView ? 4 : 1}
                key={gridView}
                data={photos.assets}
                renderItem={({ item }) => <PhotoSmall
                    img={item}
                    grid={gridView}
                    selected={selected}
                    setSelected={setSelected}
                    navigate={() => props.navigation.navigate("PhotoInfo", { img: item, loadPhotos: loadPhotos })}
                />}
            />
        </View>
    )
}

const s = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: theme.darkColor
    },
    grid: {
        flex: 1,
    },
    largeText: {
        fontSize: 120,
        textAlign: "center",
        color: theme.accentColor,
        marginBottom: 10
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        color: theme.accentColor
    },
    specialFont: {
        fontFamily: "jetbrainsFont",
        fontSize: 40
    },

})

