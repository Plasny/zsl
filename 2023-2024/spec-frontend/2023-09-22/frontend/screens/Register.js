import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import Btn from "../components/Btn";
import theme from "../js/theme"
import settings from "../js/settings"

export default function Register(props) {
    const [name, setName] = useState("")
    const [pass, setPass] = useState("")
    const [msg, setMsg] = useState("")

    const registerUser = async () => {
        const timeoutInMs = 3000
        const controller = new AbortController()
        const id = setTimeout(() => controller.abort(), timeoutInMs)

        let res
        const url = settings.server + "/users"
        const json = JSON.stringify({
            name: name,
            pass: pass
        })

        setMsg("")

        try {
            res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: json,
                signal: controller.signal
            })
        } catch {
            setMsg("Error trying to connect to server")
            return
        } finally {
            clearTimeout(id)
        }

        if (res.ok) {
            props.navigation.navigate("UserListScreen")
        } else {
            res.text().then(text => setMsg(text))
        }
    }

    return (
        <View style={s.main}>
            <StatusBar />

            <View style={{ alignItems: "center", marginBottom: 10 }}>
                <Text style={{ fontSize: 40, color: theme.darkColor }}>Register</Text>
            </View>

            <TextInput
                style={s.textInput}
                placeholder="username"
                cursorColor={theme.darkColor}
                selectionColor={theme.accentColor}
                onChangeText={setName}
            />
            <TextInput
                style={s.textInput}
                placeholder="password"
                autoComplete="new-password"
                cursorColor={theme.darkColor}
                selectionColor={theme.accentColor}
                onChangeText={setPass}
            />

            <Btn text="create user" fn={registerUser} />

            <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 10, color: theme.darkColor }}>{msg}</Text>
            </View>
        </View>
    )
}

const s = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: theme.lightColor,
        justifyContent: "center",
    },
    textInput: {
        padding: 10,
        fontSize: 20,
        margin: 10,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: theme.accentColor,
        color: theme.darkColor
    }
})
