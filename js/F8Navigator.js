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
 * @providesModule F8Navigator
 * @flow
 */

'use strict'

import React, { Component } from 'react'

import {
  Platform, BackAndroid, Navigator, StyleSheet
} from 'react-native'

import { connect } from 'react-redux'


import FilterScreen from './filter/FilterScreen'
import LoginModal from './login/LoginModal'
import RatingScreen from './rating/RatingScreen'

import F8TabsView from './tabs/F8TabsView'
import FriendsScheduleView from './tabs/schedule/FriendsScheduleView'
import SessionsCarousel from './tabs/schedule/SessionsCarousel'
import SharingSettingsModal from './tabs/schedule/SharingSettingsModal'
import SharingSettingsScreen from './tabs/schedule/SharingSettingsScreen'
import ThirdPartyNotices from './tabs/info/ThirdPartyNotices'

import { switchTab } from './actions'

console.log(32123213, Navigator)


class F8Navigator extends Component {
  static childContextTypes = {
    addBackButtonListener: React.PropTypes.func,
    removeBackButtonListener: React.PropTypes.func,
  }

  _handlers: Array<() => boolean>

  constructor (...args) {
    super(...args)

    ;(this: any).handleBackButton = this.handleBackButton.bind(this)
    ;(this: any).addBackButtonListener = this.addBackButtonListener.bind(this)
    ;(this: any).removeBackButtonListener = this.removeBackButtonListener.bind(this)

    this._handlers = []
  }

  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton)
  }

  componentWillUnmount () {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton)
  }

  // it looks like this method is never
  getChildContext () {
    return {
      addBackButtonListener: this.addBackButtonListener,
      removeBackButtonListener: this.removeBackButtonListener,
    }
  }

  addBackButtonListener (listener) {
    this._handlers.push(listener)
  }

  removeBackButtonListener (listener) {
    this._handlers = this._handlers.filter((handler) => handler !== listener)
  }

  handleBackButton () {
    for (let i = this._handlers.length - 1; i >= 0; i--) {
      if (this._handlers[i]()) {
        return true
      }
    }

    const { navigator } = this.refs
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop()
      return true
    }

    if (this.props.tab !== 'schedule') {
      this.props.dispatch(switchTab('schedule'))
      return true
    }
    return false
  }

  render () {

    return (
      <Navigator
        ref="navigator"
        style={styles.container}
        configureScene={(route) => {
          if ('android' === Platform.OS) {
            return Navigator.SceneConfigs.FloatFromBottomAndroid
          }
          // TODO: Proper scene support
          if (route.shareSettings || route.friend) {
            return Navigator.SceneConfigs.FloatFromRight
          }
          else {
            return Navigator.SceneConfigs.FloatFromBottom
          }
        }}
        initialRoute={{}}
        renderScene={ renderScene }
      />
    )
  }
}
//
//


//
// function handleBackButton (handlers: Array<() => boolean>): boolean {
//   return () => {
//     for (let i = handlers.length - 1; i >= 0; i--) {
//       if (handlers[i]()) {
//         return true
//       }
//     }
//
//     const { navigator } = this.refs
//     if (navigator && navigator.getCurrentRoutes().length > 1) {
//       navigator.pop()
//       return true
//     }
//
//     if (this.props.tab !== 'schedule') {
//       this.props.dispatch(switchTab('schedule'))
//       return true
//     }
//     return false
//
//   }
//
// }

function renderScene (route, navigator) {
  if (route.allSessions) {
    return (
      <SessionsCarousel
        {...route}
        navigator={navigator}
      />
    )
  }
  if (route.session) {
    return (
      <SessionsCarousel
        session={route.session}
        navigator={navigator}
      />
    )
  }
  if (route.filter) {
    return (
      <FilterScreen navigator={navigator} />
    )
  }
  if (route.friend) {
    return (
      <FriendsScheduleView
        friend={route.friend}
        navigator={navigator}
      />
    )
  }
  if (route.login) {
    return (
      <LoginModal
        navigator={navigator}
        onLogin={route.callback}
      />
    )
  }
  if (route.share) {
    return (
      <SharingSettingsModal navigator={navigator} />
    )
  }
  if (route.shareSettings) {
    return <SharingSettingsScreen navigator={navigator} />
  }
  if (route.rate) {
    return <RatingScreen navigator={navigator} surveys={route.surveys} />
  }
  if (route.notices) {
    return <ThirdPartyNotices navigator={navigator} />
  }
  return <F8TabsView navigator={navigator} />
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
})

function select (store) {
  return {
    tab: store.navigation.tab,
    isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
  }
}

export default connect(select)(F8Navigator)
