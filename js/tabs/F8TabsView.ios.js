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
import { Navigator, TabBarIOS } from 'react-native'
import TabBarItemIOS from 'react-native/Libraries/Components/TabBarIOS/TabBarItemIOS'

import { connect } from 'react-redux'

import F8InfoView from './info/F8InfoView'
import F8MapView from './maps/F8MapView'

import F8NotificationsView from './notifications/F8NotificationsView'
import unseenNotificationsCount from './notifications/unseenNotificationsCount'

import GeneralScheduleView from './schedule/GeneralScheduleView'
import MyScheduleView from './schedule/MyScheduleView'

import { switchTab } from '../actions'
import * as F8Colors from '../common/F8Colors'

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

import type { Tab, Day } from '../reducers/navigation'


class F8TabsView extends Component {
  props: {
    tab: Tab,
    day: Day,
    onTabSelect: (tab: Tab) => void,
    navigator: Navigator,
  }

  onTabSelect (tab: Tab) {
    if (this.props.tab !== tab) {
      this.props.onTabSelect(tab)
    }
  }

  render () {
    var scheduleIcon = this.props.day === 1
      ? scheduleIcon1Img
      : scheduleIcon2Img
    var scheduleIconSelected = this.props.day === 1
      ? scheduleIcon1ActiveImg
      : scheduleIcon2ActiveImg

    return (
      <TabBarIOS tintColor={F8Colors.darkText}>
        <TabBarItemIOS
          title="Schedule"
          selected={this.props.tab === 'schedule'}
          onPress={this.onTabSelect.bind(this, 'schedule')}
          icon={scheduleIcon}
          selectedIcon={scheduleIconSelected}>
          <GeneralScheduleView
            navigator={this.props.navigator}
          />
        </TabBarItemIOS>
        <TabBarItemIOS
          title="My F8"
          selected={this.props.tab === 'my-schedule'}
          onPress={this.onTabSelect.bind(this, 'my-schedule')}
          icon={myScheduleIconImg}
          selectedIcon={myScheduleIconActiveImg}>
          <MyScheduleView
            navigator={this.props.navigator}
            onJumpToSchedule={() => this.props.onTabSelect('schedule')}
          />
        </TabBarItemIOS>
        <TabBarItemIOS
          title="Maps"
          selected={this.props.tab === 'map'}
          onPress={this.onTabSelect.bind(this, 'map')}
          icon={mapsIconImg}
          selectedIcon={mapsIconActiveImg}>
          <F8MapView />
        </TabBarItemIOS>
        <TabBarItemIOS
          title="Notifications"
          selected={this.props.tab === 'notifications'}
          onPress={this.onTabSelect.bind(this, 'notifications')}
          badge={this.props.notificationsBadge || null}
          icon={ notificationsIconImg }
          selectedIcon={ notificationsIconActiveImg }>
          <F8NotificationsView navigator={this.props.navigator} />
        </TabBarItemIOS>
        <TabBarItemIOS
          title="Info"
          selected={this.props.tab === 'info'}
          onPress={this.onTabSelect.bind(this, 'info')}
          icon={ infoIconImg }
          selectedIcon={ infoIconActiveImg }>
          <F8InfoView navigator={this.props.navigator} />
        </TabBarItemIOS>
      </TabBarIOS>
    )
  }

}

function select(store) {
  return {
    tab: store.navigation.tab,
    day: store.navigation.day,
    notificationsBadge: unseenNotificationsCount(store) + store.surveys.length,
  }
}

function actions(dispatch) {
  return {
    onTabSelect: (tab) => dispatch(switchTab(tab)),
  }
}

export default connect(select, actions)(F8TabsView)
