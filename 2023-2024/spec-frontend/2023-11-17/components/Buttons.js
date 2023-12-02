import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableNativeFeedback, Vibration, View } from 'react-native';
import theme from '../screens/theme';

export function WeekBtn(props) {
    const fn = () => {
        Vibration.vibrate(20);
        props.update()
    }
    if (props.show) {
        return <FontAwesome5 name="arrow-alt-circle-down" size={30} color="black" onPress={fn} />
    } else {
        return <FontAwesome5 name="arrow-alt-circle-up" size={30} color="black" onPress={fn} />
    }
}

export function DayBtn(props) {
    const fn = () => {
        Vibration.vibrate(20);
        props.update()
    }
    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(theme.darkColor, false)}
            style={{borderRadius: 20}}
            onPress={fn}
        >
            <View style={[s.day, props.active ? s.on : s.off]}>
                <Text style={props.active ? s.on : s.off}>{props.text}</Text>
            </View>
        </TouchableNativeFeedback>
    )
}

const s = StyleSheet.create({
    day: {
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 30,
        borderRadius: 10,
        borderWidth: 1,
    },
    on: {
        backgroundColor: theme.darkColor,
        color: theme.lightColor,
        borderColor: theme.darkColor,
    },
    off: {
        color: theme.darkColor,
        borderColor: theme.darkColor,
    },
})
