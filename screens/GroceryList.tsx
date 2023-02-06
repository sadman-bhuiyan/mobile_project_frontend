import * as React from 'react';
import { StyleSheet, Platform, ScrollView, View } from 'react-native';
import { Layout, Card, Text, Select, SelectItem, Button, Input } from '@ui-kitten/components';
import EditScreenInfo from '../components/EditScreenInfo';
import axios from 'axios';
import { baseUrl } from '@env'


export default function GroceryList({ navigation }) {

  //const baseUrl = Platform.OS === 'android' ? 'http://192.168.1.97:8080' : 'http://localhost:8080';

  const data = JSON.parse('{ "shop":["Supermarket", "Butcher", "Fishmoger", "Bakery"]}')

  const [ingredients, setIngredients] = React.useState([]);
  const [selectedShop, setSelectedShop] = React.useState('');
  const [quantity, setQuantity] = React.useState('1');
  const [nameIngredient, setNameIngredient] = React.useState('');
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelectedShop('');
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  const renderOption = (title) => (
    <SelectItem title={title} key={title} />
  );
  

  const GroceryContext = React.createContext({
    ingredients: [], fetchIngredients: () => { }
  })

  const handlePurchase = async (name, brand, category, id) => {
    for (let i = 0; i < parseInt(quantity); i++) {
    await axios
    .post( baseUrl + '/new', {
      "name": name,
      "brand": brand,
      "category": category,
      "state": "",
      "location": "",
      "confection": "",
      "expiration": "",
    })
  }
  if(id != ''){
    handleRemove(id)
  }else{
    setNameIngredient('');
  }


  }

  const handleRemove = async (id) => {
   await axios.post(baseUrl + '/deletegrocery', {"id": id}).then(r => console.log(r.data)).catch(e => console.log(e))
   let selection = selectedShop;
   setSelectedShop('');
   setSelectedShop(selection);

  }

  const fetchIngredients = async () => {

    try {
      const response = await axios.get(baseUrl + '/grocery', { params: { shop: selectedShop } });
      console.log(response.data)

      setIngredients(response.data.response_body)
    } catch (e) { { console.log(e) } }
  };


  React.useEffect(() => {
    fetchIngredients();
  }, [selectedShop])






  return (
    <ScrollView>
    <Layout style={styles.container}>
    <Text style={styles.text}>Fast Purchase</Text>
    <Text style={styles.text}>Name:</Text>
      <Input
        placeholder="Enter ingredient name"
        onChangeText={(nextValue) => {
          setNameIngredient(nextValue);
        }}
        value={nameIngredient}
      />
      <Button style={styles.button} onPress={() => { handlePurchase(nameIngredient, '', '', '')}}>
              PURCHASE
    </Button>
      <Text style={[styles.text, styles.separator ]}>Select shop:</Text>

      <Select
        onSelect={(value) => { setSelectedShop(data.shop[value.row]) }}
        placeholder='Select shop'
        value={selectedShop}
      >

        {data.shop.map(renderOption)}

      </Select>

      <GroceryContext.Provider value={{ ingredients, fetchIngredients }}>
        {ingredients.map((ingredient) => (
          <Card key={ingredient.id}>
            <Text>
              {ingredient.name} - {ingredient.brand}
            </Text>
            <Text>Quantity: </Text>
            <Layout style={styles.parent}>
            <Button style={[styles.triggerLeft, styles.child]} onPress={() => {if(quantity != '1'){
              setQuantity(String(parseInt(quantity)-1))
            }}}>
        -
      </Button>
            <Input
            style={styles.child}
      placeholder='Place your Text'
      value={quantity}
      onChangeText={nextValue => setQuantity(nextValue)}
      disabled={true}
    />
    <Button style={[styles.triggerRight,styles.child]} onPress={() => {setQuantity(String(parseInt(quantity)+1))}}>
        +
      </Button>
      </Layout>
            <Button style={styles.button} onPress={() => { handlePurchase(ingredient.name, ingredient.brand, ingredient.category, ingredient.id) }}>
              PURCHASE
    </Button>
    <Button style={styles.button} onPress={() => { handleRemove(ingredient.id) }}>
              REMOVE
    </Button>
          </Card>



        ))}




      </GroceryContext.Provider>





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
    marginTop: 10,
  },
  button: {
    marginTop: 10
  },
  parent: {
    marginTop: 10,
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
},
child: {
    flexBasis: '30%',
},
triggerLeft: {
   marginBottom:4,
   marginRight: 4
},
triggerRight: {
  marginBottom:4,
  marginLeft: 4
},
title: {
  fontSize: 16,
}

  
  
});


