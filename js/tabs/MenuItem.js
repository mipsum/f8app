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
import { Image, StyleSheet, View, Button, Platform } from 'react-native'

import * as F8Colors from '../common/F8Colors'
import { Text } from '../common/F8Text'
import F8Touchable from '../common/F8Touchable'


export default class MenuItem extends Component {
  props: {
    icon: number,
    selectedIcon: number,
    selected: boolean,
    title: string,
    badge: ?string,
    onPress: () => void,
  }

  render () {
    var icon = this.props.selected ? this.props.selectedIcon : this.props.icon
    var selectedTitleStyle = this.props.selected && styles.selectedTitle
    var badge
    if (this.props.badge) {
      badge = (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {this.props.badge}
          </Text>
        </View>
      )
    }

    if ('web' === Platform.OS) {
      return (
        <Button onPress={this.props.onPress}>
          <View style={styles.container}>
            <Image style={styles.icon} source={icon} />
            <Text style={[styles.title, selectedTitleStyle]}>
              {this.props.title}
            </Text>
            {badge}
          </View>
        </Button>
      )
    }

    return (
      <F8Touchable onPress={this.props.onPress}>
        <View style={styles.container}>
          <Image style={styles.icon} source={icon} />
          <Text style={[styles.title, selectedTitleStyle]}>
            {this.props.title}
          </Text>
          {badge}
        </View>
      </F8Touchable>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 20,
  },
  title: {
    flex: 1,
    fontSize: 17,
    color: F8Colors.lightText,
  },
  selectedTitle: {
    color: F8Colors.darkText,
  },
  badge: {
    backgroundColor: '#DC3883',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    color: 'white',
  },
})
