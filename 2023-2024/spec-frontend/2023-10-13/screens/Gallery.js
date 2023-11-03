import * as MediaLibrary from "expo-media-library";
import { StyleSheet, View, FlatList } from "react-native";
import Btn from "../components/Btn";
import { useEffect, useState } from "react";
import theme from './theme';
import PhotoSmall from "../components/Photo";

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
                <Btn text="delete" fn={async () => {
                    await MediaLibrary.deleteAssetsAsync(selected)
                    setSelected([])

                    await loadPhotos()
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

