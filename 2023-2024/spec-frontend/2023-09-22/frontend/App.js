import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './screens/Register';
import UserList from './screens/UserList';
import UserDetails from './screens/UserDetails';
import theme from './js/theme';

const Stack = createNativeStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="RegisterScreen"
                    component={Register}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="UserListScreen"
                    component={UserList}
                    options={{
                        title: "List of users",
                        headerStyle: {
                            backgroundColor: theme.lightColor,
                        },
                        headerTintColor: theme.accentColor,
                        headerTitleAlign: "center"
                    }}
                />
                <Stack.Screen
                    name="UserDetailsScreen"
                    component={UserDetails}
                    options={{
                        title: "User details",
                        headerStyle: {
                            backgroundColor: theme.lightColor,
                        },
                        headerTintColor: theme.accentColor,
                        headerTitleAlign: "center"
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
