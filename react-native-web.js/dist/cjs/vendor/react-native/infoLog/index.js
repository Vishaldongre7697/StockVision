/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

'use strict';

/**
 * Intentional info-level logging for clear separation from ad-hoc console debug logging.
 */
exports.__esModule = true;
exports.default = void 0;
function infoLog() {
  return console.log(...arguments);
}
var _default = exports.default = infoLog;
module.exports = exports.default;