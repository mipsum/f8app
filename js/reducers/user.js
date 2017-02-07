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

import type { Action } from '../actions/types'

export type State = {
  isLoggedIn: boolean,
  hasSkippedLogin: boolean,
  sharedSchedule: ?boolean,
  id: ?string,
  name: ?string,
}

const initialState = {
  isLoggedIn: false,
  hasSkippedLogin: false,
  sharedSchedule: null,
  id: null,
  name: null,
}

export default function user (state: State = initialState, action: Action): State {
  if ('LOGGED_IN' === action.type) {
    let {id, name, sharedSchedule} = action.data
    if (sharedSchedule === undefined) {
      sharedSchedule = null
    }
    return {
      isLoggedIn: true,
      hasSkippedLogin: false,
      sharedSchedule,
      id,
      name,
    }
  }

  if ('SKIPPED_LOGIN' === action.type) {
    return {
      isLoggedIn: false,
      hasSkippedLogin: true,
      sharedSchedule: null,
      id: null,
      name: null,
    }
  }

  if ('LOGGED_OUT' === action.type) {
    return initialState
  }

  if ('SET_SHARING' === action.type) {
    return {
      ...state,
      sharedSchedule: action.enabled,
    }
  }

  if ('RESET_NUXES' === action.type) {
    return {...state, sharedSchedule: null}
  }

  return state
}
