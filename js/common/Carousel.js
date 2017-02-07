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
import ViewPager from './ViewPager'
import createStyleSheet from './F8StyleSheet'

type Props = {
  count: number,
  selectedIndex: number,
  onSelectedIndexChange?: (index: number) => void,
  renderCard: (index: number) => ReactElement,
  style?: any,
}

export default class Carousel extends Component {
  props: Props

  render() {
    let cards = []
    const {count, selectedIndex, renderCard} = this.props

    for (let i = 0; i < count; i++) {
      let content = null
      if (Math.abs(i - selectedIndex) < 2) {
        content = renderCard(i)
      }
      cards.push(content)
    }
    return (
      <ViewPager style={styles.carousel} {...this.props} bounces={true}>
        {cards}
      </ViewPager>
    )
  }
}

var styles = createStyleSheet({
  carousel: {
    ios: {
      margin: 10,
      overflow: 'visible',
      backgroundColor: 'black',
    },
  }
})
