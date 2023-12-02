import { Dimensions, StyleSheet, Text, TouchableNativeFeedback, Vibration, View } from "react-native"
import theme from "../screens/theme";
import { padWithZero } from "../helpers";

function AbsBtn(props) {
    const size = props.size ? props.size : 90
    const s = StyleSheet.create({
        btn: {
            position: "absolute",
            top: props.top,
            left: props.left,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.darkColor,
            justifyContent: "center",
            alignItems: "center",
        }
    })

    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(theme.accentColor, true)}
            onPress={() => {
                Vibration.vibrate(20)
                props.onPress()
            }}
        >
            <View style={s.btn}>
                <Text style={{ color: theme.lightColor }}>{props.text}</Text>
            </View>
        </TouchableNativeFeedback>
    )
}

export function SelectHour(props) {
    const ang = 360 / 12 * Math.PI / 180;
    const els = [];
    let size, x_center, y_center, r;

    size = 60
    x_center = (Dimensions.get("window").width - size) / 2;
    y_center = (Dimensions.get("window").height - size) / 2 - 150;
    r = 160;
    for (let i = 0; i < 12; i++) {
        const value = i < 9 ? 3 + i : i - 9;
        els.push(<AbsBtn
            key={i}
            size={size}
            text={padWithZero(value)}
            top={y_center + r * Math.sin(ang * i)}
            left={x_center + r * Math.cos(ang * i)}
            onPress={() => props.set(value)}
        />)
    }

    size = 40
    x_center = (Dimensions.get("window").width - size) / 2;
    y_center = (Dimensions.get("window").height - size) / 2 - 150;
    r = 90;
    for (let i = 0; i < 12; i++) {
        const value = i < 9 ? 15 + i : i + 3;
        els.push(<AbsBtn
            key={i + 12}
            size={size}
            text={value}
            top={y_center + r * Math.sin(ang * i)}
            left={x_center + r * Math.cos(ang * i)}
            onPress={() => props.set(value)}
        />)
    }

    return (
        <View>
            {els}
        </View>
    )
}

export function SelectMinute(props) {
    const ang = 360 / 12 * Math.PI / 180;
    const els = [];
    let size, x_center, y_center, r;

    const updateMinutes = (value) => {
        if (value == props.last) {
            props.incr()
        } else {
            props.set(value)
        }
    }

    size = 60
    x_center = (Dimensions.get("window").width - size) / 2;
    y_center = (Dimensions.get("window").height - size) / 2 - 150;
    r = 160;
    for (let i = 0; i < 12; i++) {
        const tmp = i * 10 / 2 + 15 
        const value = tmp < 60 ? tmp : tmp - 60
        els.push(<AbsBtn
            key={i}
            size={size}
            text={padWithZero(value)}
            top={y_center + r * Math.sin(ang * i)}
            left={x_center + r * Math.cos(ang * i)}
            onPress={() => updateMinutes(value)}
        />)
    }

    return (
        <View style={{ flex: 1 }}>
            {els}
        </View>
    )
}
