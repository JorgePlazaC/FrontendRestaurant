import { StyleSheet, Text, View, FlatList, ActivityIndicator, Dimensions, ListItem, StatusBar } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { TextInput, Divider, Portal, Dialog, Button } from 'react-native-paper';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database'
import firestore from '@react-native-firebase/firestore';

import RestaurantContext from '../src/components/RestaurantContext'

const width = Dimensions.get('window')

export default function Resumen({ navigation }) {

  //Url usadas
  const baseUrl = 'http://10.0.2.2:8000'
  const urlFactura = `${baseUrl}/api/facturas`
  const urlPedido = `${baseUrl}/api/pedidos`

  //UseContext
  const { mesa, setMesa, carro, setCarro, carroAgregado, setCarroAgregado, imagenes, setImagenes, productosContext, setProductosContext, idPedido, setIdPedido } = useContext(RestaurantContext)

  let total = 0

  //Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyDUG_OZb0A9YEJQmCI1iqK4NIyIR8w5qp0",
    authDomain: "restaurant-22e6c.firebaseapp.com",
    projectId: "restaurant-22e6c",
    storageBucket: "restaurant-22e6c.appspot.com",
    messagingSenderId: "327222016651",
    appId: "1:327222016651:web:9da1b280e9e290307cb28e",
    measurementId: "G-XCGSTZWQY3"
  }

  const app = initializeApp(firebaseConfig)

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
      const facturaId = await responseFactura.data.id

      console.log(await facturaId)
      console.log(await mesa)
      carro.forEach(async (prod) => {
        const response = await axios.post(urlPedido, { idMesa: mesa, idFactura: facturaId, idProducto: prod.producto.id, cantidad: prod.cantidad });
        console.log(await response.data)
      })

      
      const db = getDatabase()
      const reference = ref(db, 'pedidos/' + facturaId)

      set(reference, {
        idFactura: facturaId,
        productos: carro,
        estado: "Ingresado",
        mesa: mesa,
        tiempo: "",
      })
      setIdPedido(facturaId)

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
      <Text style={styles.text}>Res??men de tu pedido:</Text>
      {carro.length == 0 ? (<Text>No hay productos en el carro</Text>) :
        (<View>
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
        </View>)}
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
    maxHeight: width.height - 200,
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
  text: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 18,
  },
})