import * as React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Layout, Card, Text, Select, SelectItem, Button, Input } from '@ui-kitten/components';
import EditScreenInfo from '../components/EditScreenInfo';
import axios from 'axios';
import {baseUrl} from '@env'
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function CheckRipness({navigation}) {
  //const baseUrl = Platform.OS === 'android' ? 'http://192.168.1.97:8080' : 'http://localhost:8080';


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
      ingredients: [], fetchIngredients: () => {} 
  })

  const handleSearch = async () => {
    let ingredients_array:string[] = []
    let all_ingredients : any = await AsyncStorage.getItem('finishing');
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

  const fetchIngredients = async () => {
      try{
      const response = await axios.get(baseUrl + '/ripness', {timeout: 20});

      setIngredients(response.data.response_body)
      }catch(e){
              let expiring : any = await AsyncStorage.getItem('ripness');
              expiring = JSON.parse(expiring);
              if(expiring != null){    
              setIngredients(expiring);
              }    
      }

      }
  React.useEffect(() => {
  }, [])




 

  return (
    <Layout style={styles.container}>
      <Text style={styles.text}>Check ripness ingredients:</Text>

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
     
        <ingredientsContext.Provider value={{ingredients, fetchIngredients}}>
            {ingredients.map((ingredient) => (
                     <Card key={ingredient.id}>
                         <Text>
                         {ingredient.name} - {ingredient.brand}
                         </Text>
                         <Text>

                         {ingredient.expiration} 
                         </Text>
                    </Card>

            ))}




        </ingredientsContext.Provider>

      


      
    </Layout>
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
