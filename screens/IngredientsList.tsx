import * as React from 'react';
import axios from 'axios';
import { Layout, Card, Text, Select, SelectItem, Button } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ingredients from './Ingredients';
import { StyleSheet, TouchableOpacity, View } from 'react-native';



export default function IngredientList({navigation}) {
   
   
    return (
        <>
        <Layout style={styles.container}>
            <Card style={styles.card} onPress={() => navigation.navigate('Ingredients')}><Text>All ingredients</Text></Card>
            <Card style={styles.card} onPress={() => navigation.navigate('IngredientsCategory')}><Text>Organize by category</Text></Card>
            <Card style={styles.card} onPress={() => navigation.navigate('IngredientsConfection')}><Text>Organize by confection</Text></Card>
            <Card style={styles.card} onPress={() => navigation.navigate('IngredientsLocation')}><Text>Organize by location</Text></Card>
            <Card style={styles.card} onPress={() => navigation.navigate('IngredientsIncomplete')}><Text>Query for incomplete ingredients</Text></Card>
            <Card style={styles.card} onPress={() => navigation.navigate('FinishingIngredients')}><Text>Query for low quantity ingredients</Text></Card>
            <Card style={styles.card} onPress={() => navigation.navigate('CheckRipness')}><Text>Check Ripness</Text></Card>
            

        </Layout>

        </>

          
    );


}

const styles = StyleSheet.create({
    container: {
      marginTop: 40,
      marginLeft: 10,
      marginRight: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    card: {
      marginTop: 10,
    },
    linkText: {
      fontSize: 14,
      color: '#2e78b7',
    },
  });
  