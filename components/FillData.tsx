import axios from 'axios';
import React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function FillData(props) {
  console.log(props.baseUrl)
  const ingredients_all = axios.get(props.baseUrl + '/ingredients').then(r => {
    if (r.data.response_body.length > 0) {
      AsyncStorage.setItem('ingredients', JSON.stringify(r.data.response_body)).then(() => console.log('item stored'));
    }
  }).catch(e => console.log(e));
  const expiring_ingredients = axios.get(props.baseUrl + '/expiring').then(r => {
    if (r.data.response_body.length > 0) {
      AsyncStorage.setItem('expiring', JSON.stringify(r.data.response_body)).then(() => console.log('item stored'));
    }
  });

  const low_ingredients = axios.get(props.baseUrl + '/finishing').then(r => {
    if (r.data.response_body.length > 0) {
      AsyncStorage.setItem('finishing', JSON.stringify(r.data.response_body)).then(() => console.log('item stored'));
    }
  });
  const ripness = axios.get(props.baseUrl + '/ripness').then(r => {
    if (r.data.response_body.length > 0) {
      AsyncStorage.setItem('ripness', JSON.stringify(r.data.response_body)).then(() => console.log('item stored'));
    }
  });




  return (<></>);
}





