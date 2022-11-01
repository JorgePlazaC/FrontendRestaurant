import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'

export default function Menu({navigation}) {


  return (
    <View centerContent style = {styles.viewBody}>
      <Text>Menú</Text>
      <Button
      style={styles.button}
      title="Siguiente"
      onPress={() => navigation.navigate("resumen")}
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