import { View, Text, StyleSheet, Image } from "react-native"
import theme from "../js/theme"

export default function UserDetails(props) {
    const date = new Date(props.route.params.accountCreation)

    return (
        <View style={s.main}>
            <Image style={s.img} source={require('../assets/user.png')} />
            <View>
                <Text style={s.smText}>username:</Text>
                <Text style={s.text}>{props.route.params.username}</Text>
                <Text style={s.smText}>password:</Text>
                <Text style={s.text}>{props.route.params.password}</Text>
                <Text style={s.smText}>account creation:</Text>
                <Text style={s.text}>{date.toLocaleString()}</Text>
            </View>
        </View>
    )
}

const s = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.lightColor,
    },
    img: {
        width: 250,
        height: 250,
        marginBottom: 30
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
