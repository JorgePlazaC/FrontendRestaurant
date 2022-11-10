import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { StackActions } from '@react-navigation/native'
import { withNavigation } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'


export default function Espera() {

  const navigation = useNavigation()
  
  const SeguirComprando = () =>{
    //navigation.goBack()
    const popAction = StackActions.pop(2)
    navigation.dispatch(popAction)
  }
  return (
    <View>
      <Text>Espera</Text>
      <Button
      style={styles.button}
      title="Volver a pedir"
      onPress={() => {SeguirComprando()}}
      />  
    </View>
  )
}

const styles = StyleSheet.create({})