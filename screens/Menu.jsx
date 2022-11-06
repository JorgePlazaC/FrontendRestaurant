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
    
    let objetoArray = {
      title: String,
      data: []
    }
    /*
    let objetoArray2 = {
      title: String,
      data: String
    }
    */
    let array = [objetoArray]
    let arrayNombr = []
    let arrayId = []
    let arrayCategorias = []
    

    try{
      const response = await axios.get(urlCategorias)

      arrayCategorias = response.data
      
      
      arrayCategorias.forEach(categoriaNueva => {
        let nombre = categoriaNueva.nombre
        let id = categoriaNueva.id
        let cont = id-1
        
        //let catTemp = Object.create(objetoArray)
        //catTemp.title = nombre
        
        
        arrayId[cont] = id
        array[cont] = Object.create(objetoArray)
        array[cont].title = nombre
        
        
        //arrayNombr[cont] = Object.create(objetoArray2)
        //arrayNombr[cont].title = nombre
        
        //console.log(array)
        
      });
      
      arrayId.forEach(async id => {
        
        let nuevaUrl = urlProductos+"?idCategoria="+id
        const responseProductos = await axios.get(nuevaUrl)
        //console.log(responseProductos.data)
        let cont = id-1
        
        array[cont].data =responseProductos.data
        //arrayNombr[cont].data = LlenarArrayNombres(responseProductos.data,cont)
        //catTemp[cont].data.push(responseProductos.data)
        //console.log(array[0].data[0])
        //console.log(responseProductos.data)
        //console.log(array[0].data)
        /*
        if(cont+1 == arrayId.length){
          setArrayProductos(array)
          setCargando(false)
          if(arrayProductos != null){
            //setCargando(false)
            //console.log(cargando)
          }
          //setArrayNombProductos(arrayNombr)
          //console.log(arrayProductos)
          
        }
        */
       
      })
      
      //console.log("PASO ultimo")
      setArrayProductos(array)
      //setArrayNombProductos(arrayNombr)
      setCargando(false)
      console.log(arrayProductos)
      console.log(cargando)
      
    }catch(error){
      
      console.log(error)
      console.log({urlProductos})
      console.log(arrayProductos)
      console.log(cargando)
    }
    
  }

  const LlenarArrayNombres = (productos,cont) =>{
    const arrayProd = [objetoArray2]
    let cont2 = productos.length
    productos.forEach(producto =>{
      
      arrayProd[cont].data[cont2] = producto.nombre
    })
    return arrayProd
  }


  useEffect(() => {
    (async () =>{
      await fetchCategoriasProductos()
      //console.log(arrayProductos)
      //console.log(arrayProductos)
    })()
}, [])


const Item = ({ title }) => (
  
  <View >
    <Text style={styles.title}>{title.id}</Text>
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

const debuging = () =>{
  console.log(arrayProductos[0].data[0].id)
  console.log(cargando)
}


  return (         
<SafeAreaView style={styles.container}>
<View centerContent style = {styles.viewBody}>
{cargando == true ? (<View><Text>Cargando</Text><ActivityIndicator /></View>):(<View><Text>Menú</Text>
      <Button
      style={styles.button}
      title="Siguiente"
      onPress={() => navigation.navigate("resumen")}
      />   
      <Button
      style={styles.button}
      title="Verificar"
      onPress={debuging}
      />   

<SectionList
        sections={arrayProductos}
        renderItem={({item})=>(
          <View><Text></Text>
          <Text style={styles.taskItem}>{item.nombre}</Text></View>
          
        )}
        renderSectionHeader={({section})=>(
          <Text style={styles.taskTitle}>{section.title}</Text>
        )}
        keyExtractor={item=>item.id}
        stickySectionHeadersEnabled
      />


<SectionList
      sections={arrayProductos}
      keyExtractor={(item, index) => item + index}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )}
      renderItem={({ item }) => <Item title={item} />}
    />
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