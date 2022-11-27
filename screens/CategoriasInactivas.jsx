import { StyleSheet, Text, View, Button, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect,useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Modal } from 'react-native'
//import { TextInput } from 'react-native'
import { TextInput, Divider, Portal, Dialog } from 'react-native-paper';

import RestaurantContext from '../src/components/RestaurantContext'

const width = Dimensions.get('window')

export default function CategoriasInactivas() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  //UseContext
  const { mesa, setMesa, carro, setCarro,carroAgregado,setCarroAgregado,imagenes,setImagenes,productosContext, setProductosContext,categoriasActivas, setCategoriasActivas } = useContext(RestaurantContext)


  //Url usadas
  const baseUrl = 'http://10.0.2.2:8000'
  const url = `${baseUrl}/api/categorias`
  const urlActivos = `${baseUrl}/api/categoriasActivos`
  const urlInactivos = `${baseUrl}/api/categoriasInactivos`

  //UseState
  const [arrayCategorias, setArrayCategorias] = useState([])
  const [arrayCategoriasInactivas, setArrayCategoriasInactivas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalEdicionVisible, setEdicionModalVisible] = useState(false)
  const [modalHabilitarVisible, setHabilitarModalVisible] = useState(false)
  const [categoriaEdit, setCategoriaEdit] = useState()

  //Varibales inputs de pantalla
  let inputCategoria = ""

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
      await Promise.all(api.map(async (api) => await axios.get(api))).then(async ([{ data: categorias }, { data: categoriasActivos }, { data: categoriasInactivos }]) => {
        setArrayCategorias(await categorias)
        setCategoriasActivas(await categoriasActivos)
        setArrayCategoriasInactivas(await categoriasInactivos)
      });
      setCargando(false)
    } catch (error) {
      console.log(error)
    }
  }

  const HabilitarCategoria = async () => {
    let urlHabilitar = `${url}/${categoriaEdit.id}`
    console.log(urlHabilitar)
    try {
      const response = await axios.put(urlHabilitar, { estado: 1 })
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const EditarCategoria = async () => {
    let urlEdicion = `${url}/${categoriaEdit.id}`
    console.log(urlEdicion)
    try {
      const response = await axios.put(urlEdicion, { nombre: inputCategoria })
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  //Formatear inputs
  const FormatearInputs = () => {
    inputCategoria = ""
  }

  //Modals
  const ModalEdicion = (categoria) => {
    setCategoriaEdit(categoria)
    setEdicionModalVisible(true)
  }

  const ModalHabilitar = (categoria) => {
    setCategoriaEdit(categoria)
    setHabilitarModalVisible(true)
  }

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{title.nombre}</Text>
      <TouchableOpacity style={styles.button} onPress={() => { ModalEdicion(title) }}>
        <Image style={styles.image} source={require("../src/images/editar.png")} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => { ModalHabilitar(title) }}>
        <Image style={styles.image} source={require("../src/images/borrar.png")} />
      </TouchableOpacity>
    </View>
  )

  const renderItem = ({ item }) => (
    <Item title={item} />
  )

  const ocultarModalEdicion = () => setEdicionModalVisible(false);
  const ocultarModalHabilitar = () => setHabilitarModalVisible(false);
  return (
    <View >
      <FlatList
        style={styles.flatList}
        data={arrayCategoriasInactivas}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button
        style={styles.button}
        title="Volver"
        onPress={() => { navigation.navigate("admCategorias") }}
      />

      <Portal>
        <Dialog visible={modalEdicionVisible} onDismiss={ocultarModalEdicion}>
          <Dialog.Content>
            <Text>Ingrese el nombre de la categoria</Text>
            <Text>Cambiar nombre</Text>
            <TextInput
              placeholder='Nuevo nombre'
              mode='outlined'
              onChangeText={(text) => inputCategoria = text}
            />
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
          </Dialog.Content>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog visible={modalHabilitarVisible} onDismiss={ocultarModalHabilitar}>
          <Dialog.Content>
          <Text>¿Está seguro que desea habilitar la categoria?</Text>
            <Button
              style={styles.button}
              title="Sí"
              onPress={() => { HabilitarCategoria().then(fetchAllAxios).finally(setHabilitarModalVisible(false)) }}
            />
            <Button
              style={styles.button}
              title="Cancelar"
              onPress={() => { setHabilitarModalVisible(false) }}
            />
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
  },
  flatList: {
    maxHeight: width.height - 150,
  }
})