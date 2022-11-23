import { StyleSheet, Text, View, Button, SectionList, ActivityIndicator, Dimensions,Image, ListItem,StatusBar } from 'react-native'
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
  const {mesa, setMesa, carro, setCarro,carroAgregado,setCarroAgregado} = useContext(RestaurantContext)
 
  
  
  const [arrayProductos,setArrayProductos] = useState([])
  const [cargando,setCargando] = useState(true)
  const [obtenerMenuApi,setObtenerMenuApi] = useState(true)
  const [productos,setProductos] = useState([])
  const [actualizar,setActualizar] = useState()
  let arrayCarro = [Carro]
  let objetoArray = {
    title: String,
    data: []
  }

  let Carro = {
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

      arrayCategorias = await response.data
      
      arrayCategorias.forEach((categoriaNueva,index) => {
        let nombre = categoriaNueva.nombre
        let id = categoriaNueva.id
        let cont = index
        
        arrayId[cont] = id
        array[cont] = Object.create(objetoArray)
        array[cont].title = nombre
        
      });
      
      arrayId.forEach(async (id,index) => {
        
        let nuevaUrl = urlProductos+"?idCategoria="+id
        const responseProductos = await axios.get(nuevaUrl)
        let cont = index
        
        array[cont].data =await responseProductos.data

      })
      setArrayProductos(array)
      const responseTodosPr = await axios.get(urlTodosProductos)

      arrayTodosProductos = await responseTodosPr.data
      setProductos(await arrayTodosProductos)

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

const AgregarAlCarro = (producto) =>{


  //Vaciar info carro
  carro.forEach(elementCarro => {
    if(arrayCarro[0] === undefined){
      arrayCarro[0] = elementCarro
    }else{
      arrayCarro.push(elementCarro)
    }
    
  })

  console.log(arrayCarro)

  let encontrado = true
  if(arrayCarro[0] === undefined){
    let pedido = Object.create(Carro)
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
  pedido.producto = producto
  pedido.cantidad = 1
  arrayCarro.push(pedido)
  }
  setCarro(arrayCarro)
  ContProductos(producto,true)
  console.log(arrayCarro)
}

const EliminarDelCarro = (producto) =>{
  //Vaciado de datos
  carro.forEach(elementCarro => {
    if(arrayCarro[0] === undefined){
      arrayCarro[0]= elementCarro
    } else{
      arrayCarro.push(elementCarro)
    }
    
  })

  //Buscar el producto a eliminar
  if(arrayCarro[0] != undefined){
    arrayCarro.forEach((element,index) =>{
      console.log(arrayCarro)
      if(element.producto.id === producto.id){
        if(element.cantidad > 1){
          element.cantidad--
          console.log(element.cantidad)
          ContProductos(producto,false)
        } else if(element.cantidad === 1){
          //element.slice(index,index+1)
          ContProductos(producto,false)
          arrayCarro.splice(index,1)
        }
      }
    })
  }
  setCarro(arrayCarro)
}

const ConfirmarCarro = () =>{
  if(carroAgregado){
    navigation.navigate("resumen")
  } else{
  setCarroAgregado(true)
  navigation.navigate("resumen")
  }
}

const ContProductos = (producto,accion) => {
  let arrayTemp = []
  arrayProductos.forEach(element =>{
    if(arrayTemp[0] === undefined){
      arrayTemp[0] = element
    } else{
      arrayTemp.push(element)
    }
  })
  
  if(accion){
    arrayTemp.forEach((categoria) =>{
      categoria.data.forEach((productoCategoria)=>{
        if(producto.id === productoCategoria.id){
          productoCategoria.cant++
        }
      })
    })
  } else{
    arrayTemp.forEach((categoria) =>{
      categoria.data.forEach((productoCategoria)=>{
        if(producto.id === productoCategoria.id){
          productoCategoria.cant--
        }
      })
    })
  }
  
  setArrayProductos(arrayTemp)
}

const Item = ({ title }) => (
  <View style = {styles.container}>
    <Image source={{ uri: title.urlImagen }}
            style={{ width: 80, height: 80, backgroundColor: '#859a9b'}}/>
    <Text style={styles.textSection}>{title.nombre}</Text>
    <Button
      style={styles.buttonEliminar}
      title="-"
      onPress={() => {EliminarDelCarro(title)}}
      /> 
    <Text style = {styles.textCont}>{title.cant}</Text>
    <Button
      style={styles.buttonAgregar}
      title="+"
      onPress={() => {AgregarAlCarro(title)}}
      /> 
      
  </View>
)


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
      flex: 0.9, 
      height: 30
    },
    buttonAgregar: {
      flex: 0.25,
    },
    buttonEliminar: {
      flex: 0.25,
    },
    textCont: {
      flex: 0.13,
      textAlign: 'center',
    },
    sectionList: {
      maxHeight: width.height-150,
    }
})