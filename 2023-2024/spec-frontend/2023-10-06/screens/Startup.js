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
            onPress={() => props.navigation.navigate("Gallery")}
        >
            <View style={s.main}>
                <StatusBar />
                <Text style={[s.largeText, fontLoaded ? s.specialFont : null]}>Camera App</Text>
                <Text style={s.text}>take pictures with camera</Text>
                <Text style={s.text}>then show them in the gallery</Text>
                <Text style={s.text}>save them to device storage</Text>
                <Text style={s.text}>delete or share them</Text>
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

