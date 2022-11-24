import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function Administrador() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  return (
    <View style = {styles.viewBody}>
      <View><Text>Administrador</Text>
      <Button
      style={styles.button}
      title="Administrar categorias"
      onPress={() => {navigation.navigate("admCategorias")}}
      />  
      <Button
      style={styles.button}
      title="Administrar productos"
      onPress={() => {navigation.navigate("admProductos")}}
      />  
      <Button
      style={styles.button}
      title="Administrar mesas"
      onPress={() => {navigation.navigate("admMesas")}}
      /></View>
    </View>
  )
}

const styles = StyleSheet.create({
    viewBody:{
        marginHorizontal: 30,
        },
})