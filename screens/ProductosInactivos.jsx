import { StyleSheet, Text, View, Button, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import DropDownPicker from 'react-native-dropdown-picker'
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Modal } from 'react-native'
import { TextInput } from 'react-native'

import RestaurantContext from '../src/components/RestaurantContext'

const width = Dimensions.get('window')

export default function ProductosActivos() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  //UseContext
  const { mesa, setMesa, carro, setCarro,carroAgregado,setCarroAgregado,imagenes,setImagenes,productosContext, setProductosContext,categoriasActivas, setCategoriasActivas,mesasActivas, setMesasActivas,productosActivas, setProductosActivas } = useContext(RestaurantContext)

  //Url usadas
  const baseUrl = 'http://10.0.2.2:8000'
  const url = `${baseUrl}/api/productos`
  const urlActivos = `${baseUrl}/api/productosActivos`
  const urlInactivos = `${baseUrl}/api/productosInactivos`

  const urlCategorias = `${baseUrl}/api/categorias`
  const urlImagen = `${baseUrl}/api/imagens`

  //UseState
  const [arrayProductos, setArrayProductos] = useState([])
  const [arrayProductosActivas, setArrayProductosActivas] = useState([])
  const [arrayProductosInactivas, setArrayProductosInactivas] = useState([])
  const [arrayCategorias, setArrayCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalEdicionVisible, setEdicionModalVisible] = useState(false)
  const [modalBorrarVisible, setBorrarModalVisible] = useState(false)
  const [modalInactivosVisible, setInactivosModalVisible] = useState(false)
  const [modalHabilitarVisible, setHabilitarModalVisible] = useState(false)
  const [productosEdit, setProductosEdit] = useState()
  const [abrirDrop, setAbrirDrop] = useState(false);
  const [valorDrop, setValorDrop] = useState(null);
  const [image, setImage] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState()
  const [inputNombre, setInputNombre] = useState()
  const [inputDescripcion, setInputDescripcion] = useState()
  const [inputPrecio, setInputPrecio] = useState()
  const [inputStock, setInputStock] = useState()
  const [subiendoImagen, setSubiendoImagen] = useState(false)

  const cantFetch = 0

  useEffect(() => {
    (async () => {
      await fetchAllAxios()
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermission(galleryStatus === 'granted')
    })()
  }, [])

  //Llamado GET a api
  const fetchAllAxios = async () => {
    let api = [
      url,
      urlActivos,
      urlInactivos,
      urlCategorias,
    ];
    try {
      await Promise.all(api.map(async (api) => await axios.get(api))).then(async ([{ data: productos }, { data: prodActivos }, { data: prodInactivos }, { data: categorias }]) => {
        setArrayProductos(await productos)
        setArrayProductosActivas(await prodActivos)
        setArrayProductosInactivas(await prodInactivos)
        setArrayCategorias(await categorias)
      });
      setCargando(false)
    } catch (error) {
      console.log(error)
    }
  }

  const EditarProducto = async () => {
    let urlEdicion = `${url}/${productosEdit.id}`
    try {
      const response = await axios.put(urlEdicion, { nombre: inputNombre,idCategoria:valorDrop, descripcion: inputDescripcion,precio:inputPrecio,stock:inputStock })
      console.log(response.data)
      await fetchAllAxios()
    } catch (error) {
      console.log(error)
    }
  }

  const HabilitarCategoria = async () => {
    let urlHabilitar = `${url}/${productosEdit.id}`
    console.log(urlHabilitar)
    try {
      const response = await axios.put(urlHabilitar, {estado:1})
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const FormatearInputs = () =>{
    setInputNombre("")
    setValorDrop("")
    setInputDescripcion("")
    setInputPrecio("")
    setInputStock("")
  }

  //Modals
  const ModalEdicion = (producto) => {
    setProductosEdit(producto)
    setEdicionModalVisible(true)
  }

  const ModalHabilitar = (producto) => {
    setProductosEdit(producto)
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
      <Image source={{ uri: title.urlImagen }}
        style={{ width: 200, height: 200, backgroundColor: '#859a9b' }}
      />
    </View>
  )

  const renderItem = ({ item }) => (
    <Item title={item} />
  )

  return (
    <View>
      {cargando == true ? (<Text>Cargando</Text>) : (<View style={styles.viewBody}>
        <FlatList
          style={styles.flatList}
          data={arrayProductosInactivas}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        {modalEdicionVisible ? (<Modal visible={modalEdicionVisible} animationType={'slide'}>
          <View style={styles.modalBackGround}>
            <View style={styles.modalContainer}>
              <Text>Nombre</Text>
              <TextInput placeholder={productosEdit.nombre} onChangeText={(text) => setInputNombre(text)} />
              <DropDownPicker
                schema={{
                  label: 'nombre',
                  value: 'id'
                }}
                placeholder="Seleccione una categoria"
                open={abrirDrop}
                value={valorDrop}
                items={arrayCategorias}
                setOpen={setAbrirDrop}
                setValue={setValorDrop}
                setItems={setArrayCategorias}
              />
              <Text>Descripción</Text>
              <TextInput placeholder={productosEdit.descripcion} onChangeText={(text) => setInputDescripcion(text)} />
              <Text>Precio</Text>
              <TextInput placeholder={productosEdit.precio.toString()} onChangeText={(text) => setInputPrecio(text)} />
              <Text>Stock</Text>
              <TextInput placeholder={productosEdit.stock.toString()} onChangeText={(text) => setInputStock(text)} />
              <Button
                style={styles.button}
                title="Actualizar"
                onPress={() => { EditarProducto().then(FormatearInputs()).finally(setEdicionModalVisible(false)) }}
              />
              <Button
                style={styles.button}
                title="Cancelar"
                onPress={() => { setEdicionModalVisible(false) }}
              />
            </View>
          </View>
        </Modal>):(<View></View>)}
      <Modal visible={modalHabilitarVisible} animationType={'slide'}>
        <View style={styles.modalBackGround}>
          <View style={styles.modalContainer}>
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
          </View>
        </View>
      </Modal>
      </View>)}
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
    backgroundColor: 'white',
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