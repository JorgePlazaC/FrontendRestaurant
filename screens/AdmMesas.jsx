import { StyleSheet, Text, View, Button, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native'
import React, {useState,useEffect,useContext} from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

import RestaurantContext from '../src/components/RestaurantContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Modal } from 'react-native'
import { TextInput } from 'react-native'

const width = Dimensions.get('window')

export default function AdmMesas() {

  const navigation = useNavigation()

  const baseUrl = 'http://10.0.2.2:8000'
  const url = `${baseUrl}/api/mesas`
  const {mesa, setMesa, carro, setCarro,carroAgregado,setCarroAgregado} = useContext(RestaurantContext)

  const [arrayMesas , setArrayMesas] = useState([])
  const [cargando,setCargando] = useState(true)
  const [modalVisible,setModalVisible] = useState(false)
  const [modalEdicionVisible,setEdicionModalVisible] = useState(false)
  const [modalBorrarVisible,setBorrarModalVisible] = useState(false)
  const [mesaEdit,setMesaEdit] = useState()

  let inputMesas = ""

  useEffect(() => {
    (async () =>{
      await fetchMesas()
    })()
}, [])


// Invoking get method to perform a GET request
const fetchMesas = async () => {
try{
  const response = await axios.get(url)
  setArrayMesas(response.data)
  setCargando(false)
  console.log(arrayMesas)
}catch(error){
  
  console.log(error)
  console.log({url})
}
}

const Confirmar = async () =>{
  try {
    const response = await axios.post(url, {numMesa:inputMesas})
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

const ModalEdicion = (mesa) =>{
  setMesaEdit(mesa)
  setEdicionModalVisible(true)
}

const ModalBorrar = (mesa) =>{
  setMesaEdit(mesa)
  setBorrarModalVisible(true)
}

const EditarCategoria = async () => {
  let urlEdicion = `${url}/${mesaEdit.id}`
  console.log(urlEdicion)
  try {
    const response = await axios.put(urlEdicion, {numMesa:inputMesas})
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

const BorrarCategoria = async () => {
  let urlBorrar = `${url}/${mesaEdit.id}`
  console.log(urlBorrar)
  try {
    const response = await axios.delete(urlBorrar)
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

const Item = ({ title }) => (
  <View style={styles.item}>
      <Text style = {styles.text}>{title.numMesa}</Text>
      <TouchableOpacity style={styles.button} onPress={()=>{ModalEdicion(title)}}>
          <Image style = {styles.image} source={require("../src/images/editar.png")}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>{ModalBorrar(title)}}>
          <Image style = {styles.image} source={require("../src/images/borrar.png")}/>
        </TouchableOpacity>
  </View>
)

const renderItem = ({ item }) => (
  <Item title={item} />
)

  return (
    <View style = {styles.viewBody}>
      <FlatList
        style = {styles.flatList}
        data={arrayMesas}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      /> 
      <Button
      style={styles.button}
      title="Agregar mesa"
      onPress={() => {console.log(setModalVisible(true))}}
      />
      <Modal visible = {modalVisible} animationType = {'slide'}>
        <View style = {styles.modalBackGround}>
          <View style = {styles.modalContainer}>
            <Text>Ingrese el número de la mesa</Text>
            <TextInput placeholder='Número de mesa' onChangeText={(text) => inputMesas = text}/>
            <Button
            style={styles.button}
            title="Confirmar"
            onPress={() => {Confirmar().then(fetchMesas).finally(setModalVisible(false))}}
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
            <Text>Cambiar número de mesa</Text>
            <TextInput placeholder='Nuevo número' onChangeText={(text) => inputMesas = text}/>
            <Button
            style={styles.button}
            title="Cambiar"
            onPress={() => {EditarCategoria().then(fetchMesas).finally(setEdicionModalVisible(false))}}
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
            <Text>¿Está seguro que desea eliminar la mesa?</Text>
            <Button
            style={styles.button}
            title="Sí"
            onPress={() => {BorrarCategoria().then(fetchMesas).finally(setBorrarModalVisible(false))}}
            />
            <Button
            style={styles.button}
            title="Cancelar"
            onPress={() => {setBorrarModalVisible(false)}}
            />
          </View>
        </View>
      </Modal>
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
          backgroundColor:'white'
          
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
          }
})