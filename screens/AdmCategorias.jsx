import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'


export default function AdmCategorias() {

  const navigation = useNavigation()
  return (
    <View style = {styles.viewBody}>
      <Text>Administrador de categorias</Text>
       
    </View>
  )
}

const styles = StyleSheet.create({
    viewBody:{
        marginHorizontal: 30,
        },
})