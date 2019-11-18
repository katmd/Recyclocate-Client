import React from 'react'
import {Provider} from 'react-redux'
import store from './client/store'
// import { StyleSheet, Text, View, Image } from 'react-native';
import MapScreen from './views/map-screen'

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'skyblue',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1200px-The_Earth_seen_from_Apollo_17.jpg'}} style={{width: 200, height: 200}} />
    //   <Text>Hello Worlolold!!!</Text>
    // </View>
    <Provider store={store}>
      <MapScreen />
    </Provider>
  )
}
