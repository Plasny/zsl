import { StyleSheet, Switch, Text, View } from "react-native";
import theme from "../screens/theme";
import { useEffect, useState } from "react";

export default function LocationEl(props) {
    const [state, setState] = useState()

    const update = () => {
        if (props.selectedList[props.idx])
            props.selectedList[props.idx] = false
        else
            props.selectedList[props.idx] = true

        props.setSelected([...props.selectedList])
    }

    return (
        <View style={s.main}>
            {
                // <View style={{ justifyContent: "center", alignItems: "center", marginLeft: 15 }}>
                //     <Text style={{ fontSize: 35 }}>📌</Text>
                // </View>
            }
            <View>
                <Text style={s.smText}>timestamp:</Text>
                <Text style={s.text}>{props.data.timestamp}</Text>
                <View style={s.row}>
                    <View>
                        <Text style={s.smText}>latitude:</Text>
                        <Text style={s.text}>{props.data.coords.latitude.toString().substring(0, 14)}</Text>
                    </View>
                    <View>
                        <Text style={s.smText}>longitude</Text>
                        <Text style={s.text}>{props.data.coords.longitude.toString().substring(0, 14)}</Text>
                    </View>
                </View>
            </View>
            <View style={{ justifyContent: "center", marginRight: 15 }}>
                <Switch
                    trackColor={{true: theme.accentColor}}
                    thumbColor={props.selectedList[props.idx] ? theme.accentColor : theme.lightColor}
                    onValueChange={() => update()}
                    value={props.selectedList[props.idx] || false}
                />
            </View>
        </View>
    )
}

const s = StyleSheet.create({
    main: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        borderBottomWidth: 2,
        borderColor: theme.lightColor
    },
    row: {
        flexDirection: "row",
        gap: 20,
    },
    smText: {
        color: theme.lightColor,
        fontSize: 10,
        marginBottom: 5
    },
    text: {
        color: theme.lightColor,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    }
})
