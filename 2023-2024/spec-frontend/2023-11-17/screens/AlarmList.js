import { ScrollView, StyleSheet, View, TouchableNativeFeedback, Vibration } from "react-native";
import Database from "../db";
import { useEffect, useState } from "react";
import AlarmEl from "../components/AlarmListEl";
import { FontAwesome5 } from '@expo/vector-icons';
import theme from "./theme";
import Alarm from "../alarm.js"

export default function AlarmList(props) {
    const [alarms, setAlarms] = useState([]);
    const [alarmEls, setAlarmEls] = useState(<></>);

    const getAlarms = async () => setAlarms(await Database.get())
    const delAlarm = (id) => {
        setAlarms(alarms.filter(el => el.id != id))
    }
    const addAlarm = async () => {
        Vibration.vibrate(20)
        props.navigation.navigate("Add Alarm")
    }

    useEffect(() => {
        let interval;

        props.navigation.addListener('focus', () => {
            getAlarms()
            interval = setInterval(() => {
                Alarm.checkForAlarm()
            }, 500)
        });

        props.navigation.addListener('blur', () => {
            clearInterval(interval)
        })
    }, [])

    useEffect(() => {
        // console.log("els => ", alarms)
        let arr = [];

        for (const alarm of alarms) {
            arr.push(<AlarmEl data={alarm} key={alarm.id} update={getAlarms} del={() => delAlarm(alarm.id)} />)
        }

        setAlarmEls(arr)
    }, [alarms]);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                {alarmEls}
                <View style={{ height: 120 }} />
            </ScrollView>
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
