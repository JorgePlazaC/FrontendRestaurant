import { StyleSheet, Text, View, SectionList, ActivityIndicator, Dimensions, Image, ListItem, StatusBar } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { TextInput, Divider, Portal, Dialog, Button } from 'react-native-paper';

import RestaurantContext from '../src/components/RestaurantContext'
import { TouchableOpacity } from 'react-native-gesture-handler'

const width = Dimensions.get('window')

export default function Menu({ navigation }) {

  //Url usadas
  const baseUrl = 'http://10.0.2.2:8000'
  const urlCategorias = `${baseUrl}/api/categoriasActivos`
  const urlProductos = `${baseUrl}/api/buscarPorCategoria`
  const urlTodosProductos = `${baseUrl}/api/productos`

  //UseContext
  const { mesa, setMesa, carro, setCarro, carroAgregado, setCarroAgregado, imagenes, setImagenes, productosContext, setProductosContext } = useContext(RestaurantContext)

  //UseState
  const [arrayProductos, setArrayProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [obtenerMenuApi, setObtenerMenuApi] = useState(true)
  const [productos, setProductos] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [detalleProducto, setDetalleProducto] = useState()
  const [contadorProducto, setContadorProducto] = useState()

  useEffect(() => {
    const ConsultarMenuApi = async () => {
      await fetchCategoriasProductos()
      setObtenerMenuApi(false)
    }
    if (obtenerMenuApi) {
      ConsultarMenuApi()
    }
  }, [])

  //Objetos de carro
  let arrayCarro = [Carro]
  let objetoArray = {
    title: String,
    data: []
  }

  let Carro = {
    producto: Object,
    cantidad: Number,
    idFactura: String
  }

  //Llamado GET a api
  const fetchCategoriasProductos = async () => {

    let array = [objetoArray]
    let arrayId = []
    let arrayCategorias = []
    let arrayTodosProductos = []
    try {
      await axios.get(urlCategorias).then(function (response) {
        console.log(response.data);
        arrayCategorias = response.data
      })
        .catch(function (error) {
          console.log(error);
        });



      arrayCategorias.forEach((categoriaNueva, index) => {
        let nombre = categoriaNueva.nombre
        let id = categoriaNueva.id
        let cont = index

        arrayId[cont] = id
        array[cont] = Object.create(objetoArray)
        array[cont].title = nombre

      });

      try {
        arrayId.forEach(async (id, index) => {
          let nuevaUrl = urlProductos + "?idCategoria=" + id
          const response = await axios.get(nuevaUrl)
          console.log(await response);
          let cont = index

          array[cont].data = await response.data
        })
      } catch (error) {
        console.log(error)
      }
      setArrayProductos(array)
      setProductosContext(array)
      await axios.get(urlTodosProductos).then(function (response) {
        console.log(response);
        arrayTodosProductos = response.data
        setProductos(arrayTodosProductos)
      })
        .catch(function (error) {
          console.log(error);
        });

      setCargando(false)



      //setCargando(false)
      console.log(productosContext)
      console.log(cargando)

    } catch (error) {

      console.log(error)
      console.log({ urlProductos })
      console.log(productosContext)
      console.log(cargando)
    }

  }

  //Ingreso de datos y modificaciones a API
  const AgregarAlCarro = () => {


    //Vaciar info carro
    carro.forEach(elementCarro => {
      if (arrayCarro[0] === undefined) {
        arrayCarro[0] = elementCarro
      } else {
        arrayCarro.push(elementCarro)
      }

    })

    console.log(arrayCarro)

    let encontrado = true
    if (arrayCarro[0] === undefined) {
      let pedido = Object.create(Carro)
      pedido.producto = detalleProducto
      pedido.cantidad = 1
      arrayCarro[0] = pedido
      encontrado = false
    }

    if (encontrado) {
      arrayCarro.forEach((element, index) => {
        if (element.producto.id === detalleProducto.id) {
          arrayCarro[index].cantidad++
          //element.producto.cantidad++
          encontrado = false

        }
      })
    }

    if (encontrado) {
      let pedido = Object.create(Carro)
      pedido.producto = detalleProducto
      pedido.cantidad = 1
      arrayCarro.push(pedido)
    }
    setCarro(arrayCarro)
    ContProductos(true)
    console.log(arrayCarro)
  }

  const EliminarDelCarro = () => {
    //Vaciado de datos
    carro.forEach(elementCarro => {
      if (arrayCarro[0] === undefined) {
        arrayCarro[0] = elementCarro
      } else {
        arrayCarro.push(elementCarro)
      }

    })

    if (carro[0] === undefined) {
      return
    }

    //Buscar el producto a eliminar
    if (arrayCarro[0] != undefined) {
      arrayCarro.forEach((element, index) => {
        console.log(arrayCarro)
        if (element.producto.id === detalleProducto.id) {
          if (element.cantidad > 1) {
            element.cantidad--
            console.log(element.cantidad)
            ContProductos(false)
          } else if (element.cantidad === 1) {
            //element.slice(index,index+1)
            ContProductos(false)
            arrayCarro.splice(index, 1)
          }
        }
      })
    }
    setCarro(arrayCarro)
  }

  const ConfirmarCarro = () => {
    if (carroAgregado) {
      navigation.navigate("resumen")
    } else {
      setCarroAgregado(true)
      navigation.navigate("resumen")
    }
  }

  //Contador cantidad de productos
  const ContProductos = (accion) => {
    let arrayTemp = []
    productosContext.forEach(element => {
      if (arrayTemp[0] === undefined) {
        arrayTemp[0] = element
      } else {
        arrayTemp.push(element)
      }
    })

    if (accion) {
      arrayTemp.forEach((categoria) => {
        categoria.data.forEach((productoCategoria) => {
          if (detalleProducto.id === productoCategoria.id) {
            productoCategoria.cant++
            setContadorProducto(productoCategoria.cant)
          }
        })
      })
    } else {
      arrayTemp.forEach((categoria) => {
        categoria.data.forEach((productoCategoria) => {
          if (detalleProducto.id === productoCategoria.id) {
            productoCategoria.cant--
            setContadorProducto(productoCategoria.cant)
          }
        })
      })
    }

    setArrayProductos(arrayTemp)
    setProductosContext(arrayTemp)
  }

  const DetalleProducto = (producto) => {
    setDetalleProducto(producto)
    setContadorProducto(producto.cant)
    setModalVisible(true)
  }

  const Item = ({ title }) => (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => DetalleProducto(title)}>
        <View style={styles.parent}>
          <Image source={{ uri: title.urlImagen }}
            style={styles.imageMenu} />
          <View style={styles.viewContenedor}>
            <Text style={styles.textSection}>{title.nombre}</Text>
            <Text style={styles.textPrecio}>Precio: {title.precio}</Text>
          </View>
        </View>
        <Divider bold={true} />
      </TouchableOpacity>
    </View>
  )

  const ocultarModal = () => setModalVisible(false);

  return (

    <View centerContent style={styles.viewBody}>
      {cargando == true && productosContext[0] != undefined ?
        (<View>
          <ActivityIndicator style={styles.activityIndicator} size="large"/>
        </View>)
        :
        (<View>

          <SectionList
            style={styles.sectionList}
            sections={productosContext}
            keyExtractor={(item, index) => item + index}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.header}>
              <Text style={styles.textHeader}>{title}</Text>
              </View>
            )}
            renderItem={({ item }) => <Item title={item} />}
            stickySectionHeadersEnabled
          />
          <Button
            mode="contained"
            style={styles.buttonPaperModal}
            onPress={() => {
              ConfirmarCarro();
            }}>
            Siguiente
          </Button>
          <Portal>
            <Dialog visible={modalVisible} onDismiss={ocultarModal}>
              <Dialog.Content>
                {modalVisible == false ? (<View><Text>Cargando</Text><ActivityIndicator /></View>) :
                  (<View style={styles.viewModal}>
                    <Text style={styles.textTitle}>{detalleProducto.nombre}</Text>
                    <Image source={{ uri: detalleProducto.urlImagen }}
                      style={styles.image} />
                    <Text style={styles.textCont}>Descripción:</Text>
                    <Text style={styles.textCont}>{detalleProducto.descripcion}</Text>
                    <Text style={styles.textCont}>Precio: {detalleProducto.precio}</Text>
                    <View style={styles.parentModal}>
                      <Button
                        mode="contained"
                        style={styles.buttonPaperModal}
                        onPress={() => {
                          EliminarDelCarro();
                        }}>
                        -
                      </Button>
                      <Text>{contadorProducto}</Text>
                      <Button
                        mode="contained"
                        style={styles.buttonPaperModal}
                        onPress={() => {
                          AgregarAlCarro();
                        }}>
                        +
                      </Button>
                    </View>
                    <Button
                        mode="contained"
                        style={styles.buttonPaperModal}
                        onPress={() => {
                          ocultarModal();
                        }}>
                        Cerrar
                      </Button>
                  </View>)}

              </Dialog.Content>
            </Dialog>
          </Portal>


        </View>)}
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexGrow: 0,
  },
  viewBody: {
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: "#442484"
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8
  },
  header: {
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems:'center',
    
  },
  textHeader: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24
  },
  textSection: {
    
    marginTop: 20,
    marginLeft: 20,
    fontSize: 20,
    alignSelf: 'flex-start'
  },
  textPrecio: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 14,
  },
  buttonAgregar: {
    flex: 0.25,
  },
  buttonEliminar: {
    flex: 0.25,
  },
  textCont: {
    marginTop: 3,
    marginBottom: 2,
    textAlign: 'center',
  },
  textTitle: {
    fontSize: 32,
  },
  sectionList: {
    backgroundColor: '#F2F2F2',
    minHeight: width.height - 120,
    maxHeight: width.height - 120,
  },
  buttonPaper: {
    marginTop: 3,
    marginBottom: 2,
    marginHorizontal: 30,
    backgroundColor: '#58ACFA'
  },
  buttonPaperModal: {
    marginTop: 10,
    marginBottom: 0,
    marginHorizontal: 15,
    maxHeight: 40,
    backgroundColor: '#58ACFA',
  },
  parent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  parentModal: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
  },
  divider: {
    marginTop: 8,
  },
  imageMenu: {
    
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 8,
    width: 100,
    height: 100,
    backgroundColor: '#859a9b',
    borderRadius: 20,
  },
  image: {
    width: 180,
    height: 180,
    backgroundColor: '#859a9b',
    marginTop: 8,
    borderRadius: 20,

  },
  viewModal: {
    justifyContent: "center",
    alignItems: 'center',
  },
  activityIndicator: {
    marginTop: width.height/3,
    
  },
  textRelleno: {
    flex:0.2,
    alignSelf: 'flex-end',
  },
  touchable: {
    flex:1
  },
  viewContenedor: {
    flex: 1,
  },
})