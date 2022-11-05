import { StyleSheet, Text, View, Button, SectionList, ActivityIndicator } from 'react-native'
import React, {useState,useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'

export default function Menu({navigation}) {

  const baseUrl = 'http://10.0.2.2:8000'
  const urlCategorias = `${baseUrl}/api/categorias`
  const urlProductos = `${baseUrl}/api/buscarPorCategoria`
  
  
  const [arrayProductos,setArrayProductos] = useState(null)
  const [arrayNombProductos,setArrayNombProductos] = useState(null)
  const [cargando,setCargando] = useState(true)

  // Invoking get method to perform a GET request
  const fetchCategoriasProductos = async () => {

    let array = []
    let arrayNombr = []
    let arrayId = []
    let arrayCategorias = []

    

    let objetoArray = {
      title: String,
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
        arrayNombr.push(catTemp)
        
      });

      arrayId.forEach(async categoria => {
        let id = categoria
        let nuevaUrl = urlProductos+"?idCategoria="+id
        const responseProductos = await axios.get(nuevaUrl)
        //console.log(responseProductos.data)
        let cont = id-1
        array[cont].data = responseProductos.data
        arrayNombr[cont].data = LlenarArrayNombres(responseProductos.data)
        //console.log(arrayNombr[0].data[0])
      })
      //console.log(arrayNombr[0].data[0])
      setArrayProductos(array)
      setArrayNombProductos(arrayNombr)
      setCargando(false)
      //console.log(arrayNombr[0].data[0])
    }catch(error){
      
      console.log(error)
      console.log({urlProductos})
    }
    
  }

  const LlenarArrayNombres = (productos) =>{
    let arrayProd = []
    productos.forEach(producto =>{
      arrayProd.push(producto.nombre)
    })
    return arrayProd
  }


  useEffect(() => {
    (async () =>{
      await fetchCategoriasProductos()
      //console.log(arrayProductos[0].data)
      //console.log(arrayNombProductos[1].data[1])
    })()
}, [])

const Item = ({ title }) => (
  
  <View >
    <Text style={styles.title}>{title}</Text>
  </View>
);

const DATA = [
  {
    title: "Main dishes",
    data: ["Pizza", "Burger", "Risotto"]
  },
  {
    title: "Sides",
    data: ["French Fries", "Onion Rings", "Fried Shrimps"]
  },
  {
    title: "Drinks",
    data: ["Water", "Coke", "Beer"]
  },
  {
    title: "Desserts",
    data: ["Cheese Cake", "Ice Cream"]
  }
];

const debugging = () =>{
  console.log(arrayNombProductos[0].data[0])
}

  return (         
<SafeAreaView style={styles.container}>
<View centerContent style = {styles.viewBody}>
{cargando ? (<View><Text>Cargando</Text><ActivityIndicator /></View>):(<View><Text>Menú</Text>
      <Button
      style={styles.button}
      title="Siguiente"
      onPress={() => navigation.navigate("resumen")}
      />   
      <SectionList
      sections={arrayNombProductos}
      keyExtractor={(item, index) => item + index}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )}
      renderItem={({ item }) => <Item title={item} />}
      />
      {debugging()}
      </View>)}
        
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
    },
    item: {
      backgroundColor: "#f9c2ff",
      padding: 20,
      marginVertical: 8
    },
    header: {
      fontSize: 32,
      backgroundColor: "#fff"
    },
    title: {
      fontSize: 24
    }
})