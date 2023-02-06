import * as React from 'react';
import { StyleSheet , Platform, ScrollView} from 'react-native';
import { Layout, Card, Text, Select, SelectItem, Button, Input } from '@ui-kitten/components';
import EditScreenInfo from '../components/EditScreenInfo';
import axios from 'axios';
import {baseUrl} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function CategoryIngredients({navigation}) {
  //const baseUrl = Platform.OS === 'android' ? 'http://192.168.1.97:8080' : 'http://localhost:8080';


    const data = JSON.parse('{"category": ["Vegetables", "Fruits", "Grain", "Dairy", "Meat", "Fish", "Liquid", "Beans"]}')

  const [ingredients, setIngredients] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [visibile, setVisible] = React.useState(false);
  const renderOption = (title) => (
    <SelectItem title={title} key={title}/>
  );
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        fetchIngredients()
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  

  const CategoryIngredientsContext = React.createContext({
      ingredients: [], fetchIngredients: () => {} 
  })

  const handleSearch = async () => {
    let ingredients_array:string[] = []
    let all_ingredients : any = await AsyncStorage.getItem('ingredients');
    all_ingredients = JSON.parse(all_ingredients);
    if(all_ingredients != null){    
    all_ingredients.map((i:any) => {
      if(i.location == selectedLocation && i.name == search){
        ingredients_array.push(i);
      }
    })
    setIngredients([]);
    setIngredients(ingredients_array);
    }        


}

  const fetchIngredients = async () => {
    
        try{
            const response = await axios.get(baseUrl + '/category', {params:{category: selectedCategory}, timeout:20});
      
            setIngredients(response.data.response_body)
            }catch(e) {
              let ingredients_array:string[] = []
              let all_ingredients : any = await AsyncStorage.getItem('ingredients');
              all_ingredients = JSON.parse(all_ingredients);
              if(all_ingredients != null){    
              all_ingredients.map((i:any) => {
                if(i.location == selectedCategory){
                  ingredients_array.push(i);
                }
              })
              setIngredients(ingredients_array);
              }   
    };
  }
      

  React.useEffect(() => {
      fetchIngredients();
  }, [selectedCategory])




 

  return (
    <ScrollView>
    <Layout style={styles.container}>
      <Text style={styles.text}>Select confection:</Text>

      <Select
        onSelect={(value) => {setSelectedCategory(data.category[value.row]); setVisible(true)}}
        placeholder='Select ingredient confection'
        value={selectedCategory}
        >
        
        {data.category.map(renderOption)}

      </Select>
      {visibile ? (
        <>
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
        </>
      ) : null}
     
        <CategoryIngredientsContext.Provider value={{ingredients, fetchIngredients}}>
            {ingredients.map((ingredient) => (
                     <Card key={ingredient.id}>
                         <Text>
                         {ingredient.name} - {ingredient.brand}
                         </Text>
                    </Card>

            ))}




        </CategoryIngredientsContext.Provider>

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
