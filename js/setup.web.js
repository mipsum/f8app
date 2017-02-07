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
// import {
//   StyleSheet,
//   Text,
//   View
// } from 'react-native'

import F8App from './F8App'
import FacebookSDK from './FacebookSDK'
import Parse from 'parse/react-native'
import Relay from 'react-relay'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'

import { serverURL } from './app-env'


export default function setup (): ReactClass<{}> {

  console.disableYellowBox = true
  Parse.serverURL = `${serverURL}/parse`
  Parse.initialize('oss-f8-app-2016')

  FacebookSDK.init()
  Parse.FacebookUtils.init()



  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(`${serverURL}/graphql`, {
      fetchTimeout: 30000,
      retryDelays: [5000, 10000],
    })
  )

  class Root extends Component {
    state: {
      isLoading: boolean;
      store: any;
    }

    constructor () {
      super()
      console.log('76675576567')

      this.state = {
        isLoading: true,
        store: configureStore(() => this.setState({ isLoading: false })),
      }
    }
    render () {
      console.log(this.state.isLoading)

      // if (this.state.isLoading) {
      //   return null
      // }

      return (
        <Provider store={this.state.store}>
          <F8App />
        </Provider>
      )
    }
  }

  return Root
}

global.LOG = (...args) => {
  console.log('/------------------------------\\')
  console.log(...args)
  console.log('\\------------------------------/')
  return args[args.length - 1]
}
