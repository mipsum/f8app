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
 * @providesModule F8Button
 * @flow
 */

'use strict'

import React, { Component } from 'react'
import {
  Image, StyleSheet, TouchableOpacity, View, Button, Platform
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'

import { lightText } from './F8Colors'
import { Text } from './F8Text'

export default class F8Button extends Component {
  props: {
    type: 'primary' | 'secondary' | 'bordered',
    icon?: number,
    caption: string,
    style?: any,
    onPress: () => mixed,
  }

  static defaultProps = {
    type: 'primary',
  }

  render () {    
    const caption = this.props.caption.toUpperCase()
    let icon
    if (this.props.icon) {
      icon = <Image source={this.props.icon} style={styles.icon} />
    }

    let button = 'web' === Platform.OS
      ? <Button
          activeOpacity={0.8}
          accessibilityTraits="button"
          onPress={this.props.onPress}
          title={caption}
          colors={['#6A6AD5', '#6F86D9']}
          style={[styles.button, styles.primaryButton]}>
          {icon}
          <Text style={[styles.caption, styles.primaryCaption]}>
            {caption}
          </Text>
        </Button>

        : (<LinearGradient
            start={{ x: 0.5, y: 1 }} end={{ x: 1, y: 1 }}
            colors={['#6A6AD5', '#6F86D9']}
            style={[styles.button, styles.primaryButton]}>
            {icon}
            <Text style={[styles.caption, styles.primaryCaption]}>
              {caption}
            </Text>
          </LinearGradient>)


    let content
    if ('primary' === this.props.type) {
      content = button
    }
    else {
      var border = 'bordered' === this.props.type && styles.border
      content = (
        <View style={[styles.button, border]}>
          {icon}
          <Text style={[styles.caption, styles.secondaryCaption]}>
            {caption}
          </Text>
        </View>
      )
    }

    if ('web' === Platform.OS) {
      return (<View
        style={[styles.container, this.props.style]}>
        {content}
      </View>)
    }



    return (
      <TouchableOpacity
        accessibilityTraits="button"
        onPress={this.props.onPress}
        activeOpacity={0.8}
        style={[styles.container, this.props.style]}>
        {content}
      </TouchableOpacity>
    )
  }
}

const HEIGHT = 50

var styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    // borderRadius: HEIGHT / 2,
    // borderWidth: 1 / PixelRatio.get(),
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  border: {
    borderWidth: 1,
    borderColor: lightText,
    borderRadius: HEIGHT / 2,
  },
  primaryButton: {
    borderRadius: HEIGHT / 2,
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 12,
  },
  caption: {
    letterSpacing: 1,
    fontSize: 12,
  },
  primaryCaption: {
    color: 'white',
  },
  secondaryCaption: {
    color: lightText,
  }
})
