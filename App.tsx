// App.tsx
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';

import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator }   from '@react-navigation/bottom-tabs';
import { Ionicons }                   from '@expo/vector-icons';

import { ExpensesContextProvider } from './store/expenses-context';
import RecentExpenses   from './screens/RecentExpenses';
import AllExpenses      from './screens/AllExpenses';
import ManageExpense    from './screens/ManageExpense';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

function ExpensesOverview({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle:        { backgroundColor: '#f8f8f8' },
        headerShadowVisible: false,
        headerTitleAlign:   'center',
        headerRight: () => (
          <Ionicons
            name="add"
            size={24}
            color="#007AFF"
            style={{ marginRight: 16 }}
            onPress={() => navigation.navigate('ManageExpense')}
          />
        ),
        tabBarStyle: { paddingVertical: 6, height: 60 },
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'Recent' ? 'hourglass' : 'calendar';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Recent" component={RecentExpenses} options={{ title: 'Recent' }} />
      <Tab.Screen name="All"    component={AllExpenses}    options={{ title: 'All'    }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ExpensesContextProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="ExpensesOverview"
              component={ExpensesOverview}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ManageExpense"
              component={ManageExpense}
              options={{
                presentation: 'modal',
                headerTitle:  'Manage Expense',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ExpensesContextProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 }
});
