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

import { Platform, VibrationIOS } from 'react-native'

import { updateInstallation } from './installation'
import { loadNotifications } from './parse'
import { loadSurveys } from './surveys'
import { switchTab } from './navigation'

import type { Action, ThunkAction } from './types'

type PushNotification = {
  foreground: boolean,
  message: string,
  // react-native-push-notification library sends Object as data
  // on iOS and JSON string on android
  // TODO: Send PR to remove this inconsistency
  data: string | Object,
};

function normalizeData(s: string | Object): Object {
  if (s && typeof s === 'object') {
    return s
  }
  try {
    return JSON.parse(s)
  } catch (e) {
    return {}
  }
}

export async function storeDeviceToken(deviceToken: string): Promise<Action> {
  console.log('Got device token', deviceToken)
  const pushType = 'android' === Platform.OS ? 'gcm' : undefined
  await updateInstallation({
    pushType,
    deviceToken,
    deviceTokenLastModified: Date.now(),
  })
  return {
    type: 'REGISTERED_PUSH_NOTIFICATIONS',
  }
}

export function turnOnPushNotifications(): Action {
  return {
    type: 'TURNED_ON_PUSH_NOTIFICATIONS',
  }
}

export function skipPushNotifications(): Action {
  return {
    type: 'SKIPPED_PUSH_NOTIFICATIONS',
  }
}

export function receivePushNotification(notification: PushNotification): ThunkAction {
  return (dispatch) => {
    const {foreground, message } = notification
    const data = normalizeData(notification.data)

    if (!foreground) {
      dispatch(switchTab('notifications'))
    }

    if (foreground) {
      dispatch(loadNotifications())
      dispatch(loadSurveys())

      if ('ios' === Platform.OS) {
        VibrationIOS.vibrate()
      }
    }

    if (data.e /* ephemeral */) {
      return
    }

    const timestamp = new Date().getTime()
    dispatch({
      type: 'RECEIVED_PUSH_NOTIFICATION',
      notification: {
        text: message,
        url: data.url,
        time: timestamp,
      },
    })
  }
}

export function markAllNotificationsAsSeen(): Action {
  return {
    type: 'SEEN_ALL_NOTIFICATIONS',
  }
}
