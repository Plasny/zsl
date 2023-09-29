import { StyleSheet, View, FlatList, ActivityIndicator, Alert } from "react-native";
import theme from "./theme";
import { StatusBar } from "expo-status-bar";
import Btn from "../components/btn";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocationEl from "../components/locationEl";

export default function LocationList(props) {
    const [locationList, setLocationList] = useState([])
    const [selectedLocations, setSelectedLocations] = useState([])
    const [showSpinner, setShowSpinner] = useState(false)

    const deleteAll = async () => {
        setLocationList([])
        setSelectedLocations([])

        try {
            await AsyncStorage.removeItem("locations");
            console.log("locations deleted")
        } catch {
            console.log("error deleting locations")
        }
    }

    const saveLocation = async (pos) => {
        setLocationList([pos, ...locationList])

        try {
            await AsyncStorage.setItem("locations", JSON.stringify([pos, ...locationList]));
            console.log("location saved")
        } catch {
            console.log("error saving locations")
        }

    }

    const selectAll = () => {
        for (let i in locationList)
            selectedLocations[i] = true

        console.log(selectedLocations)
        setSelectedLocations([...selectedLocations])
    }

    const getLocation = async () => {
        setShowSpinner(true)
        const pos = await Location.getCurrentPositionAsync({})

        Alert.alert(
            "We got your location",
            "Should we save the following data:\n" + JSON.stringify(pos, null, 4),
            [
                { text: "Yes", onPress: () => saveLocation(pos) },
                { text: "No" }
            ]
        )

        setShowSpinner(false)
    }

    const goToMap = () => {
        let ok = false;
        const locations = []

        for (const i in selectedLocations) {
            if (selectedLocations[i] == true) {
                ok = true
                locations.push({
                    longitude: locationList[i].coords.longitude,
                    latitude: locationList[i].coords.latitude
                })
            }
        }

        if (ok)
            props.navigation.navigate("Map", locations)
        else
            Alert.alert("Wrong data", "Select at least one location")
    }

    useEffect(() => {
        (async () => {
            const res = await Location.requestForegroundPermissionsAsync();

            if (res.status != "granted") {
                alert("Permission not granted.\nApp will not work without it.")
                // props.navigation.navigate("Start")
            }
        })()

        AsyncStorage.getItem("locations")
            .then(data => setLocationList(data ? JSON.parse(data) : []))
    }, [])

    return (
        <View style={s.main}>
            <StatusBar />
            <View style={{ flex: 1 }}>
                <View style={s.row}>
                    {showSpinner
                        ? <ActivityIndicator size="large" color={theme.darkColor} style={s.spinner} />
                        : <Btn text="Check your current position" fn={getLocation} />
                    }
                </View>
                <View style={s.row}>
                    <Btn text="Select all" fn={selectAll} />
                    <Btn text="Delete" fn={deleteAll} />
                    <Btn text="Go to map" fn={goToMap} />
                </View>
            </View>
            <View style={{ flex: 6 }}>
                <FlatList
                    data={locationList}
                    renderItem={({ item, index }) => <LocationEl data={item} idx={index} selectedList={selectedLocations} setSelected={setSelectedLocations} />}
                />
            </View>
        </View>
    )
}

const s = StyleSheet.create({
    spinner: {
        flex: 1,
        margin: 5,
        backgroundColor: theme.accentColor,
        borderColor: theme.accentColor,
        borderWidth: 2,
        borderRadius: 10
    },
    main: {
        flex: 1,
        padding: 10,
        backgroundColor: theme.darkColor
    },
    row: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "center"
    },
    text: {
        fontSize: 20,
        color: theme.lightColor
    }
})

