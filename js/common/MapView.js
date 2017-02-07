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

import {
  Image, PixelRatio, View, InteractionManager, StyleSheet
} from 'react-native'

import type { Map } from '../reducers/maps'

export default class MapView extends Component {
  _isMounted: boolean

  props: {
    map: ?Map,
    style?: any,
  }

  state: {
    loaded: boolean,
  }

  constructor () {
    super()
    this.state = { loaded: false }
    this._isMounted = false
  }

  componentDidMount () {
    this._isMounted = true
    InteractionManager.runAfterInteractions(() => {
      this._isMounted && this.setState({ loaded: true })
    })
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    var image
    if (this.state.loaded) {
      image = (
        <Image
          style={styles.map}
          source={{ uri: urlForMap(this.props.map) }}
        />
      )
    }

    // LOG('MAP', this.props.map)
    return (
      <View style={[styles.container, this.props.style]}>
        {image}
      </View>
    )
  }
}

function urlForMap (map: ?Map): string {
  if (!map) {
    return ''
  }
  switch (PixelRatio.get()) {
    case 1: return map.x1url
    case 2: return map.x2url
    case 3: return map.x3url
  }
  return map.x3url
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 400,
  },
  map: {
    flex: 1,
    resizeMode: Image.resizeMode.contain,
  },
})
