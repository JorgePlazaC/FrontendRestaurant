import { StyleSheet, Text, View, Dimensions, FlatList, Image, TouchableOpacity, ActivityIndicator, LogBox } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import DropDownPicker from 'react-native-dropdown-picker'
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Modal } from 'react-native'
//import { TextInput } from 'react-native'
import { TextInput, Divider, Portal, Dialog, Button } from 'react-native-paper';
import { Formik } from "formik";
import * as yup from 'yup'

import RestaurantContext from '../src/components/RestaurantContext'
import CategoriasInactivas from './CategoriasInactivas'
import { ScrollView } from 'react-native-gesture-handler'

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
  const urlCategoriasInactivas = `${baseUrl}/api/categoriasActivos`
  const urlImagen = `${baseUrl}/api/imagens`

  //UseState
  const [arrayProductos, setArrayProductos] = useState([])
  const [arrayProductosInactivas, setArrayProductosInactivas] = useState([])
  const [arrayCategorias, setArrayCategorias] = useState([])
  const [arrayCategoriasActivas, setArrayCategoriasActivas] = useState([])
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
  const [mensajeDrop, setMensajeDrop] = useState()
  const [mensajeImagen, setMensajeImagen] = useState()

  const cantFetch = 0

  useEffect(() => {
    (async () => {
      await fetchAllAxios()
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermission(galleryStatus === 'granted')
      //LogBox.ignoreAllLogs()
    })()
  }, [])

  //Llamado GET a api
  const fetchAllAxios = async () => {
    let api = [
      url,
      urlActivos,
      urlInactivos,
      urlCategorias,
      urlCategoriasInactivas,
    ];
    try {
      await Promise.all(api.map(async (api) => await axios.get(api))).then(async ([{ data: productos }, { data: prodActivos }, { data: prodInactivos }, { data: categorias }, { data: categoriasInactivos }]) => {
        setArrayProductos(await productos)
        setProductosActivas(await prodActivos)
        setArrayProductosInactivas(await prodInactivos)
        setArrayCategorias(await categorias)
        setArrayCategoriasActivas(await categoriasInactivos)
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
      setMensajeImagen(undefined)
    }
  };

  //Ingreso de datos y modificaciones a API
  const uploadImage = async (valores) => {
    setCargando(true)
    setModalVisible(false)

    console.log(inputNombre)
    console.log(inputDescripcion)
    console.log(inputPrecio)
    console.log(inputStock)
    console.log(image)
    console.log(valores)
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

      const response = await axios.post(url, { nombre: valores.nombre, idCategoria: valorDrop, idImagen: await data.data.id, urlImagen: await data.data.url, descripcion: valores.descripcion, precio: parseInt(valores.precio), stock: parseInt(valores.stock), cant: cantFetch })
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
    setCargando(true)
    setEdicionModalVisible(false)
    let urlEdicion = `${url}/${productosEdit.id}`
    try {
      const response = await axios.put(urlEdicion, { nombre: inputNombre, idCategoria: valorDrop, descripcion: inputDescripcion, precio: inputPrecio, stock: inputStock })
      console.log(await response.data)
      await fetchAllAxios()
      FormatearInputs()
    } catch (error) {
      console.log(error)
    }
  }

  const InHabilitarCategoria = async () => {
    setCargando(true)
    setBorrarModalVisible(false)
    let urlInhabilitar = `${url}/${productosEdit.id}`
    console.log(urlInhabilitar)
    try {
      const response = await axios.put(urlInhabilitar, { estado: 0 })
      console.log(await response.data)
      await fetchAllAxios()
      FormatearInputs()
    } catch (error) {
      console.log(error)
    }
  }

  const Metodos = async (valores) => {
    if (!ValidarCategoria() && !ValidarImagen()) {
      await uploadImage(valores)
      FormatearInputs()
    }

  }

  const FormatearInputs = () => {
    setInputNombre("")
    setValorDrop(undefined)
    setInputDescripcion("")
    setInputPrecio("")
    setInputStock("")
  }

  //Modals
  const ModalEdicion = (producto) => {
    setProductosEdit(producto)
    setValorDrop(producto.idCategoria)
    setInputNombre(producto.nombre)
    setInputDescripcion(producto.descripcion)
    setInputPrecio(producto.precio.toString())
    setInputStock(producto.stock.toString())
    setEdicionModalVisible(true)
  }

  const ModalBorrar = (producto) => {
    setProductosEdit(producto)
    setBorrarModalVisible(true)
  }

  //Validaciones
  const productosValidationSchema = yup.object().shape({
    nombre: yup
      .string()
      .max(30, 'No puede haber mas de 30 digitos')
      .required('El campo nombre es requerido.'),
    descripcion: yup
      .string()
      .max(30, 'No puede haber mas de 30 digitos')
      .required('El campo descripción es requerido.'),
    precio: yup
      .string()
      .matches(/^\d*$/, 'El precio tiene que ser un valor numerico')
      .max(8, 'El precio no puede tener mas de 8 digitos')
      .required('El campo precio es requerido.'),
    stock: yup
      .string()
      .matches(/^\d*$/, 'El stock tiene que ser un valor numerico')
      .max(8, 'El stock no puede tener mas de 8 digitos')
      .required('El campo stock es requerido.'),
  })

  const ValidarCategoria = () => {
    if (valorDrop == undefined || valorDrop == null) {
      setMensajeDrop('Ingrese una categoria')
      return true
    } else {
      setMensajeDrop(undefined)
      return false
    }
  }

  const ValidarImagen = () => {
    if (image == undefined || image == null) {
      setMensajeImagen('Ingrese una imagen')
      return true
    } else {
      setMensajeImagen(undefined)
      return false
    }
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
      {cargando == true ? (<View>
        <ActivityIndicator style={styles.activityIndicator} size="large" />
      </View>) :
        (
          <View>
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
                  <Formik
                    initialValues={{ nombre: '', descripcion: '', }}
                    validationSchema={productosValidationSchema}
                    onSubmit={(values) => { Metodos(values) }}>
                    {({
                      handleSubmit, errors, handleChange, touched, setFieldTouched, isValid, values
                    }) => (
                      <View>
                        <ScrollView>
                          <Text>Ingrese el nombre</Text>
                          <TextInput placeholder='Nombre'
                            onChangeText={handleChange('nombre')}
                            onBlur={() => setFieldTouched('nombre')} />
                          <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.nombre}</Text>
                          <Text>Elija una categoria</Text>
                          <DropDownPicker
                            schema={{
                              label: 'nombre',
                              value: 'id'
                            }}
                            placeholder="Seleccione una categoria"
                            open={abrirDrop}
                            value={valorDrop}
                            items={arrayCategoriasActivas}
                            setOpen={setAbrirDrop}
                            setValue={setValorDrop}
                            setItems={setArrayCategorias}
                            listMode="SCROLLVIEW"
                            onChangeValue={(value) => {
                              ValidarCategoria()
                            }}
                          />
                          <Text style={{ fontSize: 12, color: '#FF0D10' }}>{mensajeDrop}</Text>
                          <Text>Ingrese la descripción</Text>
                          <TextInput
                            placeholder='Descripción'
                            onChangeText={handleChange('descripcion')}
                            onBlur={() => setFieldTouched('descripcion')} />
                          <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.descripcion}</Text>
                          <Text>Ingrese el precio</Text>
                          <TextInput
                            placeholder='Precio'
                            onChangeText={handleChange('precio')}
                            onBlur={() => setFieldTouched('precio')} />
                          <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.precio}</Text>
                          <Text>Ingrese el stock</Text>
                          <TextInput
                            placeholder='Stock'
                            onChangeText={handleChange('stock')}
                            onBlur={() => setFieldTouched('stock')} />
                          <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.stock}</Text>
                          <Button
                            mode="contained"
                            style={styles.buttonPaperModal}
                            onPress={() => {
                              pickImage();
                            }}>
                            Seleccionar imagen
                          </Button>
                          <View style={styles.center}>
                            {image && <Image source={{ uri: image.uri }} style={styles.imagePicker} />}
                          </View>
                          <Text style={{ fontSize: 12, color: '#FF0D10' }}>{mensajeImagen}</Text>
                          <Button
                            mode="contained"
                            style={styles.buttonPaperModal}
                            onPress={
                              handleSubmit
                            }>
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
                        </ScrollView>
                      </View>
                    )}
                  </Formik>
                </Dialog.Content>
              </Dialog>
            </Portal>
            {modalEdicionVisible ? (<Portal>
              <Dialog visible={modalEdicionVisible} onDismiss={ocultarModalEdicion}>
                <Dialog.Content>

                  <Formik
                    initialValues={{ nombre: inputNombre, descripcion: inputDescripcion, precio: inputPrecio, stock: inputStock }}
                    validationSchema={productosValidationSchema}
                    onSubmit={(values) => { EditarProducto(values) }}>
                    {({
                      handleSubmit, errors, handleChange, touched, setFieldTouched, isValid, values
                    }) => (
                      <View>
                        <ScrollView>
                          <Text>Ingrese el nombre</Text>
                          <TextInput 
                            value={inputNombre}
                            onChangeText={handleChange('nombre')}
                            onBlur={() => setFieldTouched('nombre')} />
                          <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.nombre}</Text>
                          <Text>Elija una categoria</Text>
                          <DropDownPicker
                            schema={{
                              label: 'nombre',
                              value: 'id'
                            }}
                            placeholder="Seleccione una categoria"
                            open={abrirDrop}
                            value={valorDrop}
                            items={arrayCategoriasActivas}
                            setOpen={setAbrirDrop}
                            setValue={setValorDrop}
                            setItems={setArrayCategorias}
                            listMode="SCROLLVIEW"
                            onChangeValue={(value) => {
                              ValidarCategoria()
                            }}
                          />
                          <Text style={{ fontSize: 12, color: '#FF0D10' }}>{mensajeDrop}</Text>
                          <Text>Ingrese la descripción</Text>
                          <TextInput
                            value={inputDescripcion}
                            onChangeText={handleChange('descripcion')}
                            onBlur={() => setFieldTouched('descripcion')} />
                          <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.descripcion}</Text>
                          <Text>Ingrese el precio</Text>
                          <TextInput
                            value={inputPrecio}
                            onChangeText={handleChange('precio')}
                            onBlur={() => setFieldTouched('precio')} />
                          <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.precio}</Text>
                          <Text>Ingrese el stock</Text>
                          <TextInput
                            value={inputStock}
                            onChangeText={handleChange('stock')}
                            onBlur={() => setFieldTouched('stock')} />
                          <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.stock}</Text>
                          <Button
                            mode="contained"
                            style={styles.buttonPaperModal}
                            onPress={
                              handleSubmit
                            }>
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
                        </ScrollView>
                      </View>
                    )}
                  </Formik>

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
                      InHabilitarCategoria();
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
    marginBottom: 43,
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
  },
  activityIndicator: {
    marginTop: width.height / 3,

  },
  imagePicker: {
    width: 200,
    height: 200,
    marginTop: 8,
    borderRadius: 20,
  },
  center: {
    alignItems: 'center',
  }
})