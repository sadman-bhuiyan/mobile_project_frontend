import * as React from 'react';
import { StyleSheet, Platform, ScrollView } from 'react-native';
import { Layout, Card, Text, Select, SelectItem, Button, Input } from '@ui-kitten/components';
import EditScreenInfo from '../components/EditScreenInfo';
import axios from 'axios';
import { baseUrl } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function ingredients({ navigation }) {


  const [ingredients, setIngredients] = React.useState([]);
  const [search, setSearch] = React.useState('');
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchIngredients()
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);


  const ingredientsContext = React.createContext({
    ingredients: [], fetchIngredients: () => { }
  })

  const fetchIngredients = async () => {
    try{
    const response = await axios.get(baseUrl + '/ingredients', {timeout:20});
    setIngredients(response.data.response_body)
    }catch(e){
              let all_ingredients : any = await AsyncStorage.getItem('ingredients');
              all_ingredients = JSON.parse(all_ingredients);
              
              setIngredients(all_ingredients);
              }  
    


  }
  const handleRemove = async (id) => {
    await axios.post(baseUrl + '/delete', {"id": id}).then(r => 'message deleted').catch(e => console.log(e));
    navigation.replace('Ingredients');

  }

  React.useEffect(() => {
  }, [])

  const handleSearch = async () => {
    let ingredients_array:string[] = []
    let all_ingredients : any = await AsyncStorage.getItem('ingredients');
    all_ingredients = JSON.parse(all_ingredients);
    if(all_ingredients != null){    
    all_ingredients.map((i:any) => {
      if(i.name == search){
        ingredients_array.push(i);
      }
    })
    setIngredients([]);
    setIngredients(ingredients_array);
    }        


}






  return (
    <ScrollView>
      <Layout style={styles.container}>
        <Text style={styles.text}>All ingredients:</Text>
        <Text>Search:</Text>
      <Input
        placeholder="Enter ingredient name"
        onChangeText={(nextValue) => {
          setSearch(nextValue);
        }}
        value={search}
      />
       
       <Button style={styles.button} onPress={handleSearch}>
        SEARCH
      </Button>

        <ingredientsContext.Provider value={{ ingredients, fetchIngredients }}>
          {ingredients.map((ingredient) => (
            <Card key={ingredient.id}>
              <Text>
                {ingredient.name} - {ingredient.brand}
              </Text>
              <Button style={styles.button} onPress={() => navigation.navigate('EditIngredients', {
                itemId: ingredient.id,
                name: ingredient.name,
                brand: ingredient.brand,
                category: ingredient.category,
                state: ingredient.state,
                location: ingredient.location,
                confection: ingredient.confection,
                expiration: ingredient.expiration,
              })}>
                EDIT
      </Button>
      <Button style={styles.button} onPress={() => handleRemove(ingredient.id)}>
        CONSUME
      </Button>

            </Card>

          ))}




        </ingredientsContext.Provider>

        <Button style={styles.button} onPress={() => navigation.navigate('Ingredients queries')}>
          BACK
      </Button>



      </Layout>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: "#eaeaea"
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    marginTop: 10
  }
});
