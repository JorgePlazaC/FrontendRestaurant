import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function Mesas() {

  const navigation = useNavigation()

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