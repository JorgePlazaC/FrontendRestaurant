import { Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Mesas from '../Mesas'
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
        </Stack.Navigator>
    </NavigationContainer>

  )
}
