/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


import React, { Component }  from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native'

console.log('****!**')

import setup from './js/setup.web'

// import app from './app'


// const initProps = {
//   some: 'init state'
// }

// export default class AppWrapper extends Component {
//   render () {
//     return setup({ ...this.props, ...initProps })
//   }
// }

// console.log('4334434334')

setTimeout(() => {
  // TODO: wrap this logic on DOMready event

  AppRegistry.registerComponent('alpha', setup)


  AppRegistry.runApplication('alpha', {
    rootTag: document.getElementById('react-root')
  })

}, 100)


/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */




// function msg (props) {
//   console.log('00dsss---d0', props, styles)
//   return (
//     <View style={styles.container}>
//       <Text style={styles.welcome}>
//         Welcome to React Native!
//       </Text>
//       <Text style={styles.instructions}>
//         To get started, edit index.ios.js
//       </Text>
//       <Text style={styles.instructions}>
//         Press Cmd+R to reload,{'\n'}
//         Cmd+D or shake for dev menu
//       </Text>
//     </View>
//   )
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// })
