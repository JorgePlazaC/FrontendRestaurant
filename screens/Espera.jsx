import { SnapshotViewIOS, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { StackActions } from '@react-navigation/native'
import { withNavigation } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { TextInput, Divider, Portal, Dialog, Button } from 'react-native-paper';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database'
import CountDown from 'react-native-countdown-component';

import RestaurantContext from '../src/components/RestaurantContext'

export default function Espera() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  //UseContext
  const { mesa, setMesa, carro, setCarro, carroAgregado, setCarroAgregado, imagenes, setImagenes, productosContext, setProductosContext, idPedido, setIdPedido } = useContext(RestaurantContext)

  //UseState
  const [tiempo, setTiempo] = useState("00:00")

  //UseEfect
  useEffect(() => {
    (() => {
      fetchFirebase()
    })()
  }, [])

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

  //Obtener tiempo
  const fetchFirebase = () => {
    const db = getDatabase()
    const reference = ref(db, 'pedidos/' + idPedido)
    onValue(reference, async (snapshot) => {
      const data = await snapshot.val()
      console.log(await data.idFactura)
      setTiempo(parseInt(await data.tiempo))

    })
  }

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
      {tiempo > 0 ? (
        <View>
          <Text style={styles.text}>Su producto está en preparación</Text>
          <CountDown
            until={tiempo}
            timeToShow={['M', 'S']}
            digitStyle={{ backgroundColor: '#FFF' }}
            digitTxtStyle={{ color: '#1CC625' }}
            size={20}
          />
        </View>) : (<Text style={styles.text}>Esperando el tiempo de preparación</Text>)}
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
    marginBottom: 8,
    fontSize: 18,
  },
})