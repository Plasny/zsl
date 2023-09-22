import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import Btn from "../components/Btn.js";
import theme from "../js/theme";
import { useEffect, useState } from "react";
import settings from "../js/settings.js";

function delUser(user) {
    const url = settings.server + "/users/" + user
    fetch(url, { method: "DELETE" })
}

export default function UserList(props) {
    const [msg, setMsg] = useState(<Text style={s.TextCenter}>Waiting...</Text>)
    const [deleteCount, setCount] = useState(0)

    const getList = async () => {
        const url = settings.server + "/users"
        let res

        try {
            res = await fetch(url)
        } catch {
            return <Text style={s.TextCenter}>Error connecting to the server</Text>
        }

        if (!res.ok) {
            return <Text style={s.TextCenter}>Error processing the request</Text>
        }

        const userList = await res.json()
        return <FlatList style={{ flex: 1 }} data={userList} renderItem={ListEl} />
    }


    const ListEl = (({ item }) => {
        return (
            <View style={s.lietEl}>
                <View>
                    <Image style={s.img} source={require('../assets/user.png')} />
                </View>
                <View style={{ flex: 3 }}>
                    <Text style={s.smText}>username:</Text>
                    <Text style={s.text}>{item.username}</Text>
                </View>
                <View style={{ flex: 2 }}>
                    <Btn text="Details" fn={() => props.navigation.navigate("UserDetailsScreen", item)} />
                    <Btn text="Delete" fn={() => {
                        delUser(item.username)
                        setCount(deleteCount + 1)
                    }} />
                </View>
            </View>
        )
    })

    useEffect(() => {
        getList(props.navigation).then(content => setMsg(content))
    }, [deleteCount])

    return (
        <View style={{ flex: 1, backgroundColor: theme.lightColor }}>
            {msg}
        </View>
    )
}

const s = StyleSheet.create({
    img: {
        margin: 10,
        height: 100,
        width: 100,
    },
    TextCenter: {
        textAlign: "center",
        fontSize: 15,
        color: theme.darkColor
    },
    lietEl: {
        padding: 10,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: theme.accentColor,
        fontSize: 30,
    },
    smText: {
        color: theme.darkColor,
        fontSize: 15,
    }
})
