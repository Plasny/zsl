import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableNativeFeedback, Vibration, View } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { padWithZero } from "../helpers";
import theme from "./theme";
import Database from "../db";
import { SelectHour, SelectMinute } from "../components/TimeSelect";

export default function CreateAlarm(props) {
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [selected, setSelected] = useState("hour");
    const [lastMinute, setLastMinute] = useState(0);
    const [selectedComponent, setSelectedComponent] = useState(<></>)

    const addAlarm = async () => {
        Vibration.vibrate(20)
        await Database.add(hour, minute, [])
        props.navigation.navigate("Alarm List")
    }

    const incrMinute = () => {
        if (minute + 1 >= lastMinute + 5) {
            setMinute(lastMinute)
        } else {
            setMinute(minute + 1)
        }
    }
    
    const newMinute = (value) => {
        setMinute(value)
        setLastMinute(value)
    }

    useEffect(() => {
        switch (selected) {
            case "hour":
                setSelectedComponent(<SelectHour set={setHour} />)
                break;
            case "minute":
                setSelectedComponent(<SelectMinute 
                    set={newMinute} 
                    last={lastMinute} 
                    incr={incrMinute}
                />)
                break;
        }
    }, [selected, minute])

    return (
        <View style={{ flex: 1 }}>
            <View style={s.row}>
                <TouchableNativeFeedback 
                    onPress={() => {
                        Vibration.vibrate(20)
                        setSelected("hour")
                    }}
                >
                    <Text style={[s.bigText, selected == "hour" ? s.selected : null]}>{padWithZero(hour)}</Text>
                </TouchableNativeFeedback>
                <Text style={s.bigText}>:</Text>
                <TouchableNativeFeedback 
                    onPress={() => {
                        Vibration.vibrate(20)
                        setSelected("minute")
                    }}
                >
                    <Text style={[s.bigText, selected == "minute" ? s.selected : null]}>{padWithZero(minute)}</Text>
                </TouchableNativeFeedback>
            </View>
            {selectedComponent}
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(theme.accentColor, true)}
                onPress={addAlarm}
            >
                <View style={s.btn}>
                    <FontAwesome5 name="plus" size={48} color={theme.lightColor} />
                </View>
            </TouchableNativeFeedback>
        </View>
    )
}

const s = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    bigText: {
        fontSize: 100
    },
    selected: {
        color: theme.accentColor
    },
    btn: {
        backgroundColor: theme.darkColor,
        position: "absolute",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        bottom: 20,
    }
})
