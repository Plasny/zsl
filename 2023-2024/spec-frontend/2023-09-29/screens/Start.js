import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import * as Font from "expo-font"; // font loading
import theme from "./theme";
import { useEffect, useState } from "react";

export default function Start(props) {
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        Font.loadAsync({
            'jetbrainsFont': require('../assets/JetBrainsMono-Medium.ttf')
        }).then(() => setFontLoaded(true))
    }, [])

    return (
        <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => props.navigation.navigate("LocationList")}
        >
            <View style={s.main}>
                <StatusBar />
                <Text style={[s.largeText, fontLoaded ? s.specialFont : null]}>Geolocation App</Text>
                <Text style={s.text}>Find your current position in the world!</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

const s = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme.darkColor
    },
    largeText: {
        fontSize: 50,
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

