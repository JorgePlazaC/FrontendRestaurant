import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

import RestaurantStack from './screens/navigation/RestaurantStack'
import { RestaurantProvider } from './src/components/RestaurantContext'

export default function App() {
  return (
    
    <RestaurantProvider>
      <RestaurantStack/>
    </RestaurantProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
