// import * as rn from 'react-native-web/src'

// console.log('243234', rn)

import React from 'react'
import { View } from 'react-native'

import './UIManager'

export * from 'react-native-web/src'

export * from './Navigator'

export let StatusBar = () => <View />
export let ToolbarAndroid = () => <View />

StatusBar.currentHeight = 0

// export * from './UIManager'
