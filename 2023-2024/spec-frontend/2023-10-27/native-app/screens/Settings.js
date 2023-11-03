import Dialog from "react-native-dialog";
import { StyleSheet, View, Text } from "react-native";
import theme from "./theme";
import { useState } from "react";
import * as cfg from "../app-settings.js";
import Btn from "../components/Btn";

export default function Settings(props) {
    const [addr, setAddr] = useState(cfg.serverAddr)
    const [port, setPort] = useState(cfg.serverPort)
    const [ok, setOk] = useState(false)

    const updateDialog = () => {
        setOk(true)
    }

    const save = () => {
        cfg.setServerAddr(addr)
        cfg.setServerPort(port)
        setOk(false)
    }

    return (
        <View style={s.main}>
            <View style={s.w}>
                <Text style={s.text}>Server address: {addr}</Text>
                <Text style={s.text}>Server port: {port}</Text>
                <View style={s.row}>
                    <Btn fn={updateDialog} text={"Change settings"} />
                </View>
            </View>
            <Dialog.Container visible={ok}>
                <Dialog.Title>Server settings</Dialog.Title>
                <Dialog.Description>
                    Do you want to change server settings?
                </Dialog.Description>

                <Dialog.Input label="Address" onChangeText={text => setAddr(text)}>{addr}</Dialog.Input>
                <Dialog.Input label="Port" onChangeText={text => setPort(text)}>{port}</Dialog.Input>

                <Dialog.Button label="Cancel" onPress={() => setOk(false)} />
                <Dialog.Button label="Save" onPress={save} />
            </Dialog.Container>
        </View>
    )
}

const s = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.darkColor
    },
    text: {
        fontSize: 20,
        color: theme.accentColor
    },
    w: {
        width: 300,
    },
    row: {
        marginTop: 20,
        height: 80,
    }
})

