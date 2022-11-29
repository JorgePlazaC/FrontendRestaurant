import { StyleSheet, Text, View, FlatList, ActivityIndicator, Dimensions, ListItem, StatusBar } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { TextInput, Divider, Portal, Dialog, Button } from 'react-native-paper';

import RestaurantContext from '../src/components/RestaurantContext'

const width = Dimensions.get('window')

export default function Resumen({ navigation }) {

  //Url usadas
  const baseUrl = 'http://10.0.2.2:8000'
  const urlFactura = `${baseUrl}/api/facturas`
  const urlPedido = `${baseUrl}/api/pedidos`

  //UseContext
  const { mesa, setMesa, carro, setCarro, carroAgregado, setCarroAgregado, imagenes, setImagenes, productosContext, setProductosContext } = useContext(RestaurantContext)

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
    <View>
      <View style={styles.item}>
        <Text style={styles.title}>Nombre: {title.producto.nombre}</Text>
        <Text style={styles.title}>Precio: {title.producto.precio}</Text>
        <Text style={styles.title}>Cantidad: {title.cantidad}</Text>
      </View>
      <Divider bold={true} style={styles.divider} />
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item} />
  )

  return (
    <View centerContent style={styles.viewBody}>
      <View style={styles.viewResumen}>
        <FlatList
          style={styles.flatList}
          data={carro}
          renderItem={renderItem}
          keyExtractor={(item, index) => item + index}
        />
      </View>
      <View style={styles.total}>
        <Text>Total: {CalcTotal()}</Text>
      </View>
      <Button
        mode="contained"
        style={styles.buttonPaper}
        onPress={() => {
          Confirmar().finally(() => { { navigation.navigate("espera") } });
        }}>
        Confirmar
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    marginHorizontal: 30,

  },
  viewResumen: {
    marginTop: 5,
    borderRadius: 10,
    backgroundColor: '#D8D8D8'
  },
  button: {
    backgroundColor: "#442484"
  },
  flatList: {
    maxHeight: width.height - 150,
  },
  buttonPaper: {
    marginTop: 3,
    marginBottom: 2,
    marginHorizontal: 30,
    backgroundColor: '#58ACFA'
  },
  item: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
  },
  total: {
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#D8D8D8'
  },
})