import { StyleSheet, Text, View, Button, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native'
import React, {useState,useEffect,useContext} from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import DropDownPicker from 'react-native-dropdown-picker'
import * as ImagePicker from 'expo-image-picker';

import RestaurantContext from '../src/components/RestaurantContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Modal } from 'react-native'
import { TextInput } from 'react-native'

const width = Dimensions.get('window')

export default function AdmProductos() {

  const navigation = useNavigation()

  const baseUrl = 'http://10.0.2.2:8000'
  const url = `${baseUrl}/api/productos`
  const urlCategorias = `${baseUrl}/api/categorias`
  const {mesa, setMesa, carro, setCarro,carroAgregado,setCarroAgregado} = useContext(RestaurantContext)

  const [arrayProductos , setArrayProductos] = useState([])
  const [arrayCategorias , setArrayCategorias] = useState([])
  const [cargando,setCargando] = useState(true)
  const [modalVisible,setModalVisible] = useState(false)
  const [modalEdicionVisible,setEdicionModalVisible] = useState(false)
  const [modalBorrarVisible,setBorrarModalVisible] = useState(false)
  const [productosEdit,setProductosEdit] = useState()
  const [abrirDrop, setAbrirDrop] = useState(false);
  const [valorDrop, setValorDrop] = useState(null);
  const [image, setImage] = useState(null);
  const [hasGalleryPermission,setHasGalleryPermission] = useState()
  const [inputNombre,setInputNombre] = useState()
  const [inputDescripcion,setInputDescripcion] = useState()
  const [inputPrecio,setInputPrecio] = useState()
  const [inputStock,setInputStock] = useState()

  const [image64,setImage64] = useState()

  let cantFetch = 0


  useEffect(() => {
    (async () =>{
      await fetchProductos()
      await fetchCategorias().finally(TiempoExtra)
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermission(galleryStatus === 'granted')
    })()
}, [])


// Invoking get method to perform a GET request
const fetchProductos = async () => {
try{
  const response = await axios.get(url)
  setArrayProductos(response.data)
}catch(error){
  
  console.log(error)
  console.log({url})
}
}

const fetchCategorias = async () => {
  try{
    const response = await axios.get(urlCategorias)
    setArrayCategorias(response.data)
  }catch(error){
    
    console.log(error)
    console.log({url})
  }
  }

const Confirmar = async () =>{
  /*
  const data = new FormData();

    data.append('nombre', {inputNombre})
    data.append('idCategoria', {valorDrop})
    data.append('imagen', {image64})
    data.append('descripcion', {inputDescripcion})
    data.append('precio', {inputPrecio})
    data.append('stock', {inputStock})
    data.append('cant', {cantFetch})
    */
  try {
    
    const response = await axios.post(url, {nombre:inputNombre,idCategoria:valorDrop,imagen:image64,descripcion:inputDescripcion,precio:inputPrecio,stock:inputStock,cant:cantFetch})
    console.log(response.data)
    
  } catch (error) {
    console.log(error)
  }
}

const ModalEdicion = (producto) =>{
  setProductosEdit(producto)
  setEdicionModalVisible(true)
}

const ModalBorrar = (producto) =>{
  setProductosEdit(producto)
  setBorrarModalVisible(true)
}

const EditarCategoria = async () => {
  let urlEdicion = `${url}/${productosEdit.id}`
  try {
    const response = await axios.put(urlEdicion, {nombre:inputProducto})
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

const BorrarCategoria = async () => {
  let urlBorrar = `${url}/${productosEdit.id}`
  try {
    const response = await axios.delete(urlBorrar)
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64:true
  });

  if (!result.canceled) {
    setImage(result.uri);
    setImage64(result.base64)
  }
};

const TiempoExtra = () => {
  setCargando(true)
  setTimeout(() => {
    setCargando(false)
    setModalVisible(false)
  }, 2000)
}

const Item = ({ title }) => (
  <View style={styles.item}>
      <Text style = {styles.text}>{title.nombre}</Text>
      
      <TouchableOpacity style={styles.button} onPress={()=>{ModalEdicion(title)}}>
          <Image style = {styles.image} source={require("../src/images/editar.png")}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>{ModalBorrar(title)}}>
          <Image style = {styles.image} source={require("../src/images/borrar.png")}/>
        </TouchableOpacity>
        {title.imagen && (<Image source={{ uri: 'data:image/jpg;base64,' +  title.imagen}}
            style={{ width: 200, height: 200 }}
          />)}
  </View>
)

const renderItem = ({ item }) => (
  <Item title={item} />
)

const Despliegue = () =>{
  console.log(inputNombre)
  console.log(valorDrop)
  console.log(inputDescripcion)
  console.log(inputPrecio)
  console.log(inputStock)
  console.log(cantFetch)
  console.log(image)
}

  return (
    <View>
    {cargando == true ? (<Text>Cargando</Text>):(<View style = {styles.viewBody}>
      <FlatList
        style = {styles.flatList}
        data={arrayProductos
  }
        renderItem={renderItem}
        keyExtractor={item => item.id}
      /> 
      <Button
      style={styles.button}
      title="Agregar producto"
      onPress={() => {console.log(setModalVisible(true))}}
      />
      <Button
            style={styles.button}
            title="Cancelar"
            onPress={() => {console.log(arrayProductos[9].imagen)}}
            />
      <Modal visible = {modalVisible} animationType = {'slide'}>
        <View style = {styles.modalBackGround}>
          <View style = {styles.modalContainer}>
            <Text>Ingrese el nombre</Text>
            <TextInput placeholder='Nombre' onChangeText={(text) => setInputNombre(text)}/>
            <Text>Elija una categoria</Text>
            <DropDownPicker
            schema={{
              label: 'nombre',
              value: 'id'
            }}
              open={abrirDrop}
              value={valorDrop}
              items={arrayCategorias}
              setOpen={setAbrirDrop}
              setValue={setValorDrop}
              setItems={setArrayCategorias}
            />
            <Text>Ingrese la descripción</Text>
            <TextInput placeholder='Descripción' onChangeText={(text) => setInputDescripcion(text)}/>
            <Text>Ingrese el precio</Text>
            <TextInput placeholder='Precio' onChangeText={(text) => setInputPrecio(text)}/>
            <Text>Ingrese el stock</Text>
            <TextInput placeholder='Stock' onChangeText={(text) => setInputStock(text)}/>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            <Button
            style={styles.button}
            title="Confirmar"
            onPress={() => {Confirmar().then(fetchProductos).finally(TiempoExtra)}}
            />
            <Button
            style={styles.button}
            title="Cancelar"
            onPress={() => {setModalVisible(false)}}
            />
          </View>
        </View>
      </Modal>
      <Modal visible = {modalEdicionVisible} animationType = {'slide'}>
        <View style = {styles.modalBackGround}>
          <View style = {styles.modalContainer}>
            <Text>Cambiar nombre</Text>
            <TextInput placeholder='Nuevo nombre' onChangeText={(text) => inputNombre = text}/>
            <Button
            style={styles.button}
            title="Cambiar"
            onPress={() => {EditarCategoria().then(fetchProductos).finally(setEdicionModalVisible(false))}}
            />
            <Button
            style={styles.button}
            title="Cancelar"
            onPress={() => {setEdicionModalVisible(false)}}
            />
          </View>
        </View>
      </Modal>
      <Modal visible = {modalBorrarVisible} animationType = {'slide'}>
        <View style = {styles.modalBackGround}>
          <View style = {styles.modalContainer}>
            <Text>¿Está seguro que desea eliminar la categoria?</Text>
            <Button
            style={styles.button}
            title="Sí"
            onPress={() => {BorrarCategoria().then(fetchProductos).finally(setBorrarModalVisible(false))}}
            />
            <Button
            style={styles.button}
            title="Cancelar"
            onPress={() => {setBorrarModalVisible(false)}}
            />
          </View>
        </View>
      </Modal>
    </View>)}
    </View>
  )
}

const styles = StyleSheet.create({
    viewBody:{
        marginHorizontal: 30,
        },
        modalBackGround:{
          flex:1,
          backgroundColor:'rgba(0,0,0,0,5)'
          },
          modalContainer:{
            marginHorizontal: 30,
          borderRadius: 16,
          width:'80%',
          backgroundColor:'white',
          },
          text:{
            flex:0.6
          },
          button: {
            backgroundColor: '#859a9b',
            borderRadius: 10,
            padding: 5,
            marginBottom: 10,
            shadowColor: '#303838',
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 10,
            shadowOpacity: 0.35,
            maxHeight:30,
            maxWidth:30,
            flex:0.2,
            alignSelf: 'flex-end',
            right: 0,
            flexDirection: 'row-reverse',
          },
          image: {
            maxHeight:20,
            maxWidth:20,
            marginBottom: 20,
          },
          flatList: {
            maxHeight: width.height-150,
          }
})