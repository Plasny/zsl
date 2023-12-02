import { StyleSheet, Switch, Vibration, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from "../screens/theme";

export function VibrateSwitch(props) {
    const fn = () => {
        Vibration.vibrate(20);
        props.update()
    }
    return (
        <View style={s.row}>
            <MaterialCommunityIcons name="vibrate-off" size={24} color="black" />
            <Switch 
                thumbColor={theme.accentColor} 
                trackColor={{false: theme.darkColor, true: theme.accentColor}} 
                onChange={fn} 
                value={props.enabled} 
            />
            <MaterialCommunityIcons name="vibrate" size={24} color="black" />
        </View>
    )
}

export function SoundSwitch(props) {
    const fn = () => {
        Vibration.vibrate(20);
        props.update()
    }
    return (
        <View style={s.row}>
            <MaterialCommunityIcons name="volume-mute" size={24} color="black" />
            <Switch 
                thumbColor={theme.accentColor} 
                trackColor={{false: theme.darkColor, true: theme.accentColor}} 
                onChange={fn} 
                value={props.enabled} 
            />
            <MaterialCommunityIcons name="volume-high" size={24} color="black" />
        </View>
    )
}

const s = StyleSheet.create({
    row: {
        height: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    }
})
