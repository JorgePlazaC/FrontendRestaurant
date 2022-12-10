import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { TextInput, Divider, Portal, Dialog, Button } from 'react-native-paper';

export default function Administrador() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  return (
    <View style={styles.viewBody}>
      <Text style={styles.text}>Ingrese a la sección que desea administrar</Text>
      <View>
        <Button
          mode="contained"
          style={styles.buttonPaper}
          onPress={() => {
            navigation.navigate("admCategorias");
          }}>
          Administrar categorias
        </Button>
        <Button
          mode="contained"
          style={styles.buttonPaper}
          onPress={() => {
            navigation.navigate("admProductos");
          }}>
          Administrar productos
        </Button>
        <Button
          mode="contained"
          style={styles.buttonPaper}
          onPress={() => {
            navigation.navigate("admMesas");
          }}>
          Administrar mesas
        </Button>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    marginHorizontal: 30,
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
  text: {
    marginTop: 10,
    marginBottom:8,
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
    maxHeight: 20,
    maxWidth: 20,
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