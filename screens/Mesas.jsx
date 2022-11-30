import { StyleSheet, Text, View, ActivityIndicator, FlatList, Dimensions } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import DropDownPicker from 'react-native-dropdown-picker'
import { TextInput, Divider, Portal, Dialog, Button } from 'react-native-paper';

import RestaurantContext from '../src/components/RestaurantContext'
import { SafeAreaView } from 'react-native-safe-area-context'

const width = Dimensions.get('window')

export default function Mesas() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  //Url usadas
  const baseUrl = 'http://10.0.2.2:8000'
  const url = `${baseUrl}/api/mesasActivos`

  //UseContext
  const { mesa, setMesa } = useContext(RestaurantContext)

  //UseState
  const [array, setArray] = useState()
  const [cargando, setCargando] = useState(true)
  const [abrirDrop, setAbrirDrop] = useState(false);
  const [valorDrop, setValorDrop] = useState(null);
  const [modalVisible, setModalVisible] = useState(null);

  useEffect(() => {
    (async () => {
      await fetchMesas()
    })()
  }, [])

  //Llamado GET a api
  const fetchMesas = async () => {
    try {
      const response = await axios.get(url)
      setArray(response.data)
      setCargando(false)
    } catch (error) {
      console.log(error)
      console.log({ url })
    }
  }

  //Metodo que ingresa al useContext la mesa elegida
  const ElegirMesa = () => {
    if(valorDrop == null){
      setModalVisible(true)
      return
    } else{
      setMesa(valorDrop)
      navigation.navigate("menu")
    }
  }

  const ocultarModal = () => setModalVisible(false);

  return (
    <View centerContent style={styles.viewBody}>
      {cargando ? (<View><Text>Cargando</Text><ActivityIndicator /></View>) :
        (<View>
          <Text style={styles.text}>Seleccione la mesa en la que se encuentra</Text>
          <DropDownPicker
            schema={{
              label: 'numMesa',
              value: 'id'
            }}
            placeholder="Seleccione su mesa"
            open={abrirDrop}
            value={valorDrop}
            items={array}
            setOpen={setAbrirDrop}
            setValue={setValorDrop}
            setItems={setArray}
          />
          <Button
            mode="contained"
            style={styles.buttonPaper}
            onPress={() => {
              ElegirMesa();
            }}>
            Aceptar
          </Button>
          <Portal>
        <Dialog visible={modalVisible} onDismiss={ocultarModal}>
          <Dialog.Content>
            <Text>Debe seleccionar una mesa</Text>
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
        </View>)}
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    marginHorizontal: 30
  },
  button: {
    backgroundColor: "#442484",
    paddingTop: 10
  },
  text: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 15,
  },
  buttonPaper: {
    marginTop: 10,
    marginBottom: 0,
    marginHorizontal: 30,
    backgroundColor: '#58ACFA'
  },
})