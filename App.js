import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import RestaurantStack from './screens/navigation/RestaurantStack'
import { Provider as PaperProvider } from 'react-native-paper';

import { RestaurantProvider } from './src/components/RestaurantContext'

export default function App() {
  return (
    
    <PaperProvider>
    <RestaurantProvider>
      <RestaurantStack/>
    </RestaurantProvider>
    </PaperProvider>
    
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
