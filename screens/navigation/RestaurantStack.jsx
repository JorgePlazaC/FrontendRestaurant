import { Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Mesas from '../Mesas'
import Menu from '../Menu'
import Resumen from '../Resumen'
import Espera from '../Espera'

import { NavigationContainer } from '@react-navigation/native'

const Stack = createStackNavigator()

export default function RestaurantStack() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="mesas"
                component={Mesas}
                options={{title:"Elija una mesa"}}
            />
            <Stack.Screen
                name="menu"
                component={Menu}
                options={{title:"Menú"}}
            />
            <Stack.Screen
                name="resumen"
                component={Resumen}
                options={{title:"Resumen"}}
            />
            <Stack.Screen
                name="espera"
                component={Espera}
                options={{title:"Espera",headerLeft:null}}
            />
        </Stack.Navigator>
    </NavigationContainer>

  )
}
