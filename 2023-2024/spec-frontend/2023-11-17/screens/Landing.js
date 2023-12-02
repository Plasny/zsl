import { TouchableNativeFeedback, View, Text, StyleSheet, Vibration } from "react-native";
import theme from "./theme";

export default function Landing(props) {
    return (
        <TouchableNativeFeedback
            style={{ flex: 1 }}
            onPress={() => {
                Vibration.vibrate(20)
                props.navigation.navigate("Alarm List")
            }}
            background={TouchableNativeFeedback.Ripple(
                theme.accentColor + "88",
                false,
            )}
        >
            <View style={s.main}>
                <Text style={s.largeText}>Alarm Clock</Text>
            </View>
        </TouchableNativeFeedback>
    )
}

const s = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme.darkColor
    },
    largeText: {
        fontSize: 70,
        textAlign: "center",
        color: theme.accentColor,
        marginBottom: 10
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        color: theme.accentColor
    },
})
