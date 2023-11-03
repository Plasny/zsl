import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import theme from "../screens/theme";
import { useEffect, useState } from "react";

export default function PhotoSmall(props) {
    const size = props.grid ? Dimensions.get("screen").width / 4 - 10 : Dimensions.get("screen").width - 10
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        if(props.selected.length == 0 && selected) setSelected(false);
    }, [props.selected])

    const s = StyleSheet.create({
        view: {
            margin: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
        },
        imgGrid: {
            borderRadius: 5,
            width: size,
            height: size,
        },
        imgList: {
            borderRadius: 5,
            width: size,
            height: props.img.height / props.img.width * size,
        },
        text: {
            position: "absolute",
            bottom: 0,
            left: 0,
            margin: 5,
            color: theme.lightColor,
            textShadowColor: theme.darkColor,
            textShadowRadius: 5,
            fontSize: props.grid ? 10 : 20,
            // backgroundColor: theme.darkColor + "20",
            // paddingHorizontal: 2,
            // borderRadius: 5,
        },
        selected: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.darkColor + "88",
            justifyContent: "center",
            alignItems: "center",
        }
    })

    return (
        <TouchableHighlight
            onPress={() => {
                if (selected) {
                    setSelected(false)
                    props.setSelected(props.selected.filter(el => el != props.img.id))
                    return
                }

                if (props.selected.length > 0) {
                    setSelected(true)
                    props.setSelected([...props.selected, props.img.id])
                    return
                }

                props.navigate()
            }}
            onLongPress={() => {
                if(selected) return

                setSelected(true)
                props.setSelected([...props.selected, props.img.id])
            }}
        >
            <View style={s.view}>
                <Image style={props.grid ? s.imgGrid : s.imgList} source={{ uri: props.img.uri }} />
                <Text style={s.text}>{props.img.id}</Text>
                <View style={selected ? s.selected : { display: "none" }}>
                    <Text style={{ fontSize: 60, color: theme.lightColor + "aa" }}>+</Text>
                </View>
            </View>
        </TouchableHighlight>
    )
}
