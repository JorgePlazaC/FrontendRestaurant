import { StyleSheet, Text, View, Button, FlatList, ActivityIndicator, Dimensions, ListItem,StatusBar } from 'react-native'
import React, {useState,useEffect,useContext} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'

import RestaurantContext from '../src/components/RestaurantContext'

const width = Dimensions.get('window')

export default function Resumen({navigation}) {

  const {mesa, setMesa, carro, setCarro} = useContext(RestaurantContext)
  

  useEffect(() => {
    
}, [])


  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title.producto.nombre}</Text>
      <Text style={styles.title}>{title.producto.precio}</Text>
      <Text style={styles.title}>{title.cantidad}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item} />
  )

  return (
    <View centerContent style = {styles.viewBody}>
      <FlatList
        data={carro}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button
      style={styles.button}
      title="Confirmar"
      onPress={() => navigation.navigate("espera")}
      />              
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody:{
    marginHorizontal: 30
  },
    button:{
        backgroundColor: "#442484"
    }
})