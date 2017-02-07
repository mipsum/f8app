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
 * @providesModule F8App
 * @flow
 */

'use strict'



import React, { Component } from 'react'
import {
  AppState, StyleSheet, View, StatusBar, Platform
} from 'react-native'

console.log('------', AppState, StyleSheet, View, StatusBar, Platform)

import { connect } from 'react-redux'
import CodePush from 'react-native-code-push'

import { isWeb } from './app-env'

import LoginScreen from './login/LoginScreen'
import PushNotificationsController from './PushNotificationsController'

import F8Navigator from './F8Navigator'

import {
  loadConfig,
  loadMaps,
  loadNotifications,
  loadSessions,
  loadFriendsSchedules,
  loadSurveys,
  updateInstallation,
} from './actions'


import { version } from './app-env.js'


class F8App extends Component {
  constructor () {
    super()
    this.handleAppStateChange = this.handleAppStateChange.bind(this)
  }

  componentDidMount () {
    AppState.addEventListener('change', this.handleAppStateChange)

    // TODO: Make this list smaller, we basically download the whole internet
    this.props.dispatch(loadNotifications())
    this.props.dispatch(loadMaps())
    this.props.dispatch(loadConfig())
    this.props.dispatch(loadSessions())
    this.props.dispatch(loadFriendsSchedules())
    this.props.dispatch(loadSurveys())

    updateInstallation({ version })
    codePushOnNextResume()
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange (appState) {
    if ('active' === appState) {
      this.props.dispatch(loadSessions())
      this.props.dispatch(loadNotifications())
      this.props.dispatch(loadSurveys())
      codePushOnNextResume()
    }
  }

  render () {
    if (!this.props.isLoggedIn) {
      return <LoginScreen />
    }

    return (
      <View style={styles.container}>
        <_StatusBar />
        <F8Navigator />
        <_PushNotificationsController />
      </View>
    )
  }
}

let _StatusBar = isWeb
  ? () => null
  : () =>
    <StatusBar
      translucent={true}
      backgroundColor="rgba(0, 0, 0, 0.2)"
      barStyle="light-content"
     />

let _PushNotificationsController = isWeb
  ? () => null
  : () => <PushNotificationsController />


function codePushOnNextResume (): void {
  if (__DEV__) { return }
  CodePush.sync({ installMode: CodePush.InstallMode.ON_NEXT_RESUME })
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

function select (store) {
  return {
    isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
  }
}

export default connect(select)(F8App)
