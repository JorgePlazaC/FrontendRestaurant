import { StyleSheet, Text, View, Button, SectionList, ActivityIndicator, Dimensions, ListItem,StatusBar } from 'react-native'
import React, {useState,useEffect,useContext} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'

import RestaurantContext from '../src/components/RestaurantContext'

const width = Dimensions.get('window')

export default function Menu({navigation}) {

  const baseUrl = 'http://10.0.2.2:8000'
  const urlCategorias = `${baseUrl}/api/categorias`
  const urlProductos = `${baseUrl}/api/buscarPorCategoria`
  const urlTodosProductos = `${baseUrl}/api/productos`
  const {mesa, setMesa, carro, setCarro} = useContext(RestaurantContext)
 
  
  
  const [arrayProductos,setArrayProductos] = useState([])
  const [cargando,setCargando] = useState(true)
  const [obtenerMenuApi,setObtenerMenuApi] = useState(true)
  const [productos,setProductos] = useState([])
  const arrayCarro = [Carro]
  let objetoArray = {
    title: String,
    data: []
  }

  let Carro = {
    idMesa: String,
    producto: Object,
    cantidad: Number,
    idFactura: String
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
      
      arrayCategorias.forEach((categoriaNueva,index) => {
        let nombre = categoriaNueva.nombre
        let id = categoriaNueva.id
        let cont = index
        
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
    await fetchCategoriasProductos().finally(setCargando(false))
    setObtenerMenuApi(false)
    //console.log(arrayProductos)
    //console.log(arrayProductos)
  }
  if(obtenerMenuApi){
    ConsultarMenuApi()
  }
}, [])



const Item = ({ title }) => (
  
  <View style = {styles.container}>
    <Text style={styles.textSection}>{title.nombre}</Text>
    <Button
      style={styles.buttonSection}
      title="Agregar"
      onPress={() => {AgregarAlCarro(title)}}
      />  
  </View>
);

const AgregarAlCarro = (producto) =>{
  let encontrado = true
  if(arrayCarro[0] === undefined){
    let pedido = Object.create(Carro)
    pedido.idMesa = mesa
    pedido.producto = producto
    pedido.cantidad = 1
    arrayCarro[0] = pedido
    encontrado = false
  }

  if(encontrado){
    arrayCarro.forEach((element,index) =>{
      if(element.producto.id === producto.id){
        arrayCarro[index].cantidad++
        //element.producto.cantidad++
        encontrado = false
        
      }
    })
  }

  if(encontrado){
    let pedido = Object.create(Carro)
  pedido.idMesa = mesa
  pedido.producto = producto
  pedido.cantidad = 1
  arrayCarro.push(pedido)
  }

  console.log(arrayCarro)
}

const ConfirmarCarro = () =>{
  setCarro(arrayCarro)
  navigation.navigate("resumen")
}


  return (         
<SafeAreaView >
<View centerContent style = {styles.viewBody}>
{cargando == true && arrayProductos[0] != undefined ? (<View><Text>Cargando</Text><ActivityIndicator /></View>):
(<View> 
  
<SectionList
style = {styles.sectionList}
      sections={arrayProductos}
      keyExtractor={(item, index) => item + index}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )}
      renderItem={({ item }) => <Item title={item} />}
      stickySectionHeadersEnabled
    />
    <Button
      style={styles.button}
      title="Siguiente"
      onPress={() => {ConfirmarCarro()}}
      />  
      
      </View>)}
</View>
</SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex", 
    flexDirection: 'row', 
    flexGrow: 0,
    
  },
  viewBody:{
    marginHorizontal: 30,
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
    },
    textSection: {
      flex: 0.75, 
      height: 30
    },
    buttonSection: {
      flex: 0.25
    },
    sectionList: {
      maxHeight: width.height-150,
    }
})