import { StyleSheet, Text, View, Button } from 'react-native'
import React, {useState,useEffect,useContext} from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

import RestaurantContext from '../src/components/RestaurantContext'


export default function Administrador() {

  const navigation = useNavigation()

  const baseUrl = 'http://10.0.2.2:8000'
  const url = `${baseUrl}/api/productos`
  const urlImagen = `${baseUrl}/api/imagens`
  const [cargando,setCargando] = useState(true)
  const {mesa, setMesa, carro, setCarro,carroAgregado,setCarroAgregado,imagenes,setImagenes} = useContext(RestaurantContext)

  useEffect(() => {
    (async () =>{
      //await fetchImagen().finally(Tiempo)
    })()
}, [])

  const Tiempo = () =>{
    setTimeout(() => setCargando(true),4000)
  }

  const fetchImagen = async () => {
    let nuevaUrl = urlImagen
    let response
    try{
      response = await axios.get(nuevaUrl)
      setImagenes(await response.data)
      //console.log(response.data.id)
      
      //setCargando(true)
      //console.log(imagenes.id)
    }catch(error){
      
      console.log(error)
      console.log({url})
    }
    }

  return (
    <View style = {styles.viewBody}>
      {cargando ? (<View><Text>Administrador</Text>
      <Button
      style={styles.button}
      title="Administrar categorias"
      onPress={() => {navigation.navigate("admCategorias")}}
      />  
      <Button
      style={styles.button}
      title="Administrar productos"
      onPress={() => {navigation.navigate("admProductos")}}
      />  
      <Button
      style={styles.button}
      title="Administrar mesas"
      onPress={() => {navigation.navigate("admMesas")}}
      /></View>):(<View></View>)}
      
      
    </View>
  )
}

const styles = StyleSheet.create({
    viewBody:{
        marginHorizontal: 30,
        },
})