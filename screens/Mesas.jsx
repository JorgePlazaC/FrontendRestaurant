import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native'
import React, {useState,useEffect,useContext} from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

import RestaurantContext from '../src/components/RestaurantContext'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Mesas() {

  const navigation = useNavigation()
  
  const baseUrl = 'http://10.0.2.2:8000'
  const url = `${baseUrl}/api/mesas`
  const {mesa, setMesa} = useContext(RestaurantContext)

  const [array , setArray] = useState(null)
  const [cargando , setCargando] = useState(true)


  useEffect(() => {
      (async () =>{
        await fetchMesas()
      })()
  }, [])


// Invoking get method to perform a GET request
const fetchMesas = async () => {
  try{
  const response = await axios.get(url)
  setArray(response.data)
  setCargando(false)
  }catch(error){
    
    console.log(error)
    console.log({url})
  }
  
}

const CargarMesas = () =>{

  if(cargando == false){
    console.log("Cargando mesas")
    return array.map((mesa,i) =>{
      const concatenacion = "Mesa "+mesa.numMesa
      return (
        <View key={i}>
          <Button
            title={concatenacion}
            style={styles.button}
            onPress={() =>{ElegirMesa(mesa.numMesa)}}
          />
          <Text> </Text>
        </View>
      )
    })
  }
}

const ElegirMesa = (mesaElegida) =>{
  setMesa(mesaElegida)
  navigation.navigate("menu")
}


  return (
    <SafeAreaView>
      <View centerContent style = {styles.viewBody}>
      {cargando ? (<View><Text>Cargando</Text><ActivityIndicator /></View>):(<View><Text>Mesas</Text>
      {CargarMesas()}  
      </View>)}
    </View>
    </SafeAreaView>
  )
} 


const styles = StyleSheet.create({
  viewBody:{
    marginHorizontal: 30
  },
    button:{
        backgroundColor: "#442484",
        paddingTop: 10
    }
})