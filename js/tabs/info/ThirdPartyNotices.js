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
import { StyleSheet, InteractionManager, View, WebView } from 'react-native'

import F8Header from '../../common/F8Header'
import backWhiteImg from '../../common/img/back_white.png'

export default class ThirdPartyNotices extends Component {
  render() {
    return (
      <View style={styles.container}>
        <F8Header
          title="Third Party Notices"
          style={styles.header}
          leftItem={{
            icon: backWhiteImg,
            title: 'Back',
            layout: 'icon',
            onPress: () => this.props.navigator.pop(),
          }}
        />
        <Loading>
          <WebView
            style={styles.webview}
            source={{uri: 'file:///android_res/raw/third_party_notices.html'}}
          />
        </Loading>
      </View>
    )
  }
}

class Loading extends Component {
  state = {
    loaded: false,
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => this.setState({loaded: true}))
  }

  render() {
    if (this.state.loaded) {
      return React.Children.only(this.props.children)
    }
    return null
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#47BFBF',
  },
  webview: {
    flex: 1,
  },
})
