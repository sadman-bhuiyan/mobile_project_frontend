import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Input, Text, Select, SelectItem, Button, Toggle } from '@ui-kitten/components';
import axios from 'axios';
import { baseUrl } from '@env'
import FillData from '../components/FillData';


export default function NewIngredients({ route, navigation }) {

  const [name, setName] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState("");
  const [selectedConfection, setSelectedConfection] = React.useState("");
  const [selectedRipeness, setSelectedRipeness] = React.useState("");
  const [visibility, setVisibility] = React.useState(false);
  const [expDate, setExpDate] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [checkedFrozen, setCheckedFrozen] = React.useState(false);
  const [checkedOpen, setCheckedOpen] = React.useState(false);



  const data: any = JSON.parse(
    '{"category": ["Vegetables", "Fruits", "Grain", "Dairy", "Meat", "Fish", "Liquid", "Beans", "Bread" ], "location": ["Fridge", "Pantry", "Freezer"], "confection": ["Canned", "Fresh", "Bottle", "Plastic"], "ripeness": ["Green", "Ripe", "Advanced Ripe"]}'
  );

  const renderOption = (title) => (
    <SelectItem title={title} key={title} />
  );

  const fetchIngredient = async () => {
    //const response = await axios.get(baseUrl + '/id', {params:{id: route.params.itemId}});
    setName(route.params.name);
    setBrand(route.params.brand);
    setSelectedCategory(route.params.category);
    setSelectedLocation(route.params.location);
    setSelectedConfection(route.params.confection);
    setSelectedRipeness(route.params.confection);
    setExpDate(route.params.expiration);

  }
  const onCheckedChangeFrozen = (isChecked) => {
    setCheckedFrozen(isChecked);
  };
  const onCheckedChangeOpen = (isChecked) => {
    setCheckedOpen(isChecked);
  };

  React.useEffect(() => {
    fetchIngredient();

  }, [])




  const handleSubmit = async () => {

    await axios.post(baseUrl + '/delete', { "id": route.params.itemId }).then(r => console.log('message deleted!')).catch(e => console.log(e))
    let today = new Date();
    if (checkedFrozen == true) {
      today.setDate(today.getDate() + 183);
      axios
        .post(baseUrl + '/new', {
          "name": name,
          "brand": brand,
          "category": selectedCategory,
          "state": selectedRipeness,
          "location": selectedLocation,
          "confection": selectedConfection,
          "expiration": today.toISOString().substring(0, 10),
        }).then(() => {
          setIsSubmitted(true);
        }).then(()=>{
          setIsSubmitted(false);
        }).then((resp) => { navigation.navigate('Ingredients'); })
        .catch((err) => console.error(err))

    }
    if (checkedOpen == true && checkedFrozen == false) {
      today.setDate(today.getDate() + 1);
      axios
        .post(baseUrl + '/new', {
          "name": name,
          "brand": brand,
          "category": selectedCategory,
          "state": selectedRipeness,
          "location": selectedLocation,
          "confection": selectedConfection,
          "expiration": today.toISOString().substring(0, 10),
        }).then(() => {
          setIsSubmitted(true);
        }).then(()=>{
          setIsSubmitted(false);
        }).then((resp) => { navigation.navigate('Ingredients'); })
        .catch((err) => console.error(err))

    }
    if (checkedOpen == false && checkedFrozen == false) {
      axios
        .post(baseUrl + '/new', {
          "name": name,
          "brand": brand,
          "category": selectedCategory,
          "state": selectedRipeness,
          "location": selectedLocation,
          "confection": selectedConfection,
          "expiration": expDate,
        }).then(() => {
          setIsSubmitted(true);
        }).then(()=>{
          setIsSubmitted(false);
        }).then((resp) => { navigation.navigate('Ingredients'); })
        .catch((err) => console.error(err))

    }

  }

  return (

    <Layout style={styles.container}>

      <Text style={styles.text}>Name:</Text>
      <Input
        placeholder='Enter ingredient name'
        onChangeText={nextValue => setName(nextValue)}
        value={name}
      />
      <Text style={styles.text}>Brand:</Text>
      <Input
        placeholder='Enter ingredient brand'
        onChangeText={nextValue => setBrand(nextValue)}
        value={brand}
      />
      <Text style={styles.text}>Category of the ingredient:</Text>
      <Select
        placeholder='Select category'
        onSelect={(value) => {
          setSelectedCategory(data.category[value.row])
          if (value.row < 2) {
            setVisibility(true);
          } else {
            setVisibility(false);
          }
        }}
        value={selectedCategory}
      >
        {data.category.map(renderOption)}


      </Select>
      {visibility ? (
        <>
          <Text style={styles.text}>State of the ingredient:</Text>
          <Select
            onSelect={(value) => setSelectedRipeness(data.ripeness[value.row])}
            placeholder="Selection state type"
            value={selectedRipeness}
          >
            {data.ripeness.map(renderOption)}
          </Select>
        </>
      ) : null}
      <Text style={styles.text}>Location of the ingredient:</Text>
      <Select
        onSelect={value => setSelectedLocation(data.location[value.row])}
        placeholder='Select location'
        value={selectedLocation}
      >

        {data.location.map(renderOption)}
      </Select>
      <Text style={styles.text}>Confection type of the ingredient:</Text>
      <Select
        onSelect={value => setSelectedConfection(data.confection[value.row])}
        placeholder='Selection confection type'
        value={selectedConfection}
      >

        {data.confection.map(renderOption)}

      </Select>
      <Toggle checked={checkedFrozen} onChange={onCheckedChangeFrozen}>
        Frozen
    </Toggle>
      <Toggle checked={checkedOpen} onChange={onCheckedChangeOpen}>
        Open
    </Toggle>

      <Text style={styles.text}>Expiration date:</Text>
      <Input
        placeholder='Enter expiration'
        onChangeText={nextValue => setExpDate(nextValue)}
        value={expDate}
      />
      <Button style={styles.button} onPress={handleSubmit}>
        SAVE
    </Button>
      <Button style={styles.button} onPress={() => navigation.navigate('Ingredients')}>
        BACK
      </Button>
      {isSubmitted ? <FillData baseUrl={baseUrl}></FillData> : null }


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
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    marginTop: 8
  },
  checkbox: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 24,
    width: 2200
  }
});
