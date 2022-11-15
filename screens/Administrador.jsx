import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'


export default function Administrador() {

  const navigation = useNavigation()
  return (
    <View style = {styles.viewBody}>
      <Text>Administrador</Text>
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
      />  
    </View>
  )
}

const styles = StyleSheet.create({
    viewBody:{
        marginHorizontal: 30,
        },
})