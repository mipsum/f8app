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
 * @providesModule F8InfoView
 * @flow
 */

'use strict'

import React, { Component } from 'react'
import { View } from 'react-native'

import Relay from 'react-relay'

import CommonQuestions from './CommonQuestions'
import LinksList from './LinksList'
import ListContainer from '../../common/ListContainer'
import PureListView from '../../common/PureListView'
import WiFiDetails from './WiFiDetails'

import infoBackgroundImg from './img/info-background.png'

const POLICIES_LINKS = [{
  title: 'Terms of Service',
  url: 'https://m.facebook.com/terms?_rdr',
}, {
  title: 'Data Policy',
  url: 'https://m.facebook.com/policies?_rdr',
}, {
  title: 'Code of Conduct',
  url: 'https://www.fbf8.com/code-of-conduct',
}]



function _InfoList ({ viewer: { config, faqs, pages }, ...props }) {
  console.log('cfg', config)
  console.log('faq', faqs)
  console.log('pag', pages)

  return (
    <PureListView
      renderEmptyList={() => (
        <View>
          <WiFiDetails
            network={ config.wifiNetwork }
            password={ config.wifiPassword }
          />
          <CommonQuestions faqs={ faqs } />
          <LinksList title="Facebook pages" links={ pages } />
          <LinksList title="Facebook policies" links={POLICIES_LINKS} />
        </View>
      )}
      {...(props: any /* flow can't guarantee the shape of props */)}
    />
  )
}

let InfoList = Relay.createContainer(_InfoList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        config {
          wifiNetwork
          wifiPassword
        }
        faqs {
          question
          answer
        }
        pages {
          title
          url
          logo
        }
      }
    `,
  },
})

export default function F8InfoView () {
  return (
    <ListContainer
      title="Information"
      backgroundImage={ infoBackgroundImg }
      backgroundColor={ '#47BFBF' }>
      <InfoList />
    </ListContainer>
  )
}
