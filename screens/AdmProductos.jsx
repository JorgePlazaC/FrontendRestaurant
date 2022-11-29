import { StyleSheet, Text, View, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import DropDownPicker from 'react-native-dropdown-picker'
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Modal } from 'react-native'
//import { TextInput } from 'react-native'
import { TextInput, Divider, Portal, Dialog, Button } from 'react-native-paper';

import RestaurantContext from '../src/components/RestaurantContext'

const width = Dimensions.get('window')

export default function AdmProductos() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  //UseContext
  const { mesa, setMesa, carro, setCarro, carroAgregado, setCarroAgregado, imagenes, setImagenes, productosContext, setProductosContext, categoriasActivas, setCategoriasActivas, mesasActivas, setMesasActivas, productosActivas, setProductosActivas } = useContext(RestaurantContext)

  //Url usadas
  const baseUrl = 'http://10.0.2.2:8000'
  const url = `${baseUrl}/api/productos`
  const urlActivos = `${baseUrl}/api/productosActivos`
  const urlInactivos = `${baseUrl}/api/productosInactivos`

  const urlCategorias = `${baseUrl}/api/categorias`
  const urlImagen = `${baseUrl}/api/imagens`

  //UseState
  const [arrayProductos, setArrayProductos] = useState([])
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
        setProductosActivas(await prodActivos)
        setArrayProductosInactivas(await prodInactivos)
        setArrayCategorias(await categorias)
      });
      setCargando(false)
    } catch (error) {
      console.log(error)
    }
  }

  //Metodo que abre el picker image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result);
    }
  };

  //Ingreso de datos y modificaciones a API
  const uploadImage = async () => {
    let id
    if (!image) return;
    const uri =
      Platform.OS === "android"
        ? image.uri
        : image.uri.replace("file://", "");
    let filename = ""
    filename = image.uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const ext = match?.[1];
    const type = match ? `image/${match[1]}` : `image`;
    const formData = new FormData();
    formData.append("image", {
      uri,
      name: `image.${ext}`,
      type,
    });
    try {
      setSubiendoImagen(true)
      const { data } = await axios.post(`${baseUrl}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const response = await axios.post(url, { nombre: inputNombre, idCategoria: valorDrop, idImagen: await data.data.id, urlImagen: await data.data.url, descripcion: inputDescripcion, precio: inputPrecio, stock: inputStock, cant: cantFetch })
      setSubiendoImagen(false)
      await fetchAllAxios()

      if (!data.isSuccess) {
        console.log(data)
        alert("Problema al subir la imagen!");
        return;
      }
      //alert("Image Uploaded");
    } catch (err) {
      console.log(err);
      alert("Algo salió mal");
    } finally {
      setImage(undefined);

    }
  };

  const EditarProducto = async () => {
    let urlEdicion = `${url}/${productosEdit.id}`
    try {
      const response = await axios.put(urlEdicion, { nombre: inputNombre, idCategoria: valorDrop, descripcion: inputDescripcion, precio: inputPrecio, stock: inputStock })
      console.log(response.data)
      await fetchAllAxios()
    } catch (error) {
      console.log(error)
    }
  }

  const InHabilitarCategoria = async () => {
    let urlInhabilitar = `${url}/${productosEdit.id}`
    console.log(urlInhabilitar)
    try {
      const response = await axios.put(urlInhabilitar, { estado: 0 })
      console.log(response.data)
      fetchAllAxios()
    } catch (error) {
      console.log(error)
    }
  }

  const Metodos = async () => {
    await uploadImage()
  }

  const FormatearInputs = () => {
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

  const ModalBorrar = (producto) => {
    setProductosEdit(producto)
    setBorrarModalVisible(true)
  }

  const Item = ({ title }) => (
    <View style={styles.viewBody}>
      <View style={styles.parent}>
      <Image source={{ uri: title.urlImagen }}
          style={styles.image}
        />
        <Text style={styles.text}>{title.nombre}</Text>
        <TouchableOpacity style={styles.button} onPress={() => { ModalEdicion(title) }}>
          <Image style={styles.icon} source={require("../src/images/editar.png")} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { ModalBorrar(title) }}>
          <Image style={styles.icon} source={require("../src/images/borrar.png")} />
        </TouchableOpacity>
      </View>
      <Divider bold={true} style={styles.divider} />
    </View>
  )

  const renderItem = ({ item }) => (
    <Item title={item} />
  )

  const ocultarModalAgregar = () => setModalVisible(false);
  const ocultarModalEdicion = () => setEdicionModalVisible(false);
  const ocultarModalBorrar = () => setBorrarModalVisible(false);

  return (
    <View>
      {cargando == true ? (<Text>Cargando</Text>) : (<View>
        <FlatList
          style={styles.flatList}
          data={productosActivas}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <Button
          mode="contained"
          style={styles.buttonPaper}
          onPress={() => {
            console.log(setModalVisible(true));
          }}>
          Agregar producto
        </Button>
        <Button
          mode="contained"
          style={styles.buttonPaper}
          onPress={() => {
            navigation.navigate("productosInactivas");
          }}>
          Ver productos inactivos
        </Button>
        <Portal>
          <Dialog visible={modalVisible} onDismiss={ocultarModalAgregar}>
            <Dialog.Content>
              <Text>Ingrese el nombre</Text>
              <TextInput placeholder='Nombre' onChangeText={(text) => setInputNombre(text)} />
              <Text>Elija una categoria</Text>
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
              <Text>Ingrese la descripción</Text>
              <TextInput placeholder='Descripción' onChangeText={(text) => setInputDescripcion(text)} />
              <Text>Ingrese el precio</Text>
              <TextInput placeholder='Precio' onChangeText={(text) => setInputPrecio(text)} />
              <Text>Ingrese el stock</Text>
              <TextInput placeholder='Stock' onChangeText={(text) => setInputStock(text)} />
              <Button title="Seleccionar imagen" onPress={pickImage} />
              {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
              <Button
                mode="contained"
                style={styles.buttonPaperModal}
                onPress={() => {
                  Metodos().then(FormatearInputs()).finally(setModalVisible(false));
                }}>
                Confirmar
              </Button>
              <Button
                mode="contained"
                style={styles.buttonPaperModal}
                onPress={() => {
                  setModalVisible(false);
                }}>
                Cancelar
              </Button>
            </Dialog.Content>
          </Dialog>
        </Portal>
        {modalEdicionVisible ? (<Portal>
          <Dialog visible={modalEdicionVisible} onDismiss={ocultarModalEdicion}>
            <Dialog.Content>
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
                mode="contained"
                style={styles.buttonPaperModal}
                onPress={() => {
                  EditarProducto().then(FormatearInputs()).finally(setEdicionModalVisible(false));
                }}>
                Actualizar
              </Button>
              <Button
                mode="contained"
                style={styles.buttonPaperModal}
                onPress={() => {
                  setEdicionModalVisible(false);
                }}>
                Cancelar
              </Button>
            </Dialog.Content>
          </Dialog>
        </Portal>) : (<View></View>)}
        <Portal>
          <Dialog visible={modalBorrarVisible} onDismiss={ocultarModalBorrar}>
            <Dialog.Content>
              <Text>¿Está seguro que desea deshabilitar el producto?</Text>
              <Button
                mode="contained"
                style={styles.buttonPaperModal}
                onPress={() => {
                  InHabilitarCategoria().then(FormatearInputs()).finally(setBorrarModalVisible(false));
                }}>
                Sí
              </Button>
              <Button
                mode="contained"
                style={styles.buttonPaperModal}
                onPress={() => {
                  setBorrarModalVisible(false);
                }}>
                Cancelar
              </Button>
            </Dialog.Content>
          </Dialog>
        </Portal>
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
    backgroundColor: 'white'

  },
  text: {
    flex: 0.6,
    marginTop: 30,
    marginLeft: 15,
    fontSize: 20,
  },
  button: {
    backgroundColor: '#58ACFA',
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
    marginBottom:43,
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
    width: 100, 
    height: 100, 
    backgroundColor: '#859a9b',
    marginTop: 8,
    borderRadius: 20,
  },
  icon: {
    maxHeight: 20,
    maxWidth: 20,
    marginBottom: 20,
  },
  flatList: {
    minHeight: width.height - 150,
    maxHeight: width.height - 150,
  },
  buttonPaper: {
    marginTop: 3,
    marginBottom: 2,
    marginHorizontal: 30,
    backgroundColor: '#58ACFA'
  },
  buttonPaperModal: {
    marginTop: 8,
    marginBottom: 0,
    marginHorizontal: 30,
    backgroundColor: '#58ACFA'
  },
  parent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  divider: {
    marginTop: 8,
  }
})