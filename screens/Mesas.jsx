import { StyleSheet, Text, View, Button, ActivityIndicator, FlatList, Dimensions } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

import RestaurantContext from '../src/components/RestaurantContext'
import { SafeAreaView } from 'react-native-safe-area-context'

const width = Dimensions.get('window')

export default function Mesas() {

  //Asignacion a constante de UseNavigation
  const navigation = useNavigation()

  //Url usadas
  const baseUrl = 'http://10.0.2.2:8000'
  const url = `${baseUrl}/api/mesas`

  //UseContext
  const { mesa, setMesa } = useContext(RestaurantContext)

  //UseState
  const [array, setArray] = useState()
  const [cargando, setCargando] = useState(true)

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
  const ElegirMesa = (mesaElegida) => {
    setMesa(mesaElegida)
    navigation.navigate("menu")
  }

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Button
        title={`Mesa ${title.numMesa}`}
        style={styles.button}
        onPress={() => { ElegirMesa(title) }}
      />
      <Text> </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item} />
  )

  return (
    <SafeAreaView>
      <View centerContent style={styles.viewBody}>
        {cargando ? (<View><Text>Cargando</Text><ActivityIndicator /></View>) :
          (<View>
            <FlatList
              style={styles.flatList}
              data={array}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </View>)}
      </View>
    </SafeAreaView>
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
  sectionList: {
    maxHeight: width.height - 150,
  }
})