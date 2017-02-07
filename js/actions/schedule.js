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

import {
  Platform, InteractionManager, ActionSheetIOS, Alert
} from 'react-native'

import Parse from 'parse/react-native'
import { AppEventsLogger } from 'react-native-fbsdk'
import Share from 'react-native-share'

import { currentInstallation, updateInstallation } from './installation'

import type { ThunkAction, PromiseAction, Dispatch } from './types'
import type { Session } from '../reducers/sessions'

const Agenda = Parse.Object.extend('Agenda')

export function addToSchedule(id: string): ThunkAction {
  return (dispatch: Dispatch) => {
    if (Parse.User.current()) {
      Parse.User.current().relation('mySchedule').add(new Agenda({id}))
      Parse.User.current().save()
      currentInstallation().then((installation) => {
        installation.addUnique('channels', `session_${id}`)
        return installation.save()
      })
    }
    dispatch({
      type: 'SESSION_ADDED',
      id,
    })
  }
}

export function removeFromSchedule(id: string): ThunkAction {
  return (dispatch: Dispatch) => {
    if (Parse.User.current()) {
      Parse.User.current().relation('mySchedule').remove(new Agenda({id}))
      Parse.User.current().save()
      currentInstallation().then((installation) => {
        installation.remove('channels', `session_${id}`)
        return installation.save()
      })
    }
    dispatch({
      type: 'SESSION_REMOVED',
      id,
    })
  }
}

export function removeFromScheduleWithPrompt(session: Session): ThunkAction {
  return (dispatch) => {
    if ('ios' === Platform.OS) {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['Remove From Schedule', 'Cancel'],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      }, (buttonIndex) => {
        if (buttonIndex === 0) {
          dispatch(removeFromSchedule(session.id))
        }
      })
    } else {
      Alert.alert(
        'Remove From Your Schedule',
        `Would you like to remove "${session.title}" from your schedule?`,
        [
          {text: 'Cancel'},
          {
            text: 'Remove',
            onPress: () => dispatch(removeFromSchedule(session.id))
          },
        ]
      )
    }
  }
}

export async function restoreSchedule(): PromiseAction {
  const list = await Parse.User.current().relation('mySchedule').query().find()
  const channels = list.map(({id}) => `session_${id}`)
  updateInstallation({channels})

  return {
    type: 'RESTORED_SCHEDULE',
    list,
  }
}

export async function loadFriendsSchedules(): PromiseAction {
  const list = await Parse.Cloud.run('friends')
  await InteractionManager.runAfterInteractions(() => {})
  return {
    type: 'LOADED_FRIENDS_SCHEDULES',
    list,
  }
}

export function setSharingEnabled(enabled: boolean): ThunkAction {
  return (dispatch) => {
    dispatch({
      type: 'SET_SHARING',
      enabled,
    })
    Parse.User.current().set('sharedSchedule', enabled)
    Parse.User.current().save()
  }
}

export function shareSession(session: Session): ThunkAction {
  return (dispatch, getState) => {
    const {sessionURLTemplate} = getState().config
    const url = sessionURLTemplate
      .replace('{slug}', session.slug)
      .replace('{id}', session.id)

    if ('ios' === Platform.OS) {
      ActionSheetIOS.showShareActionSheetWithOptions({
        message: session.title,
        url,
      }, (e) => console.error(e), logShare.bind(null, session.id))
    } else {
      Share.open({
        share_text: session.title,
        share_URL: url,
        title: 'Share Link to ' + session.title,
      }, (e) => logShare(session.id, true, null))
    }
  }
}

function logShare(id, completed, activity) {
  AppEventsLogger.logEvent('Share Session', 1, {id})
  console.log('Share Session', 1, {id})
  Parse.Analytics.track('share', {
    id,
    completed: completed ? 'yes' : 'no',
    activity: activity || '?'
  })
}
