import { Animated, Dimensions, Easing, ScrollView, StyleSheet, Text, View } from "react-native";
import theme from "../screens/theme";
import { useEffect } from "react";
import RadioGroup from "./RadioGroup";

export default function CameraSettings(props) {
    const screenW = Dimensions.get("window").width;
    const screenH = Dimensions.get("window").height;
    const hiddenPos = -screenH;
    const posY = new Animated.Value(hiddenPos)

    const s = StyleSheet.create({
        view: {
            height: screenH * 0.65,
            top: screenH * 0.1,
            left: screenW * 0.05,
            right: screenW * 0.05,
            position: "absolute",
            backgroundColor: theme.accentColor,
            borderRadius: 10,
            transform: [
                { translateY: posY }
            ],
        },
        bigText: {
            color: theme.lightColor,
            fontSize: 30,
            padding: 20,
            borderBottomWidth: 2,
            borderColor: theme.lightColor,
        },
        text: {
            color: theme.lightColor,
            fontSize: 20,
            marginHorizontal: 20,
            marginVertical: 10,
        },
    })

    const toggle = () => {
        const toPos = props.visible ? 0 : hiddenPos

        Animated.timing(
            posY,
            {
                toValue: toPos,
                duration: 200,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start();
    }

    const groups = [];

    for (const key in props.settings) {
        groups.push(<RadioGroup
            key={key}
            data={props.settings[key]}
            name={key}
            current={props.currentSettings}
            setCurrent={props.setCurrentSettings}
        />)
    }

    useEffect(() => {
        toggle()
    }, [props.visible])

    return (
        <Animated.View style={s.view}>
            <Text style={s.bigText}>Settings</Text>
            <ScrollView style={{ flex: 1 }} w>
                {groups}
            </ScrollView>
        </Animated.View>
    )
}

