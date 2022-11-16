import { StyleSheet, Text, View, Button, Dimensions, FlatList } from 'react-native'
import React, {useState,useEffect,useContext} from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

import RestaurantContext from '../src/components/RestaurantContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Modal } from 'react-native'
import { TextInput } from 'react-native'

const width = Dimensions.get('window')

export default function AdmCategorias() {

  const navigation = useNavigation()

  const baseUrl = 'http://10.0.2.2:8000'
  const url = `${baseUrl}/api/categorias`
  const {mesa, setMesa, carro, setCarro,carroAgregado,setCarroAgregado} = useContext(RestaurantContext)

  const [arrayCategorias , setArrayCategorias] = useState([])
  const [cargando,setCargando] = useState(true)
  const [modalVisible,setModalVisible] = useState(false)

  let inputCategoria = ""

  useEffect(() => {
    (async () =>{
      await fetchCategorias()
    })()
}, [])


// Invoking get method to perform a GET request
const fetchCategorias = async () => {
try{
  const response = await axios.get(url)
  setArrayCategorias(response.data)
  setCargando(false)
  console.log(arrayCategorias)
}catch(error){
  
  console.log(error)
  console.log({url})
}
}

const Confirmar = async () =>{
  try {
    const response = await axios.post(url, {nombre:inputCategoria})
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

const Item = ({ title }) => (
  <View style={styles.item}>
      <Text>{title.nombre}</Text>
  </View>
)

const renderItem = ({ item }) => (
  <Item title={item} />
)

  return (
    <View style = {styles.viewBody}>
      <Text>Administrador de categorias</Text>
      <FlatList
        style = {styles.flatList}
        data={arrayCategorias}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      /> 
      <Button
      style={styles.button}
      title="Agregar categoria"
      onPress={() => {console.log(setModalVisible(true))}}
      />
      <Modal visible = {modalVisible} animationType = {'slide'}>
        <View style = {styles.modalBackGround}>
          <View style = {styles.modalContainer}>
            <Text>Ingrese el nombre de la categoria</Text>
            <TextInput placeholder='Categoria' onChangeText={(text) => inputCategoria = text}/>
            <Button
            style={styles.button}
            title="Confirmar"
            onPress={() => {Confirmar().then(fetchCategorias).finally(setModalVisible(false))}}
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
          
          }
})