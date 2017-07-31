/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 * @providesModule ReactFiberComponentTreeHook
 */

'use strict'

import ReactTypeOfWork from './ReactTypeOfWork.js'
var {
  IndeterminateComponent,
  FunctionalComponent,
  ClassComponent,
  HostComponent,
} = ReactTypeOfWork
import describeComponentFrame from './describeComponentFrame.js'
import getComponentName from './getComponentName.js'

function describeFiber(fiber) {
  switch (fiber.tag) {
    case IndeterminateComponent:
    case FunctionalComponent:
    case ClassComponent:
    case HostComponent:
      var owner = fiber._debugOwner
      var source = fiber._debugSource
      var name = getComponentName(fiber)
      var ownerName = null
      if (owner) {
        ownerName = getComponentName(owner)
      }
      return describeComponentFrame(name, source, ownerName)
    default:
      return ''
  }
}

// This function can only be called with a work-in-progress fiber and
// only during begin or complete phase. Do not call it under any other
// circumstances.
export function getStackAddendumByWorkInProgressFiber(workInProgress) {
  var info = ''
  var node = workInProgress
  do {
    info += describeFiber(node)
    // Otherwise this return pointer might point to the wrong tree:
    node = node.return
  } while (node)
  return info
}
