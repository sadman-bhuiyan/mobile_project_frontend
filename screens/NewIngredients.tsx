import * as React from "react";
import { StyleSheet, Platform, ScrollView } from "react-native";
import {
  Layout,
  Input,
  Text,
  Select,
  SelectItem,
  Button,
} from "@ui-kitten/components";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/core";
import { baseUrl } from "@env";
import useStatePromise from "use-state-promise";
import FillData from '../components/FillData';

export default function NewIngredients({ navigation }) {
  //const baseUrl = Platform.OS === 'android' ? 'http://192.168.1.97:8080' : 'http://localhost:8080';

  const [name, setName] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState("");
  const [selectedConfection, setSelectedConfection] = React.useState("");
  const [selectedRipeness, setSelectedRipeness] = React.useState("");
  const [visibility, setVisibility] = React.useState(false);
  const [expDate, setExpDatePromise, setExpDate] = useStatePromise("");
  const [quantity, setQuantity] = React.useState("1");
  const isFocused = useIsFocused();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const data: any = JSON.parse(
    '{"category": ["Vegetables", "Fruits", "Grain", "Dairy", "Meat", "Fish", "Liquid", "Beans", "Bread" ], "location": ["Fridge", "Pantry", "Freezer"], "confection": ["Canned", "Fresh", "Bottle", "Plastic"], "ripeness": ["Green", "Ripe", "Advanced Ripe"]}'
  );
  React.useEffect(() => {
    (async () => {
      const barcode = await AsyncStorage.getItem("barcode");
      if (barcode != null) {
        try {
          let response = await axios.get(
            "https://world.openfoodfacts.org/api/v0/product/" +
              barcode +
              ".json"
          );

          if (response.data.status_verbose === "product found") {
            setBrand(response.data.product.brands);
            setName(
              response.data.product.categories_hierarchy[0].match(":(.*)")[1]
            );
            setQuantity('1')
          }

          await AsyncStorage.removeItem("barcode");
        } catch (e) {
          await AsyncStorage.removeItem("barcode");
          console.log(e);
        }
      }
    })();
  }, [isFocused]);

  const renderOption = (title) => <SelectItem title={title} key={title} />;

  const RequestPOST = async (state) => {
    try {
      axios.post(baseUrl + "/new", {
        name: name,
        brand: brand,
        category: selectedCategory,
        state: selectedRipeness,
        location: selectedLocation,
        confection: selectedConfection,
        expiration: state,
      }).then(() => {
        setIsSubmitted(true);
      }).then(()=>{
        setIsSubmitted(false);
      }).then((r) => {
        setName("");
      setBrand("");
      setSelectedCategory("");
      setSelectedConfection("");
      setSelectedLocation("");
      setSelectedRipeness("");
      setExpDate("");
      setQuantity("1");
      })
      
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async () => {
    if (expDate == "") {
      try{
      let response = await axios.get(baseUrl + "/previouslystored", {
        params: { name: name },
      });
      if (response.data.response_body.length != 0) {
        
       
          for (let i = 0; i < parseInt(quantity); i++) {
            let state = response.data.response_body[0].expiration;
            await RequestPOST(state);
          }
        }
       else {
        await RequestPOST(expDate);
      }
      } catch(e){
        console.log(e);
      }
     
    } else {
      for (let i = 0; i < parseInt(quantity); i++) {

        await RequestPOST(expDate);
      }
    }
  };

  return (
    <ScrollView>
    <Layout style={styles.container}>
      <Text style={styles.text}>Name:</Text>
      <Input
        placeholder="Enter ingredient name"
        onChangeText={(nextValue) => {
          setName(nextValue);
        }}
        value={name}
      />
      <Text style={styles.text}>Brand:</Text>
      <Input
        placeholder="Enter ingredient brand"
        onChangeText={(nextValue) => setBrand(nextValue)}
        value={brand}
      />
      <Text style={styles.text}>Quantity:</Text>
      <Input
        placeholder="Enter ingredient quantity"
        onChangeText={(nextValue) => {
          setQuantity(nextValue);
        }}
        value={quantity}
        keyboardType='numeric'
      />
      <Text style={styles.text}>Category of the ingredient:</Text>
      <Select
        placeholder="Select category"
        onSelect={(value) => {
          setSelectedCategory(data.category[value.row]);
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
        onSelect={(value) => setSelectedLocation(data.location[value.row])}
        placeholder="Select location"
        value={selectedLocation}
      >
        {data.location.map(renderOption)}
      </Select>
      <Text style={styles.text}>Confection type of the ingredient:</Text>
      <Select
        onSelect={(value) => setSelectedConfection(data.confection[value.row])}
        placeholder="Selection confection type"
        value={selectedConfection}
      >
        {data.confection.map(renderOption)}
      </Select>

      <Text style={styles.text}>Expiration date:</Text>
      <Input
        placeholder="YYYY-MM-DD"
        onChangeText={(nextValue) => setExpDate(nextValue)}
        value={expDate}
        keyboardType='numeric'
      />
      <Button style={styles.button} onPress={handleSubmit}>
        ADD INGREDIENT
      </Button>

      <Button style={styles.button} onPress={() => navigation.navigate("Scan")}>
        SCAN QR CODE
      </Button>
    </Layout>
    {isSubmitted ? <FillData baseUrl={baseUrl}></FillData> : null }
    
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: "#eaeaea",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  button: {
    marginTop: 8,
  },
});
