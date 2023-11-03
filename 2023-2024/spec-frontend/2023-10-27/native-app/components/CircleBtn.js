import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import theme from "../screens/theme";

export default function CircleBtn(props) {
    const s = StyleSheet.create({
        view: {
            backgroundColor: theme.accentColor,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
            margin: 20,
            width: props.size ? props.size : 100,
            height: props.size ? props.size : 100,
        },
        text: {
            color: theme.darkColor,
            fontSize: 20,
            margin: 10
        }
    })

    const fn = props.fn ? props.fn : () => console.log("click")

    return (
        <TouchableHighlight
            style={s.view}
            onPress={fn}
        >
            <View>
                {props.children}
            </View>
        </TouchableHighlight>
    )
}

