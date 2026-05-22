import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddEventScreen from './src/screens/AddEventScreen';
import EditEventScreen from './src/screens/EditEventScreen';
import { auth } from './src/firebase/config';

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F4FBF8',
    card: '#FFFFFF',
    border: '#D7ECE5',
    primary: '#4F9D88',
    text: '#1F3B33',
    notification: '#FF8C69',
  },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#4F9D88" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#F4FBF8' },
          headerTintColor: '#1F3B33',
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#F4FBF8' },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Home" options={{ title: 'Family Diary' }}>
              {(props) => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="AddEvent" options={{ title: 'Add Event' }}>
              {(props) => <AddEventScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="EditEvent" options={{ title: 'Edit Event' }}>
              {(props) => <EditEventScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {(props) => <LoginScreen {...props} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4FBF8',
  },
});
