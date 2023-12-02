import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import theme from './screens/theme';
import Landing from './screens/Landing';
import AlarmList from './screens/AlarmList';
import CreateAlarm from './screens/CreateAlarm';
import Database from './db';
import Alarm from './alarm';

const Stack = createNativeStackNavigator()
Database.Init()
Alarm.Init()

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Landing"
                    component={Landing}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Alarm List"
                    component={AlarmList}
                    options={{
                        title: "Alarm List",
                        headerStyle: {
                            backgroundColor: theme.lightColor,
                        },
                        headerTintColor: theme.darkColor,
                        headerTitleAlign: "center"
                    }}
                />
                <Stack.Screen
                    name="Add Alarm"
                    component={CreateAlarm}
                    options={{
                        title: "Add Alarm",
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
