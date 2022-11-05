import { StyleSheet, Text, View, Button, SectionList } from 'react-native'
import React, {useState,useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
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
    let arrayId = []
    let arrayCategorias = []

    let objetoArray = {
      title: "",
      data: []
    }

    try{
      const response = await axios.get(urlCategorias)

      arrayCategorias = response.data

      arrayCategorias.forEach(categoriaNueva => {
        let nombre = categoriaNueva.nombre
        let id = categoriaNueva.id
        let cont = id-1
        let catTemp = Object.create(objetoArray)
        catTemp.title = nombre
        arrayId[cont] = id
        
        //console.log({catTemp})
        array.push(catTemp)
        
      });

      arrayId.forEach(async categoria => {
        let id = categoria
        let nuevaUrl = urlProductos+"?idCategoria="+id
        const responseProductos = await axios.get(nuevaUrl)
        //console.log(responseProductos.data)
        let cont = id-1
        array[cont].data = responseProductos.data
        //console.log(array[0].data)
      })
    
      setArrayProductos(array)
      setCargando(false)
      //console.log(array[0].data)
    }catch(error){
      
      console.log(error)
      console.log({urlProductos})
    }
    
  }


  useEffect(() => {
    (async () =>{
      await fetchCategoriasProductos()
      //console.log(arrayProductos[0].data)
    })()
}, [])

  return (         
<SafeAreaView style={styles.container}>
<View centerContent style = {styles.viewBody}>
<Text>Menú</Text>
      <Button
      style={styles.button}
      title="Siguiente"
      onPress={() => navigation.navigate("resumen")}
      />   
      
        
</View>
</SafeAreaView>
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