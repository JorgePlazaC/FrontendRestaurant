import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'

export default function Espera(navigation) {
  const SeguirComprando = () =>{
    navigation.goBack()
  }
  return (
    <View>
      <Text>Espera</Text>
      <Button
      style={styles.button}
      title="Volver a pedir"
      onPress={() => {SeguirComprando}}
      />  
    </View>
  )
}

const styles = StyleSheet.create({})