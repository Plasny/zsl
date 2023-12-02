import { useRef, useState } from "react";
import { Animated, StyleSheet, Text, Vibration, View } from "react-native";
import Database from "../db";
import { FontAwesome5 } from '@expo/vector-icons';
import { SoundSwitch, VibrateSwitch } from "./Switches";
import { DayBtn, WeekBtn } from "./Buttons";
import { padWithZero } from "../helpers";

const WITH_WEEK_HEIGHT = 200;
const BASE_HEIGHT = WITH_WEEK_HEIGHT / 4 * 3;

export default function AlarmEl(props) {
    const a = props.data;
    const hour = padWithZero(props.data.hour)
    const minute = padWithZero(props.data.minute)
    const [show, setShow] = useState(false)
    const [vibrate, setVibrate] = useState(a.active_vibration == 0 ? false : true)
    const [sound, setSound] = useState(a.active_sound == 0 ? false : true)
    const [weekdays, setWeekdays] = useState(JSON.parse(a.weekdays))
    const height = useRef(new Animated.Value(BASE_HEIGHT + 10)).current
    const borderW = useRef(new Animated.Value(2)).current


    const s = StyleSheet.create({
        item: {
            height: height,
            borderBottomWidth: borderW,
        },
        container: {
            flex: 1,
            height: BASE_HEIGHT + 10,
            overflow: "hidden",
        },
        time: {
            fontSize: 60,
        },
        row: {
            marginHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        f1: {
            height: WITH_WEEK_HEIGHT / 4,
        },
        f2: {
            height: WITH_WEEK_HEIGHT / 2,
        },
    })

    const showWeek = () => {
        setShow(!show)

        if (show) {
            Animated.timing(height, {
                toValue: BASE_HEIGHT + 10,
                duration: 300,
                useNativeDriver: false
            }).start()
        } else {
            Animated.timing(height, {
                toValue: WITH_WEEK_HEIGHT + 10,
                duration: 300,
                useNativeDriver: false
            }).start()
        }
    }

    const remove = async () => {
        Vibration.vibrate(20)
        Database.remove(a.id)
        Animated.timing(height, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false
        }).start(props.del)
        Animated.timing(borderW, {
            toValue: 0.1,
            duration: 300,
            useNativeDriver: false
        }).start()
    }

    const updateSound = async () => {
        Database.update_sound(a.id, !sound)
        setSound(!sound)
    }

    const updateVibrate = async () => {
        Database.update_vibration(a.id, !vibrate)
        setVibrate(!vibrate)
    }

    const updateWeekDay = async (n) => {
        weekdays[n] = !weekdays[n]
        Database.update_weekdays(a.id, weekdays)
        setWeekdays([...weekdays])
    }

    return (
        <Animated.View style={s.item}>
            { /* <Text>Alarm #{a.id}</Text> */}
            <View style={s.container}>
                <View style={[s.row, s.f2]}>
                    <Text style={s.time}>{hour}:{minute}</Text>
                    <View>
                        <SoundSwitch enabled={sound} update={updateSound} />
                        <VibrateSwitch enabled={vibrate} update={updateVibrate} />
                    </View>
                </View>
                <View style={[s.row, s.f1]}>
                    <FontAwesome5 name="trash-alt" size={30} color="black" onPress={remove} />
                    <WeekBtn show={!show} update={showWeek} />
                </View>
                <View style={[s.row, s.f1]}>
                    <DayBtn text="Mon" active={weekdays[0]} update={() => updateWeekDay(0)} />
                    <DayBtn text="Tue" active={weekdays[1]} update={() => updateWeekDay(1)} />
                    <DayBtn text="Wed" active={weekdays[2]} update={() => updateWeekDay(2)} />
                    <DayBtn text="Thu" active={weekdays[3]} update={() => updateWeekDay(3)} />
                    <DayBtn text="Fri" active={weekdays[4]} update={() => updateWeekDay(4)} />
                    <DayBtn text="Sat" active={weekdays[5]} update={() => updateWeekDay(5)} />
                    <DayBtn text="Sun" active={weekdays[6]} update={() => updateWeekDay(6)} />
                </View>
            </View>
        </Animated.View>
    )
}

