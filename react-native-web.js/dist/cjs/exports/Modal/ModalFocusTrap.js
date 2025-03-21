"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
exports.__esModule = true;
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _View = _interopRequireDefault(require("../View"));
var _createElement = _interopRequireDefault(require("../createElement"));
var _StyleSheet = _interopRequireDefault(require("../StyleSheet"));
var _UIManager = _interopRequireDefault(require("../UIManager"));
var _canUseDom = _interopRequireDefault(require("../../modules/canUseDom"));
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

/**
 * This Component is used to "wrap" the modal we're opening
 * so that changing focus via tab will never leave the document.
 *
 * This allows us to properly trap the focus within a modal
 * even if the modal is at the start or end of a document.
 */

var FocusBracket = () => {
  return (0, _createElement.default)('div', {
    role: 'none',
    tabIndex: 0,
    style: styles.focusBracket
  });
};
function attemptFocus(element) {
  if (!_canUseDom.default) {
    return false;
  }
  try {
    element.focus();
  } catch (e) {
    // Do nothing
  }
  return document.activeElement === element;
}
function focusFirstDescendant(element) {
  for (var i = 0; i < element.childNodes.length; i++) {
    var child = element.childNodes[i];
    if (attemptFocus(child) || focusFirstDescendant(child)) {
      return true;
    }
  }
  return false;
}
function focusLastDescendant(element) {
  for (var i = element.childNodes.length - 1; i >= 0; i--) {
    var child = element.childNodes[i];
    if (attemptFocus(child) || focusLastDescendant(child)) {
      return true;
    }
  }
  return false;
}
var ModalFocusTrap = _ref => {
  var active = _ref.active,
    children = _ref.children;
  var trapElementRef = React.useRef();
  var focusRef = React.useRef({
    trapFocusInProgress: false,
    lastFocusedElement: null
  });
  React.useEffect(() => {
    if (_canUseDom.default) {
      var trapFocus = () => {
        // We should not trap focus if:
        // - The modal hasn't fully initialized with an HTMLElement ref
        // - Focus is already in the process of being trapped (e.g., we're refocusing)
        // - isTrapActive prop being falsey tells us to do nothing
        if (trapElementRef.current == null || focusRef.current.trapFocusInProgress || !active) {
          return;
        }
        try {
          focusRef.current.trapFocusInProgress = true;
          if (document.activeElement instanceof Node && !trapElementRef.current.contains(document.activeElement)) {
            // To handle keyboard focusing we can make an assumption here.
            // If you're tabbing through the focusable elements, the previously
            // active element will either be the first or the last.
            // If the previously selected element is the "first" descendant
            // and we're leaving it - this means that we should be looping
            // around to the other side of the modal.
            var hasFocused = focusFirstDescendant(trapElementRef.current);
            if (focusRef.current.lastFocusedElement === document.activeElement) {
              hasFocused = focusLastDescendant(trapElementRef.current);
            }
            // If we couldn't focus a new element then we need to focus onto the trap target
            if (!hasFocused && trapElementRef.current != null && document.activeElement) {
              _UIManager.default.focus(trapElementRef.current);
            }
          }
        } finally {
          focusRef.current.trapFocusInProgress = false;
        }
        focusRef.current.lastFocusedElement = document.activeElement;
      };

      // Call the trapFocus callback at least once when this modal has been activated.
      trapFocus();
      document.addEventListener('focus', trapFocus, true);
      return () => document.removeEventListener('focus', trapFocus, true);
    }
  }, [active]);

  // To be fully compliant with WCAG we need to refocus element that triggered opening modal
  // after closing it
  React.useEffect(function () {
    if (_canUseDom.default) {
      var lastFocusedElementOutsideTrap = document.activeElement;
      return function () {
        if (lastFocusedElementOutsideTrap && document.contains(lastFocusedElementOutsideTrap)) {
          _UIManager.default.focus(lastFocusedElementOutsideTrap);
        }
      };
    }
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FocusBracket, null), /*#__PURE__*/React.createElement(_View.default, {
    ref: trapElementRef
  }, children), /*#__PURE__*/React.createElement(FocusBracket, null));
};
var _default = exports.default = ModalFocusTrap;
var styles = _StyleSheet.default.create({
  focusBracket: {
    outlineStyle: 'none'
  }
});
module.exports = exports.default;