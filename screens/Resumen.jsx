import { StyleSheet, Text, View, Button, FlatList, ActivityIndicator, Dimensions, ListItem, StatusBar } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'

import RestaurantContext from '../src/components/RestaurantContext'

const width = Dimensions.get('window')

export default function Resumen({ navigation }) {

  //Url usadas
  const baseUrl = 'http://10.0.2.2:8000'
  const urlFactura = `${baseUrl}/api/facturas`
  const urlPedido = `${baseUrl}/api/pedidos`

  //UseContext
  const { mesa, setMesa, carro, setCarro,carroAgregado,setCarroAgregado,imagenes,setImagenes,productosContext, setProductosContext } = useContext(RestaurantContext)

  let total = 0


  useEffect(() => {

  }, [])

  //Calculo del total de la cuenta
  const CalcTotal = () => {
    let calc = 0
    carro.forEach(elementCarroR => {
      let suma = elementCarroR.producto.precio * elementCarroR.cantidad
      calc = calc + suma
    })
    total = calc
    return calc
  }

  //Ingreso de la orden a la base de datos
  const Confirmar = async () => {
    try {
      const responseFactura = await axios.post(urlFactura, { valorTotal: total })
      const facturaId = responseFactura.data.id

      console.log(facturaId)
      console.log(mesa.id)
      carro.forEach(async (prod) => {
        const response = await axios.post(urlPedido, { idMesa: mesa.id, idFactura: facturaId, idProducto: prod.producto.id, cantidad: prod.cantidad });
        console.log(response.data)
      })

    } catch (error) {
      console.log(error)
    }

  }

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>Nombre: {title.producto.nombre}</Text>
      <Text style={styles.title}>Precio: {title.producto.precio}</Text>
      <Text style={styles.title}>Cantidad: {title.cantidad}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item} />
  )

  return (
    <View centerContent style={styles.viewBody}>
      <FlatList
        style={styles.flatList}
        data={carro}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Text>Total: {CalcTotal()}</Text>
      <Button
        style={styles.button}
        title="Confirmar"
        onPress={() => { Confirmar().finally(() => { { navigation.navigate("espera") } }) }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    marginHorizontal: 30
  },
  button: {
    backgroundColor: "#442484"
  },
  flatList: {
    maxHeight: width.height - 150,
  }
})