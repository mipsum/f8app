import React from 'react'

import { Button } from 'react-native'
export default (...props) =>
  <Button
    title={"LinearGradient"}
    onPress={()=>{console.log('LinearGradient Pressed')}}
    {...props}
  />
