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
 * @providesModule F8TabsView
 */

'use strict'

import React, { Component } from 'react'
import { Image, Navigator, StyleSheet, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import F8InfoView from './info/F8InfoView'
import F8MapView from './maps/F8MapView'
import MenuItem from './MenuItem'

import F8NotificationsView from './notifications/F8NotificationsView'
import unseenNotificationsCount from './notifications/unseenNotificationsCount'

import GeneralScheduleView from './schedule/GeneralScheduleView'
import MyScheduleView from './schedule/MyScheduleView'

import * as F8Colors from '../common/F8Colors'
import F8DrawerLayout from '../common/F8DrawerLayout'
import { Text } from '../common/F8Text'
import LoginButton from '../common/LoginButton'
import ProfilePicture from '../common/ProfilePicture'

import { switchTab, logOutWithPrompt } from '../actions'

import scheduleIcon1Img from './schedule/img/schedule-icon-1.png'
import scheduleIcon2Img from './schedule/img/schedule-icon-2.png'

import scheduleIcon1ActiveImg from './schedule/img/schedule-icon-1-active.png'
import scheduleIcon2ActiveImg from './schedule/img/schedule-icon-2-active.png'

import myScheduleIconImg from './schedule/img/my-schedule-icon.png'
import myScheduleIconActiveImg from './schedule/img/my-schedule-icon-active.png'

import mapsIconImg from './maps/img/maps-icon.png'
import mapsIconActiveImg from './maps/img/maps-icon-active.png'

import notificationsIconImg from './notifications/img/notifications-icon.png'
import notificationsIconActiveImg from './notifications/img/notifications-icon-active.png'

import infoIconImg from './info/img/info-icon.png'
import infoIconActiveImg from './info/img/info-icon-active.png'

import logoImg from './img/logo.png'
import drawerHeaderImg from './img/drawer-header.png'

import type {Tab} from '../reducers/navigation'

class F8TabsView extends Component {
  props: {
    tab: Tab,
    onTabSelect: (tab: Tab) => void,
    navigator: Navigator,
  }

  constructor (props) {
    super(props)

    this.renderNavigationView = this.renderNavigationView.bind(this)
    this.openProfileSettings = this.openProfileSettings.bind(this)
    this.openDrawer = this.openDrawer.bind(this)
  }

  getChildContext () {
    return {
      openDrawer: this.openDrawer,
      hasUnreadNotifications: this.props.notificationsBadge > 0,
    }
  }

  openDrawer () {
    this.refs.drawer.openDrawer()
  }

  onTabSelect (tab: Tab) {
    if (this.props.tab !== tab) {
      this.props.onTabSelect(tab)
    }
    this.refs.drawer.closeDrawer()
  }

  openProfileSettings () {
    this.refs.drawer.closeDrawer()
    this.props.navigator.push({shareSettings: true})
  }

  renderNavigationView () {
    var scheduleIcon = this.props.day === 1
      ? scheduleIcon1Img
      : scheduleIcon2Img
    var scheduleIconSelected = this.props.day === 1
      ? scheduleIcon1ActiveImg
      : scheduleIcon2ActiveImg
    var accountItem, myF8Item, loginItem

    if (this.props.user.isLoggedIn) {
      var name = this.props.user.name || ''
      accountItem = (
        <View>
          <TouchableOpacity onPress={this.openProfileSettings}>
            <ProfilePicture userID={this.props.user.id} size={80} />
          </TouchableOpacity>
          <Text style={styles.name}>
            {name.toUpperCase()}
          </Text>
        </View>
      )
      myF8Item = (
        <MenuItem
          title="My F8"
          selected={this.props.tab === 'my-schedule'}
          onPress={this.onTabSelect.bind(this, 'my-schedule')}
          icon={ myScheduleIconImg }
          selectedIcon={ myScheduleIconActiveImg }
        />
      )
    } else {
      accountItem = (
        <View>
          <Image source={ logoImg } />
          <Text style={styles.name}>
            APRIL 12 + 13 / SAN FRANCISCO
          </Text>
        </View>
      )
      loginItem = (
        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>
            Log in to find your friends at F8.
          </Text>
          <LoginButton source="Drawer" />
        </View>
      )
    }
    return (
      <View style={styles.drawer}>
        <Image
          style={styles.header}
          source={ drawerHeaderImg }>
          {accountItem}
        </Image>
        <MenuItem
          title="Schedule"
          selected={this.props.tab === 'schedule'}
          onPress={this.onTabSelect.bind(this, 'schedule')}
          icon={scheduleIcon}
          selectedIcon={scheduleIconSelected}
        />
        {myF8Item}
        <MenuItem
          title="Maps"
          selected={this.props.tab === 'map'}
          onPress={this.onTabSelect.bind(this, 'map')}
          icon={ mapsIconImg }
          selectedIcon={ myScheduleIconActiveImg }
        />
        <MenuItem
          title="Notifications"
          selected={this.props.tab === 'notifications'}
          onPress={this.onTabSelect.bind(this, 'notifications')}
          badge={this.props.notificationsBadge}
          icon={ notificationsIconImg }
          selectedIcon={ notificationsIconActiveImg }
        />
        <MenuItem
          title="Info"
          selected={this.props.tab === 'info'}
          onPress={this.onTabSelect.bind(this, 'info')}
          icon={ infoIconImg }
          selectedIcon={ infoIconActiveImg }
        />
        {loginItem}
      </View>
    )
  }

  renderContent () {
    switch (this.props.tab) {
      case 'schedule':
        return (
          <GeneralScheduleView
            navigator={this.props.navigator}
          />
        )

      case 'my-schedule':
        return (
          <MyScheduleView
            navigator={this.props.navigator}
            onJumpToSchedule={() => this.props.onTabSelect('schedule')}
          />
        )

      case 'map':
        return <F8MapView />

      case 'notifications':
        return <F8NotificationsView navigator={this.props.navigator} />

      case 'info':
        return <F8InfoView navigator={this.props.navigator} />
    }
    throw new Error(`Unknown tab ${this.props.tab}`)
  }

  render () {
    return (
      <F8DrawerLayout
        ref="drawer"
        drawerWidth={290}
        drawerPosition="left"
        renderNavigationView={this.renderNavigationView}>
        <View style={styles.content} key={this.props.tab}>
          {this.renderContent()}
        </View>
      </F8DrawerLayout>
    )
  }
}

F8TabsView.childContextTypes = {
  openDrawer: React.PropTypes.func,
  hasUnreadNotifications: React.PropTypes.bool,
}

function select (store) {
  return {
    tab: store.navigation.tab,
    day: store.navigation.day,
    user: store.user,
    notificationsBadge: unseenNotificationsCount(store) + store.surveys.length,
  }
}

function actions (dispatch) {
  return {
    onTabSelect: (tab) => dispatch(switchTab(tab)),
    logOut: () => dispatch(logOutWithPrompt()),
  }
}

var styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    justifyContent: 'flex-end',
  },
  name: {
    marginTop: 10,
    color: 'white',
    fontSize: 12,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  loginText: {
    fontSize: 12,
    color: F8Colors.lightText,
    textAlign: 'center',
    marginBottom: 10,
  },
})

export default connect(select, actions)(F8TabsView)
