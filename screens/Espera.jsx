import { StyleSheet, Text, View, Button } from 'react-native'
import React, {useContext} from 'react'
import { StackActions } from '@react-navigation/native'
import { withNavigation } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'

import RestaurantContext from '../src/components/RestaurantContext'

export default function Espera() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  //UseContext
  const { mesa, setMesa, carro, setCarro,carroAgregado,setCarroAgregado,imagenes,setImagenes,productosContext, setProductosContext } = useContext(RestaurantContext)

  
  //Volver al menú de compra
  const SeguirComprando = () =>{
    LimpiarCarro()
    const popAction = StackActions.pop(2)
    navigation.dispatch(popAction)
  }

  //Limpiar el carro
  const LimpiarCarro = () =>{
    setCarro([])

    productosContext.forEach(element => {
      element.data.forEach((producto) =>{
        producto.cant = 0
      })
    });

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