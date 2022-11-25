import { StyleSheet, Text, View, Button, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import DropDownPicker from 'react-native-dropdown-picker'
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Modal } from 'react-native'
import { TextInput } from 'react-native'

const width = Dimensions.get('window')

export default function AdmProductos() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  //Url usadas
  const baseUrl = 'http://10.0.2.2:8000'
  const url = `${baseUrl}/api/productos`
  const urlCategorias = `${baseUrl}/api/categorias`
  const urlImagen = `${baseUrl}/api/imagens`

  //UseState
  const [arrayProductos, setArrayProductos] = useState([])
  const [arrayCategorias, setArrayCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalEdicionVisible, setEdicionModalVisible] = useState(false)
  const [modalBorrarVisible, setBorrarModalVisible] = useState(false)
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
      urlCategorias,
    ];
    try {
      await Promise.all(api.map(async (api) => await axios.get(api))).then(async ([{ data: productos }, { data: categorias }]) => {
        setArrayProductos(await productos)
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

      if (!data.isSuccess) {
        console.log(data)
        alert("Image upload failed!");
        return;
      }
      alert("Image Uploaded");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setImage(undefined);

    }
  };

  const EditarProducto = async () => {
    let urlEdicion = `${url}/${productosEdit.id}`
    try {
      const response = await axios.put(urlEdicion, { nombre: inputNombre,idCategoria:valorDrop, descripcion: inputDescripcion,precio:inputPrecio,stock:inputStock })
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const BorrarProducto = async () => {
    let urlBorrar = `${url}/${productosEdit.id}`
    try {
      const response = await axios.delete(urlBorrar)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const Metodos = async () => {
    await uploadImage()
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
    <View style={styles.item}>
      <Text style={styles.text}>{title.nombre}</Text>

      <TouchableOpacity style={styles.button} onPress={() => { ModalEdicion(title) }}>
        <Image style={styles.image} source={require("../src/images/editar.png")} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => { ModalBorrar(title) }}>
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
          data={arrayProductos
          }
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <Button
          style={styles.button}
          title="Agregar producto"
          onPress={() => { console.log(setModalVisible(true)) }}
        />
        <Modal visible={modalVisible} animationType={'slide'}>
          <View style={styles.modalBackGround}>
            <View style={styles.modalContainer}>
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
                style={styles.button}
                title="Confirmar"
                onPress={() => { Metodos() }}
              />
              <Button
                style={styles.button}
                title="Cancelar"
                onPress={() => { setModalVisible(false) }}
              />
            </View>
          </View>
        </Modal>

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
                onPress={() => { EditarProducto() }}
              />
              <Button
                style={styles.button}
                title="Cancelar"
                onPress={() => { setEdicionModalVisible(false) }}
              />
            </View>
          </View>
        </Modal>):(<View></View>)}

        
        <Modal visible={modalBorrarVisible} animationType={'slide'}>
          <View style={styles.modalBackGround}>
            <View style={styles.modalContainer}>
              <Text>¿Está seguro que desea eliminar la categoria?</Text>
              <Button
                style={styles.button}
                title="Sí"
                onPress={() => { BorrarProducto().finally(setBorrarModalVisible(false)) }}
              />
              <Button
                style={styles.button}
                title="Cancelar"
                onPress={() => { setBorrarModalVisible(false) }}
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