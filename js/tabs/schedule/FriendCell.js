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
import { Image, StyleSheet, View, TouchableHighlight } from 'react-native'

import * as F8Colors from '../../common/F8Colors'
import { Text } from '../../common/F8Text'
import ProfilePicture from '../../common/ProfilePicture'

import disclosureImg from '../../common/img/disclosure.png'

import type { FriendsSchedule } from '../../reducers/friendsSchedules'

export default class FriendCell extends Component {
  props: {
    friend: FriendsSchedule,
    onPress: ?() => void,
  }

  render () {
    const {friend} = this.props
    const hasSchedule = friend.schedule && Object.keys(friend.schedule).length > 0
    const auxView = hasSchedule
      ? <Image source={ disclosureImg } />
      : <Text style={styles.private}>PRIVATE</Text>

    const cell = (
      <View style={styles.cell}>
        <ProfilePicture userID={friend.id} size={42} />
        <Text style={styles.name}>
          {friend.name}
        </Text>
        {auxView}
      </View>
    )

    if (!hasSchedule) {
      return cell
    }
    return (
      <TouchableHighlight underlayColor="#3C5EAE" onPress={this.props.onPress}>
        {cell}
      </TouchableHighlight>
    )
  }
}


var styles = StyleSheet.create({
  cell: {
    height: 60,
    paddingHorizontal: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontSize: 17,
    marginHorizontal: 10,
    color: F8Colors.darkText,
  },
  private: {
    color: F8Colors.lightText,
  }
})
