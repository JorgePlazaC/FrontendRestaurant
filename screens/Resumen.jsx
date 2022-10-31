import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function Resumen() {

  const navigation = useNavigation()

  return (
    <View centerContent style = {styles.viewBody}>
      <Text>Resumen</Text>
      <Button
      style={styles.button}
      title="Siguiente"
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