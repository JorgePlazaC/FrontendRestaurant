import { StyleSheet, Text, View, Dimensions, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
//import { TextInput } from 'react-native'
import { TextInput, Divider, Portal, Dialog, Button } from 'react-native-paper';
import { Formik } from "formik";
import * as yup from 'yup'

import RestaurantContext from '../src/components/RestaurantContext'

const width = Dimensions.get('window')

export default function AdmCategorias() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  //UseContext
  const { mesa, setMesa, carro, setCarro, carroAgregado, setCarroAgregado, imagenes, setImagenes, productosContext, setProductosContext, categoriasActivas, setCategoriasActivas } = useContext(RestaurantContext)

  //Url usadas
  const baseUrl = 'http://10.0.2.2:8000'
  const url = `${baseUrl}/api/categorias`
  const urlActivos = `${baseUrl}/api/categoriasActivos`
  const urlInactivos = `${baseUrl}/api/categoriasInactivos`

  //UseState
  const [arrayCategorias, setArrayCategorias] = useState([])
  const [arrayCategoriasInactivas, setArrayCategoriasInactivas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalEdicionVisible, setEdicionModalVisible] = useState(false)
  const [modalBorrarVisible, setBorrarModalVisible] = useState(false)
  const [categoriaEdit, setCategoriaEdit] = useState()
  const [inputCategoria, setInputCategoria] = useState()

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

  //Ingreso de datos y modificaciones a API
  const Confirmar = async (valores) => {
    setCargando(true)
    setModalVisible(false)
    try {
      const response = await axios.post(url, { nombre: valores.categoria })
      console.log(await response.data)
      await fetchAllAxios()
      FormatearInputs()
    } catch (error) {
      console.log(error)
    }
  }

  const EditarCategoria = async (valores) => {
    setCargando(true)
    setEdicionModalVisible(false)
    let urlEdicion = `${url}/${categoriaEdit.id}`
    console.log(urlEdicion)
    try {
      const response = await axios.put(urlEdicion, { nombre: valores.categoria })
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
    let urlInhabilitar = `${url}/${categoriaEdit.id}`
    console.log(urlInhabilitar)
    try {
      const response = await axios.put(urlInhabilitar, { estado: 0 })
      console.log(await response.data)
      await fetchAllAxios()
    } catch (error) {
      console.log(error)
    }
  }

  //Formatear inputs
  const FormatearInputs = () => {
    setInputCategoria("")
  }

  //Modals
  const ModalEdicion = (categoria) => {
    setCategoriaEdit(categoria)
    setInputCategoria(categoria.nombre)
    setEdicionModalVisible(true)
  }

  const ModalBorrar = (categoria) => {
    setCategoriaEdit(categoria)
    setBorrarModalVisible(true)
  }

  //Validaciones
  const categoriaValidationSchema = yup.object().shape({
    categoria: yup
      .string()
      .required('El campo categoria es requerido.'),
  })

  const Item = ({ title }) => (
    <View style={styles.viewBody}>
      <View style={styles.parent}>
        <Text style={styles.text}>{title.nombre}</Text>
        <TouchableOpacity style={styles.button} onPress={() => { ModalEdicion(title) }}>
          <Image style={styles.image} source={require("../src/images/editar.png")} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { ModalBorrar(title) }}>
          <Image style={styles.image} source={require("../src/images/borrar.png")} />
        </TouchableOpacity>
      </View>
      <Divider bold={true} />
    </View>
  )

  const renderItem = ({ item }) => (
    <Item title={item} />
  )

  const ocultarModalAgregar = () => setModalVisible(false);
  const ocultarModalEdicion = () => setEdicionModalVisible(false);
  const ocultarModalBorrar = () => setBorrarModalVisible(false);
  return (
    <View >
      {cargando ?
        (
          <View>
            <ActivityIndicator style={styles.activityIndicator} size="large" />
          </View>
        ) :
        (
          <View>
            <FlatList
              style={styles.flatList}
              data={categoriasActivas}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
            <Button
              mode="contained"
              style={styles.buttonPaper}
              onPress={() => {
                console.log(setModalVisible(true));
              }}>
              Agregar categoria
            </Button>
            <Button
              mode="contained"
              style={styles.buttonPaper}
              onPress={() => {
                navigation.navigate("categoriasInactivas");
              }}>
              Ver categorias inactivas
            </Button>
            <Portal>
              <Dialog visible={modalVisible} onDismiss={ocultarModalAgregar}>
                <Dialog.Content>
                  <Formik
                    initialValues={{ categoria: '' }}
                    validationSchema={categoriaValidationSchema}
                    onSubmit={(values) => { Confirmar(values) }}>
                    {({
                      handleSubmit, errors, handleChange, touched, setFieldTouched, isValid, values
                    }) => (
                      <View>
                        <Text>Ingrese el nombre de la categoria</Text>
                        <TextInput
                          value={values.categoria}
                          placeholder='Nombre categoria'
                          mode='outlined'
                          onChangeText={handleChange('categoria')}
                          onBlur={() => setFieldTouched('categoria')}
                        />
                        <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.categoria}</Text>
                        <Button
                          mode="contained"
                          style={styles.buttonPaperModal}
                          disabled={!isValid}
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
                      </View>
                    )}
                  </Formik>
                </Dialog.Content>
              </Dialog>
            </Portal>
            <Portal>
              <Dialog visible={modalEdicionVisible} onDismiss={ocultarModalEdicion}>
                <Dialog.Content>
                  <Formik
                    initialValues={{ categoria: inputCategoria }}
                    validationSchema={categoriaValidationSchema}
                    onSubmit={(values) => { EditarCategoria(values) }}>
                    {({
                      handleSubmit, errors, handleChange, touched, setFieldTouched, isValid, values
                    }) => (
                      <View>
                        <Text>Ingrese el nuevo nombre de la categoria</Text>
                        <TextInput
                          value={values.categoria}
                          mode='outlined'
                          onChangeText={handleChange('categoria')}
                          onBlur={() => setFieldTouched('categoria')}
                        />
                        <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.categoria}</Text>
                        <Button
                          mode="contained"
                          style={styles.buttonPaperModal}
                          disabled={!isValid}
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
                      </View>
                    )}
                  </Formik>
                </Dialog.Content>
              </Dialog>
            </Portal>
            <Portal>
              <Dialog visible={modalBorrarVisible} onDismiss={ocultarModalBorrar}>
                <Dialog.Content>
                  <Text>??Est?? seguro que desea deshabilitar la categoria?</Text>
                  <Button
                    mode="contained"
                    style={styles.buttonPaperModal}
                    onPress={() => {
                      InHabilitarCategoria();
                    }}>
                    S??
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
          </View>
        )}
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
    marginTop: 15,
    fontSize: 20,
  },
  button: {
    backgroundColor: '#58ACFA',
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
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
    minHeight: width.height - 170,
    maxHeight: width.height - 170,
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
  activityIndicator: {
    marginTop: width.height / 3,

  }
})