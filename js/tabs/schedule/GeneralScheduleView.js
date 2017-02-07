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
import { Platform, Navigator } from 'react-native'
import { connect } from 'react-redux'

// TODO: Move from reselect to memoize?
import { createSelector } from 'reselect'

import EmptySchedule from './EmptySchedule'
import FilterHeader from './FilterHeader'
import { byTopics } from './filterSessions'

import ScheduleListView from './ScheduleListView'

import FilterScreen from '../../filter/FilterScreen'

import F8DrawerLayout from '../../common/F8DrawerLayout'
import ListContainer from '../../common/ListContainer'


import { switchDay } from '../../actions'

import filterImg from '../../common/img/filter.png'
import scheduleBackgroundImg from './img/schedule-background.png'

import type {Session} from '../../reducers/sessions'

const data = createSelector(
  (store) => store.sessions,
  (store) => store.filter,
  (sessions, filter) => byTopics(sessions, filter),
)

type Props = {
  filter: any,
  day: number,
  sessions: Array<Session>,
  navigator: Navigator,
  logOut: () => void,
  switchDay: (day: number) => void,
}

class GeneralScheduleView extends Component {
  props: Props
  _drawer: ?F8DrawerLayout

  constructor (props) {
    super(props)

    ;(this: any).renderEmptyList = this.renderEmptyList.bind(this)
    ;(this: any).switchDay = this.switchDay.bind(this)
    ;(this: any).openFilterScreen = this.openFilterScreen.bind(this)
    ;(this: any).renderNavigationView = this.renderNavigationView.bind(this)
  }

  render () {
    const filterItem = {
      icon: filterImg,
      title: 'Filter',
      onPress: this.openFilterScreen,
    };

    const filterHeader = Object.keys(this.props.filter).length > 0
      ? <FilterHeader />
      : null

    const content = (
      <ListContainer
        title="Schedule"
        selectedSegment={this.props.day - 1}
        onSegmentChange={this.switchDay}
        backgroundImage={ scheduleBackgroundImg }
        backgroundColor="#5597B8"
        selectedSectionColor="#51CDDA"
        stickyHeader={filterHeader}
        rightItem={filterItem}>
        <ScheduleListView
          title="Day 1"
          day={1}
          sessions={this.props.sessions}
          renderEmptyList={this.renderEmptyList}
          navigator={this.props.navigator}
        />
        <ScheduleListView
          title="Day 2"
          day={2}
          sessions={this.props.sessions}
          renderEmptyList={this.renderEmptyList}
          navigator={this.props.navigator}
        />
      </ListContainer>
    )

    if ('ios' === Platform.OS) {
      return content
    }
    return (
      <F8DrawerLayout
        ref={(drawer) => { this._drawer = drawer }}
        drawerWidth={300}
        drawerPosition="right"
        renderNavigationView={this.renderNavigationView}>
        {content}
      </F8DrawerLayout>
    )
  }

  renderNavigationView () {
    return <FilterScreen onClose={() => this._drawer && this._drawer.closeDrawer()} />
  }

  renderEmptyList (day: number) {
    return (
      <EmptySchedule
        title={`No sessions on day ${day} match the filter`}
        text="Check the schedule for the other day or remove the filter."
      />
    )
  }

  openFilterScreen () {
    if ('ios' === Platform.OS) {
      this.props.navigator.push({ filter: 123 })
    } else {
      this._drawer && this._drawer.openDrawer()
    }
  }

  switchDay (page) {
    this.props.switchDay(page + 1)
  }
}

function select (store) {
  return {
    day: store.navigation.day,
    filter: store.filter,
    sessions: data(store),
  }
}

function actions (dispatch) {
  return {
    switchDay: (day) => dispatch(switchDay(day)),
  }
}

export default connect(select, actions)(GeneralScheduleView)
