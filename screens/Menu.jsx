import { StyleSheet, Text, View, Button } from 'react-native'
import React, {useState,useEffect} from 'react'
import axios from 'axios'

export default function Menu({navigation}) {

  const baseUrl = 'http://10.0.2.2:8000'
  const urlCategorias = `${baseUrl}/api/categorias`
  const urlProductos = `${baseUrl}/api/buscarPorCategoria`
  
  
  const [arrayProductos,setArrayProductos] = useState(null)
  const [cargando,setCargando] = useState(true)

  // Invoking get method to perform a GET request
  const fetchCategoriasProductos = async () => {

    let array = []

    let objetoArray = {
      categoria: "",
      productos: []
    }

    try{
      const response = await axios.get(urlCategorias)

      let arrayCategorias = response.data

      let cont = 0
      arrayCategorias.forEach(categoriaNueva => {
        let id = categoriaNueva.id
        let catTemp = Object.create(objetoArray)
        catTemp.categoria = id
        
        //console.log({catTemp})
        array.push(catTemp)
        cont++
      });

      

      let cont2 = 0
      array.forEach(async categoria => {
        let id = categoria.categoria
        let nuevaUrl = urlProductos+"?idCategoria="+id
        const responseProductos = await axios.get(nuevaUrl)
        console.log(responseProductos.data)
        array[cont2].productos = responseProductos.data
        cont2++
      })
    
      setArrayProductos(array)
      setCargando(false)
      //console.log(array)
    }catch(error){
      
      console.log(error)
      console.log({urlProductos})
    }
    
  }


  useEffect(() => {
    (async () =>{
      await fetchCategoriasProductos()
    })()
}, [])

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