import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import theme from "../screens/theme";
import { useEffect, useState } from "react";

function RadioEl(props) {
    return (
        <TouchableHighlight onPress={props.click}>
            <View style={s.row}>
                <View style={s.radioBtn}>
                    {
                        props.current == props.idx
                            ? <View style={s.fill} />
                            : null
                    }
                </View>
                <Text style={s.text}>{props.name}</Text>
            </View>
        </TouchableHighlight>
    )
}

export default function RadioGroup(props) {
    let options = [];
    let defaultValue = 0;

    if(props.name == "Ratio") defaultValue = Array.from(props.data || []).indexOf("4:3") || 0 
    else if(props.name == "Size") defaultValue = Array.from(props.data || []).length - 1

    const [current, setCurrent] = useState(
        Array.from(props.data || []).indexOf(props.current[props.name]) || defaultValue
    )

    useEffect(() => {
        options = []

        for (let i in props.data) {
            const el = props.data[i]
            options.push(<RadioEl key={i} idx={i} name={el} current={current} click={() => setCurrent(i)} />)
        }
    }, [props.data])

    useEffect(() => {
        props.current[props.name] = props.data[current]
        props.setCurrent({ ...props.current })
    }, [current])

    for (let i in props.data) {
        const el = props.data[i]
        options.push(<RadioEl idx={i} name={el} current={current} click={() => setCurrent(i)} />)
    }


    return (
        <View style={s.view}>
            <Text style={s.bigText}>{props.name}</Text>
            {options}
        </View>
    )
}

const s = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    radioBtn: {
        borderRadius: 100,
        borderColor: theme.lightColor,
        borderWidth: 2,
        justifyContent: "center",
        margin: 10,
        width: 20,
        height: 20,
    },
    fill: {
        flex: 1,
        margin: 3,
        backgroundColor: theme.lightColor,
        borderRadius: 100,
    },
    view: {
        borderRadius: 10,
        marginHorizontal: 20,
    },
    bigText: {
        color: theme.lightColor,
        fontSize: 25,
        marginTop: 10,
    },
    text: {
        color: theme.lightColor,
        fontSize: 20,
    }
})
