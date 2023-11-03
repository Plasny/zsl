import { StyleSheet, Text, TouchableHighlight } from "react-native";
import theme from "../screens/theme";

export default function Btn(props) {
    const fn = props.fn ? props.fn : () => console.log("click")

    return (
        <TouchableHighlight
            style={s.view}
            onPress={fn}
        >
            <Text style={s.text}>{props.text}</Text>
        </TouchableHighlight>
    )
}

const s = StyleSheet.create({
    view: {
        backgroundColor: theme.accentColor,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 5,
        flex: 1,
    },
    text: {
        color: theme.darkColor,
        fontSize: 20,
        margin: 10
    }
})
