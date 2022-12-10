import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { StackActions } from '@react-navigation/native'
import { withNavigation } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { TextInput, Divider, Portal, Dialog, Button } from 'react-native-paper';

import RestaurantContext from '../src/components/RestaurantContext'

export default function Espera() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  //UseContext
  const { mesa, setMesa, carro, setCarro, carroAgregado, setCarroAgregado, imagenes, setImagenes, productosContext, setProductosContext } = useContext(RestaurantContext)


  //Volver al menú de compra
  const SeguirComprando = () => {
    LimpiarCarro()
    const popAction = StackActions.pop(2)
    navigation.dispatch(popAction)
  }

  //Limpiar el carro
  const LimpiarCarro = () => {
    setCarro([])

    productosContext.forEach(element => {
      element.data.forEach((producto) => {
        producto.cant = 0
      })
    });

  }
  return (
    <View style={styles.viewBody}>
      <Text style={styles.text}>Esperando el tiempo de preparación</Text>
      <Button
        mode="contained"
        style={styles.buttonPaper}
        onPress={() => {
          SeguirComprando();
        }}>
        Volver a pedir
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    marginHorizontal: 30,

  },
  buttonPaper: {
    marginTop: 3,
    marginBottom: 2,
    marginHorizontal: 30,
    backgroundColor: '#58ACFA'
  },
  text: {
    marginTop: 10,
    marginBottom:8,
    fontSize: 18,
  },
})