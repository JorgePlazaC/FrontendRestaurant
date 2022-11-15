import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'


export default function Principal() {

  const navigation = useNavigation()
  return (
    <View style = {styles.viewBody}>
      <Text>Principal</Text>
      <Button
      style={styles.button}
      title="Cliente"
      onPress={() => {navigation.navigate("mesas")}}
      />  
      <Button
      style={styles.button}
      title="Administrador"
      onPress={() => {navigation.navigate("administradorMenu")}}
      />  
    </View>
  )
}

const styles = StyleSheet.create({
    viewBody:{
        marginHorizontal: 30,
        },
})