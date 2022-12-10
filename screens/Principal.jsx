import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { TextInput, Divider, Portal, Dialog, Button } from 'react-native-paper';


export default function Principal() {

  const navigation = useNavigation()
  return (
    <View style={styles.viewBody}>
      <Text style={styles.textTitulo}>¡Bienvenido al restaurant!</Text>
      <Image style={styles.icon} source={require("../src/images/logo.png")}/>
      <Text style={styles.text}>¿Eres un cliente o un administrador?</Text>
      <Button
        mode="contained"
        style={styles.buttonPaper}
        onPress={() => {
          navigation.navigate("mesas");
        }}>
        Cliente
      </Button>
      <Button
        mode="contained"
        style={styles.buttonPaper}
        onPress={() => {
          navigation.navigate("administradorMenu");
        }}>
        Administrador
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0,5)'
  },
  modalContainer: {
    marginHorizontal: 30,
    borderRadius: 16,
    width: '80%',
    backgroundColor: 'white'

  },
  textTitulo: {
    marginTop: 30,
    marginBottom:30,
    marginLeft: 15,
    fontSize: 22,
  },
  text: {
    marginTop: 30,
    marginBottom:30,
    marginLeft: 15,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#58ACFA',
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
    marginBottom: 43,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    maxHeight: 30,
    maxWidth: 30,
    flex: 0.2,
    alignSelf: 'flex-end',
    right: 0,
    flexDirection: 'row-reverse',
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#859a9b',
    marginTop: 8,
    borderRadius: 20,
  },
  icon: {
    maxHeight: 200,
    maxWidth: 200,
    marginBottom: 20,
  },
  buttonPaper: {
    marginTop: 10,
    marginBottom: 0,
    marginHorizontal: 30,
    backgroundColor: '#58ACFA'
  },
  buttonPaperModal: {
    marginTop: 8,
    marginBottom: 0,
    marginHorizontal: 30,
    backgroundColor: '#58ACFA'
  },
  parent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  divider: {
    marginTop: 8,
  }
})