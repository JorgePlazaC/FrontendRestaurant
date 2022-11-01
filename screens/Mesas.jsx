import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useContext } from 'react'

import RestaurantContext from '../src/components/RestaurantContext'

export default function Mesas() {

  const navigation = useNavigation()
  const {mesa,ElegirMesa} = useContext(RestaurantContext)
  ElegirMesa(1)
  console.log(mesa)
  


  return (
    <View centerContent style = {styles.viewBody}>
      <Text>Mesas</Text>
      <Button
      style={styles.button}
      title="Siguiente"
      onPress={() => navigation.navigate("menu")}
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