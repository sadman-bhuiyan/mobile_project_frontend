/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import ingredients from '../screens/Ingredients';
import LocationIngredients from '../screens/LocationIngredients';
import CategoryIngredients from '../screens/CategoryIngredients';
import ConfectionIngredients from '../screens/ConfectionIngredients';
import IncompleteIngredients from '../screens/IncompleteIngredients';
import Scan from '../screens/Scan';
import NewIngredients from '../screens/NewIngredients';
import FinishingIngredients from '../screens/FinishingIngredients';
import EditIngredients from '../screens/EditIngredients';
import CheckRipness from '../screens/CheckRipness';



export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="Ingredients" component={ingredients} />
      <Stack.Screen name="IngredientsLocation" component={LocationIngredients} />
      <Stack.Screen name="IngredientsCategory" component={CategoryIngredients} />
      <Stack.Screen name="IngredientsConfection" component={ConfectionIngredients} />
      <Stack.Screen name="IngredientsIncomplete" component={IncompleteIngredients} />
      <Stack.Screen name="Scan" component={Scan} />
      <Stack.Screen name="NewIngredients" component= {NewIngredients}/>
      <Stack.Screen name="FinishingIngredients" component= {FinishingIngredients}/>
      <Stack.Screen name="EditIngredients" component= {EditIngredients}/>
      <Stack.Screen name="CheckRipness" component= {CheckRipness}/>







      

    </Stack.Navigator>
    </>
  );
}
