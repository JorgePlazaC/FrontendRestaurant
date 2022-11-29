import { StyleSheet, Text, View, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Modal } from 'react-native'
//import { TextInput } from 'react-native'
import { TextInput, Divider, Portal, Dialog, Button } from 'react-native-paper';

import RestaurantContext from '../src/components/RestaurantContext'

const width = Dimensions.get('window')

export default function AdmMesas() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  //UseContext
  const { mesa, setMesa, carro, setCarro, carroAgregado, setCarroAgregado, imagenes, setImagenes, productosContext, setProductosContext, categoriasActivas, setCategoriasActivas, mesasActivas, setMesasActivas, } = useContext(RestaurantContext)

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
      const response = await axios.put(urlInhabilitar, { estado: 0 })
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  //Formatear inputs
  const FormatearInputs = () => {
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

  const ocultarModalAgregar = () => setModalVisible(false);
  const ocultarModalEdicion = () => setEdicionModalVisible(false);
  const ocultarModalBorrar = () => setBorrarModalVisible(false);

  return (
    <View style={styles.viewBody}>
      <FlatList
        style={styles.flatList}
        data={mesasActivas}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button
        mode="contained"
        onPress={() => {
          console.log(setModalVisible(true));
        }}>
        Agregar mesa
      </Button>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate("mesasInactivas");
        }}>
        Ver mesas inactivas
      </Button>
      <Portal>
        <Dialog visible={modalVisible} onDismiss={ocultarModalAgregar}>
          <Dialog.Content>
            <Text>Ingrese el número de la mesa</Text>
            <TextInput placeholder='Número de mesa' onChangeText={(text) => inputMesas = text} />
            <Button
              mode="contained"
              onPress={() => {
                Confirmar().then(fetchAllAxios()).then(FormatearInputs()).finally(setModalVisible(false));
              }}>
              Confirmar
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setModalVisible(false);
              }}>
              Cancelar
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog visible={modalEdicionVisible} onDismiss={ocultarModalEdicion}>
          <Dialog.Content>
            <Text>Cambiar número de mesa</Text>
            <TextInput placeholder='Nuevo número' onChangeText={(text) => inputMesas = text} />
            <Button
              mode="contained"
              onPress={() => {
                EditarCategoria().then(fetchAllAxios()).then(FormatearInputs()).finally(setEdicionModalVisible(false));
              }}>
              Actualizar
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setEdicionModalVisible(false);
              }}>
              Cancelar
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog visible={modalBorrarVisible} onDismiss={ocultarModalBorrar}>
          <Dialog.Content>
            <Text>¿Está seguro que desea deshabilitar la mesa?</Text>
            <Button
              mode="contained"
              onPress={() => {
                InHabilitarCategoria().then(fetchAllAxios()).then(FormatearInputs()).finally(setBorrarModalVisible(false));
              }}>
              Sí
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setBorrarModalVisible(false);
              }}>
              Cancelar
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
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