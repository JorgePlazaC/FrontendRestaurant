import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'

export default function Mesas() {
  return (
    <View centerContent style = {styles.viewBody}>
      <Text>Mesas</Text>
      <Button
      style={styles.button}
      title="Siguiente"
      onPress={() => console.log("Siguiente")}
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