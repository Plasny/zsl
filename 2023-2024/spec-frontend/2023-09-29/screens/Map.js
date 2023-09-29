import { StyleSheet, View } from "react-native";
import theme from "./theme";
import { StatusBar } from "expo-status-bar";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

export default function Map(props) {
    const markers = []

    for (const el of props.route.params) {
        markers.push(<Marker key={Math.random()} coordinate={{ longitude: el.longitude, latitude: el.latitude }} pinColor={theme.accentColor} />)
    }

    return (
        <View style={s.main}>
            <StatusBar />
            <MapView
                style={{ flex: 1 }}
            >
                {markers}
            </MapView>
        </View>
    )
}

const s = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme.darkColor
    },
    text: {
        fontSize: 20,
        color: theme.accentColor
    }
})

