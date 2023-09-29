import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Start from './screens/Start';
import LocationList from './screens/LocationList';
import Map from './screens/Map';
import theme from './screens/theme';

const Stack = createNativeStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Start"
                    component={Start}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Map"
                    component={Map}
                    options={{
                        title: "Map",
                        headerStyle: {
                            backgroundColor: theme.lightColor,
                        },
                        headerTintColor: theme.darkColor,
                        headerTitleAlign: "center"
                    }}
                />
                <Stack.Screen
                    name="LocationList"
                    component={LocationList}
                    options={{
                        title: "Locations",
                        headerStyle: {
                            backgroundColor: theme.lightColor,
                        },
                        headerTintColor: theme.darkColor,
                        headerTitleAlign: "center"
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
