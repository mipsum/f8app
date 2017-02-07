/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 */
'use strict'

import React, { Component } from 'react'
import {
  Animated, Dimensions, Image, StatusBar, StyleSheet, View, TouchableOpacity,
  Platform
} from 'react-native'

import { connect } from 'react-redux'


import { darkText, lightText } from '../common/F8Colors'
import { Text } from '../common/F8Text'
import LoginButton from '../common/LoginButton'

import { isWeb } from '../app-env'

console.log('***$$$$$**', isWeb)

import { skipLogin } from '../actions'

// images
import loginBackgroundImg from './img/login-background.png'
import xImg from './img/x.png'
import devConfImg from './img/devconf-logo.png'


class LoginScreen extends Component {
  state = {
    anim: new Animated.Value(0),
  }

  componentDidMount () {
    Animated.timing(this.state.anim, { toValue: 3000, duration: 3000 }).start()
  }

  render () {
    let { anim } = this.state

    return (
      <Image
        style={ styles.container }
        source={ loginBackgroundImg }>
        <StatusBar />
        <TouchableOpacity
          accessibilityLabel="Skip login"
          accessibilityTraits="button"
          style={styles.skip}
          onPress={() => this.props.dispatch(skipLogin())}>
          <_SkipBtn anim={anim}/>
        </TouchableOpacity>
        <View style={styles.section}>
          <Animated.Image
            style={fadeIn(anim, 0)}
            source={ devConfImg }
          />
        </View>
        <View style={styles.section}>
          <Animated.Text style={[styles.h1, fadeIn(anim, 700, -20)]}>
            code to
          </Animated.Text>
          <Animated.Text style={[styles.h1, { marginTop: -30 }, fadeIn(anim, 700, 20)]}>
            connect
          </Animated.Text>
          <Animated.Text style={[styles.h2, fadeIn(anim, 1000, 10)]}>
            April 12 + 13 / Fort Mason Center
          </Animated.Text>
          <Animated.Text style={[styles.h3, fadeIn(anim, 1200, 10)]}>
            SAN FRANCISCO, CALIFORNIA
          </Animated.Text>
        </View>
        <Animated.View style={[styles.section, styles.last, fadeIn(anim, 2500, 20)]}>
          <Text style={styles.loginComment}>
            Use Facebook to find your friends at F8.
          </Text>
          <LoginButton source="First screen" />
        </Animated.View>
      </Image>
    )
  }
}


// let StatusBar = isWeb
//   ? () => null
//   : () => <StatusBar barStyle="default" />


let _SkipBtn = isWeb
  ? ({ anim }) =>
    <Animated.Text style={fadeIn(anim, 2800)} >
      {/* need to use better X btn */}
      <Text> {'X'} </Text>
    </Animated.Text>

  : ({ anim }) =>
    <Animated.Image style={fadeIn(anim, 2800)} source={ xImg } />


function fadeIn (anim, delay, from = 0) {
  return {
    opacity: anim.interpolate({
      inputRange: [delay, Math.min(delay + 500, 3000)],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    transform: [{
      translateY: anim.interpolate({
        inputRange: [delay, Math.min(delay + 500, 3000)],
        outputRange: [from, 0],
        extrapolate: 'clamp',
      }),
    }],
  }
}

const scale = Dimensions.get('window').width / 375

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 26,
    // Image's source contains explicit size, but we want
    // it to prefer flex: 1
    width: undefined,
    height: undefined,
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  last: {
    justifyContent: 'flex-end',
  },
  h1: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: Math.round(74 * scale),
    color: darkText,
    backgroundColor: 'transparent',
  },
  h2: {
    textAlign: 'center',
    fontSize: 17,
    color: darkText,
    marginVertical: 20,
  },
  h3: {
    fontSize: 12,
    textAlign: 'center',
    color: lightText,
    letterSpacing: 1,
  },
  loginComment: {
    marginBottom: 14,
    fontSize: 12,
    color: darkText,
    textAlign: 'center',
  },
  skip: {
    position: 'absolute',
    right: 0,
    top: 20,
    padding: 15,
  },
})

export default connect()(LoginScreen)
