import { StyleSheet, Text, View, Button, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect,useContext} from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Modal } from 'react-native'
import { TextInput } from 'react-native'

import RestaurantContext from '../src/components/RestaurantContext'

const width = Dimensions.get('window')

export default function AdmMesas() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  //UseContext
  const { mesa, setMesa, carro, setCarro,carroAgregado,setCarroAgregado,imagenes,setImagenes,productosContext, setProductosContext,categoriasActivas, setCategoriasActivas,mesasActivas, setMesasActivas, } = useContext(RestaurantContext)

  //Url usadas
  const baseUrl = 'http://10.0.2.2:8000'
  const url = `${baseUrl}/api/mesas`
  const urlActivos = `${baseUrl}/api/mesasActivos`
  const urlInactivos = `${baseUrl}/api/mesasInactivos`

  //UseState
  const [arrayMesas, setArrayMesas] = useState([])
  const [arrayMesasInactivas, setArrayMesasInactivas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalEdicionVisible, setEdicionModalVisible] = useState(false)
  const [modalBorrarVisible, setBorrarModalVisible] = useState(false)
  const [modalInactivosVisible, setInactivosModalVisible] = useState(false)
  const [modalHabilitarVisible, setHabilitarModalVisible] = useState(false)
  const [mesaEdit, setMesaEdit] = useState()

  //Varibales inputs de pantalla
  let inputMesas = ""

  useEffect(() => {
    (async () => {
      await fetchAllAxios()
    })()
  }, [])


  //Llamado GET a api
  const fetchAllAxios = async () => {
    let api = [
      url,
      urlActivos,
      urlInactivos
    ];
    try {
      await Promise.all(api.map(async (api) => await axios.get(api))).then(async ([{ data: categorias }, { data: mesasActivos }, { data: mesasInactivos }]) => {
        setArrayMesas(await categorias)
        setMesasActivas(await mesasActivos)
        setArrayMesasInactivas(await mesasInactivos)
      });
      setCargando(false)
    } catch (error) {
      console.log(error)
    }
  }

  //Ingreso de datos y modificaciones a API
  const Confirmar = async () => {
    try {
      const response = await axios.post(url, { numMesa: inputMesas })
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const EditarCategoria = async () => {
    let urlEdicion = `${url}/${mesaEdit.id}`
    console.log(urlEdicion)
    try {
      const response = await axios.put(urlEdicion, { numMesa: inputMesas })
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const InHabilitarCategoria = async () => {
    let urlInhabilitar = `${url}/${mesaEdit.id}`
    console.log(urlInhabilitar)
    try {
      const response = await axios.put(urlInhabilitar, {estado:0})
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  //Formatear inputs
  const FormatearInputs = () =>{
    inputMesas = ""
  }

  //Modals
  const ModalEdicion = (mesa) => {
    setMesaEdit(mesa)
    setEdicionModalVisible(true)
  }

  const ModalBorrar = (mesa) => {
    setMesaEdit(mesa)
    setBorrarModalVisible(true)
  }

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{title.numMesa}</Text>
      <TouchableOpacity style={styles.button} onPress={() => { ModalEdicion(title) }}>
        <Image style={styles.image} source={require("../src/images/editar.png")} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => { ModalBorrar(title) }}>
        <Image style={styles.image} source={require("../src/images/borrar.png")} />
      </TouchableOpacity>
    </View>
  )

  const renderItem = ({ item }) => (
    <Item title={item} />
  )

  return (
    <View style={styles.viewBody}>
      <FlatList
        style={styles.flatList}
        data={mesasActivas}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button
        style={styles.button}
        title="Agregar mesa"
        onPress={() => { console.log(setModalVisible(true)) }}
      />
      <Button
        style={styles.button}
        title="Ver mesas inactivas"
        onPress={() => { navigation.navigate("mesasInactivas") }}
      />
      <Modal visible={modalVisible} animationType={'slide'}>
        <View style={styles.modalBackGround}>
          <View style={styles.modalContainer}>
            <Text>Ingrese el número de la mesa</Text>
            <TextInput placeholder='Número de mesa' onChangeText={(text) => inputMesas = text} />
            <Button
              style={styles.button}
              title="Confirmar"
              onPress={() => { Confirmar().then(fetchAllAxios()).then(FormatearInputs()).finally(setModalVisible(false)) }}
            />
            <Button
              style={styles.button}
              title="Cancelar"
              onPress={() => { setModalVisible(false) }}
            />
          </View>
        </View>
      </Modal>
      <Modal visible={modalEdicionVisible} animationType={'slide'}>
        <View style={styles.modalBackGround}>
          <View style={styles.modalContainer}>
            <Text>Cambiar número de mesa</Text>
            <TextInput placeholder='Nuevo número' onChangeText={(text) => inputMesas = text} />
            <Button
              style={styles.button}
              title="Actualizar"
              onPress={() => { EditarCategoria().then(fetchAllAxios()).then(FormatearInputs()).finally(setEdicionModalVisible(false)) }}
            />
            <Button
              style={styles.button}
              title="Cancelar"
              onPress={() => { setEdicionModalVisible(false) }}
            />
          </View>
        </View>
      </Modal>
      <Modal visible={modalBorrarVisible} animationType={'slide'}>
        <View style={styles.modalBackGround}>
          <View style={styles.modalContainer}>
            <Text>¿Está seguro que desea deshabilitar la mesa?</Text>
            <Button
              style={styles.button}
              title="Sí"
              onPress={() => { InHabilitarCategoria().then(fetchAllAxios()).then(FormatearInputs()).finally(setBorrarModalVisible(false)) }}
            />
            <Button
              style={styles.button}
              title="Cancelar"
              onPress={() => { setBorrarModalVisible(false)}}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    marginHorizontal: 30,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0,5)'
  },
  modalContainer: {
    marginHorizontal: 30,
    borderRadius: 16,
    width: '80%',
    backgroundColor: 'white'

  },
  text: {
    flex: 0.6
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
    maxHeight: 30,
    maxWidth: 30,
    flex: 0.2,
    alignSelf: 'flex-end',
    right: 0,
    flexDirection: 'row-reverse',
  },
  image: {
    maxHeight: 20,
    maxWidth: 20,
    marginBottom: 20,
  }
})