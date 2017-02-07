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
import { Navigator } from 'react-native'
import { connect } from 'react-redux'

import { createSelector } from 'reselect'


import EmptySchedule from './EmptySchedule'
import { bySchedule } from './filterSessions'
import ScheduleListView from './ScheduleListView'

import ProfilePicture from '../../common/ProfilePicture'
import ListContainer from '../../common/ListContainer'

import type {Session} from '../../reducers/sessions'
import type {FriendsSchedule} from '../../reducers/friendsSchedules'

import backWhiteImg from '../../common/img/back_white.png'
import scheduleBackgroundImg from './img/schedule-background.png'

type Props = {
  sessions: Array<Session>,
  friend: FriendsSchedule,
  navigator: Navigator,
}

class FriendsScheduleView extends Component {
  props: Props

  constructor (props) {
    super(props)
    ;(this: any).renderEmptyList = this.renderEmptyList.bind(this)
  }

  render () {
    const backItem = {
      icon: backWhiteImg,
      onPress: () => this.props.navigator.pop(),
    }

    const firstName = this.props.friend.name.split(' ')[0]

    return (
      <ListContainer
        title={`${firstName}'s Schedule`}
        parallaxContent={<ProfilePicture userID={this.props.friend.id} size={100} />}
        backgroundImage={ scheduleBackgroundImg }
        backgroundColor={'#5597B8'}
        selectedSectionColor="#51CDDA"
        leftItem={backItem}>
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
  }

  renderEmptyList (day) {
    return (
      <EmptySchedule
        title="Nothing to show."
        text={`${this.props.friend.name} has not added any sessions for day ${day}`}
      />
    )
  }
}

const data = createSelector(
  (store) => store.sessions,
  (store, props) => props.friend.schedule,
  (sessions, schedule) => bySchedule(sessions, schedule),
)

function select (store, props) {
  return {
    sessions: data(store, props),
  }
}

export default connect(select)(FriendsScheduleView)
