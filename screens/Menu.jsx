import { StyleSheet, Text, View, Button, SectionList, ActivityIndicator, FlatList, ListItem } from 'react-native'
import React, {useState,useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'

export default function Menu({navigation}) {

  const baseUrl = 'http://10.0.2.2:8000'
  const urlCategorias = `${baseUrl}/api/categorias`
  const urlProductos = `${baseUrl}/api/buscarPorCategoria`
  const urlTodosProductos = `${baseUrl}/api/productos`
  
  
  const [arrayProductos,setArrayProductos] = useState([])
  const [cargando,setCargando] = useState(true)
  const [obtenerMenuApi,setObtenerMenuApi] = useState(true)
  const [productos,setProductos] = useState([])
  let objetoArray = {
    title: String,
    data: []
  }

  
  // Invoking get method to perform a GET request
  const fetchCategoriasProductos = async () => {
    
    let array = [objetoArray]
  let arrayId = []
  let arrayCategorias = []
  let arrayTodosProductos = []
    try{
      const response = await axios.get(urlCategorias)

      arrayCategorias = response.data
      
      arrayCategorias.forEach(categoriaNueva => {
        let nombre = categoriaNueva.nombre
        let id = categoriaNueva.id
        let cont = id-1
        
        arrayId[cont] = id
        array[cont] = Object.create(objetoArray)
        array[cont].title = nombre
        
      });
      
      arrayId.forEach(async id => {
        
        let nuevaUrl = urlProductos+"?idCategoria="+id
        const responseProductos = await axios.get(nuevaUrl)
        
        let cont = id-1
        
        array[cont].data =responseProductos.data

      })
      setArrayProductos(array)
      const responseTodosPr = await axios.get(urlTodosProductos)

      arrayTodosProductos = responseTodosPr.data
      setProductos(arrayTodosProductos)

      //setCargando(false)
      console.log(arrayProductos)
      console.log(cargando)
      
    }catch(error){
      
      console.log(error)
      console.log({urlProductos})
      console.log(arrayProductos)
      console.log(cargando)
    }
    
  }

  

useEffect(() => {
  const ConsultarMenuApi = async () =>{
    await fetchCategoriasProductos().finally(setTimeout(() => setCargando(false), 500))
    setObtenerMenuApi(false)
    //console.log(arrayProductos)
    //console.log(arrayProductos)
  }
  if(obtenerMenuApi){
    ConsultarMenuApi()
  }
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

const ShowInfo = () =>{
  //console.log(arrayProductos[0].data[0])
  console.log(cargando)
}


  return (         
<SafeAreaView style={styles.container}>
<View centerContent style = {styles.viewBody}>
{cargando == true && arrayProductos[0] != undefined ? (<View><Text>Cargando</Text><ActivityIndicator /></View>):(<View><Text>Menú</Text>
      <Button
      style={styles.button}
      title="Siguiente"
      onPress={() => navigation.navigate("resumen")}
      />   
      <Button
      style={styles.button}
      title="Verificar"
      onPress={ShowInfo}
      />   
      
      
      
      

<SectionList
        sections={arrayProductos}
        renderItem={({item})=>(
          <View><Text></Text>
          <Text style={styles.taskItem}>{item.nombre}</Text>
          
          </View>
          
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