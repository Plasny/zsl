import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import theme from './screens/theme';
import Start from './screens/Startup';
import Gallery from './screens/Gallery';
import Camera from './screens/Camera';
import PhotoInfo from './screens/PhotoInfo';
import Settings from './screens/Settings';
import { initCfg } from './app-settings';

const Stack = createNativeStackNavigator()
initCfg();

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
                    name="Gallery"
                    component={Gallery}
                    options={{
                        title: "Gallery",
                        headerStyle: {
                            backgroundColor: theme.lightColor,
                        },
                        headerTintColor: theme.darkColor,
                        headerTitleAlign: "center"
                    }}
                />
                <Stack.Screen
                    name="Camera"
                    component={Camera}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                        title: "Settings",
                        headerStyle: {
                            backgroundColor: theme.lightColor,
                        },
                        headerTintColor: theme.darkColor,
                        headerTitleAlign: "center"
                    }}
                />
                <Stack.Screen
                    name="PhotoInfo"
                    component={PhotoInfo}
                    options={{
                        title: "Photo details",
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
