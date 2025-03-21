"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
exports.__esModule = true;
exports.default = void 0;
var _normalizeColor = _interopRequireDefault(require("./normalizeColor"));
var _normalizeValueWithProperty = _interopRequireDefault(require("./normalizeValueWithProperty"));
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var defaultOffset = {
  height: 0,
  width: 0
};
var resolveShadowValue = style => {
  var shadowColor = style.shadowColor,
    shadowOffset = style.shadowOffset,
    shadowOpacity = style.shadowOpacity,
    shadowRadius = style.shadowRadius;
  var _ref = shadowOffset || defaultOffset,
    height = _ref.height,
    width = _ref.width;
  var offsetX = (0, _normalizeValueWithProperty.default)(width);
  var offsetY = (0, _normalizeValueWithProperty.default)(height);
  var blurRadius = (0, _normalizeValueWithProperty.default)(shadowRadius || 0);
  var color = (0, _normalizeColor.default)(shadowColor || 'black', shadowOpacity);
  if (color != null && offsetX != null && offsetY != null && blurRadius != null) {
    return offsetX + " " + offsetY + " " + blurRadius + " " + color;
  }
};
var _default = exports.default = resolveShadowValue;
module.exports = exports.default;