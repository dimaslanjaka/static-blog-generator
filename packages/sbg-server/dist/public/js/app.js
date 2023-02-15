(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process){(function (){
/**
 * @popperjs/core v2.11.6 - MIT License
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
var max = Math.max;
var min = Math.min;
var round = Math.round;
function getUAString() {
  var uaData = navigator.userAgentData;
  if (uaData != null && uaData.brands) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }
  return navigator.userAgent;
}
function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }
  var _ref = isElement(element) ? getWindow(element) : window,
    visualViewport = _ref.visualViewport;
  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}
function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument :
  // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}
function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle(element),
    overflow = _getComputedStyle.overflow,
    overflowX = _getComputedStyle.overflowX,
    overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.

function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' ||
    // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}
function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }
  return (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot ||
    // step into the shadow DOM of the parent of a slotted node
    element.parentNode || (
    // DOM Element detected
    isShadowRoot(element) ? element.host : null) ||
    // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback
  );
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList :
  // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}
function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) ||
  // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }
  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block

function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());
  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle(element);
    if (elementCss.position === 'fixed') {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.

function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
    return window;
  }
  return offsetParent || getContainingBlock(element) || window;
}
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }
    return pending;
  };
}
function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return [].concat(args).reduce(function (p, c) {
    return p.replace(/%s/, c);
  }, str);
}
var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    }).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }
          break;
        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }
          break;
        case 'phase':
          if (modifierPhases.indexOf(modifier.phase) < 0) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }
          break;
        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }
          break;
        case 'effect':
          if (modifier.effect != null && typeof modifier.effect !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }
          break;
        case 'requires':
          if (modifier.requires != null && !Array.isArray(modifier.requires)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }
          break;
        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
          }
          break;
        case 'options':
        case 'data':
          break;
        default:
          console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
            return "\"" + s + "\"";
          }).join(', ') + "; but \"" + key + "\" was provided.");
      }
      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) {
          console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}
function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);
    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}
function getBasePlacement(placement) {
  return placement.split('-')[0];
}
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}
function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();
    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;
  if (getComputedStyle(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      } // $FlowFixMe[prop-missing]: need a better way to handle this...

      next = next.parentNode || next.host;
    } while (next);
  } // Give up, the result is false

  return false;
}
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`

function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414

  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents

function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
function getVariation(placement) {
  return placement.split('-')[1];
}
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}
function computeOffsets(_ref) {
  var reference = _ref.reference,
    element = _ref.element,
    placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }
  return offsets;
}
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options,
    _options$placement = _options.placement,
    placement = _options$placement === void 0 ? state.placement : _options$placement,
    _options$strategy = _options.strategy,
    strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
    _options$boundary = _options.boundary,
    boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
    _options$rootBoundary = _options.rootBoundary,
    rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
    _options$elementConte = _options.elementContext,
    elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
    _options$altBoundary = _options.altBoundary,
    altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
    _options$padding = _options.padding,
    padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }
  return overflowOffsets;
}
var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions,
    _generatorOptions$def = _generatorOptions.defaultModifiers,
    defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
    _generatorOptions$def2 = _generatorOptions.defaultOptions,
    defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (process.env.NODE_ENV !== "production") {
          var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          validateModifiers(modifiers);
          if (getBasePlacement(state.options.placement) === auto) {
            var flipModifier = state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });
            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
            }
          }
          var _getComputedStyle = getComputedStyle(popper),
            marginTop = _getComputedStyle.marginTop,
            marginRight = _getComputedStyle.marginRight,
            marginBottom = _getComputedStyle.marginBottom,
            marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer

          if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
          }
        }
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements,
          reference = _state$elements.reference,
          popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (process.env.NODE_ENV !== "production") {
            console.error(INVALID_ELEMENT_ERROR);
          }
          return;
        } // Store the reference and popper rects to be read by modifiers

        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;
        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (process.env.NODE_ENV !== "production") {
            __debug_loops__ += 1;
            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index],
            fn = _state$orderedModifie.fn,
            _state$orderedModifie2 = _state$orderedModifie.options,
            _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
            name = _state$orderedModifie.name;
          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference, popper)) {
      if (process.env.NODE_ENV !== "production") {
        console.error(INVALID_ELEMENT_ERROR);
      }
      return instance;
    }
    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
          _ref3$options = _ref3.options,
          options = _ref3$options === void 0 ? {} : _ref3$options,
          effect = _ref3.effect;
        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });
          var noopFn = function noopFn() {};
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var passive = {
  passive: true
};
function effect$2(_ref) {
  var state = _ref.state,
    instance = _ref.instance,
    options = _ref.options;
  var _options$scroll = options.scroll,
    scroll = _options$scroll === void 0 ? true : _options$scroll,
    _options$resize = options.resize,
    resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }
  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }
  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }
    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules

var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect$2,
  data: {}
};
function popperOffsets(_ref) {
  var state = _ref.state,
    name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules

var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};
var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
    y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper = _ref2.popper,
    popperRect = _ref2.popperRect,
    placement = _ref2.placement,
    variation = _ref2.variation,
    offsets = _ref2.offsets,
    position = _ref2.position,
    gpuAcceleration = _ref2.gpuAcceleration,
    adaptive = _ref2.adaptive,
    roundOffsets = _ref2.roundOffsets,
    isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
    x = _offsets$x === void 0 ? 0 : _offsets$x,
    _offsets$y = offsets.y,
    y = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };
  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';
    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);
      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it

    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height :
      // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width :
      // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };
  x = _ref4.x;
  y = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}
function computeStyles(_ref5) {
  var state = _ref5.state,
    options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
    gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
    _options$adaptive = options.adaptive,
    adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
    _options$roundOffsets = options.roundOffsets,
    roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  if (process.env.NODE_ENV !== "production") {
    var transitionProperty = getComputedStyle(state.elements.popper).transitionProperty || '';
    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
    }
  }
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules

var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]

    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];
      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}
function effect$1(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules

var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$1,
  requires: ['computeStyles']
};
function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
      placement: placement
    })) : offset,
    skidding = _ref[0],
    distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state,
    options = _ref2.options,
    name = _ref2.name;
  var _options$offset = options.offset,
    offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
    x = _data$state$placement.x,
    y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules

var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};
var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}
var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options,
    placement = _options.placement,
    boundary = _options.boundary,
    rootBoundary = _options.rootBoundary,
    padding = _options.padding,
    flipVariations = _options.flipVariations,
    _options$allowedAutoP = _options.allowedAutoPlacements,
    allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
    }
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...

  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state,
    options = _ref.options,
    name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis,
    checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
    _options$altAxis = options.altAxis,
    checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
    specifiedFallbackPlacements = options.fallbackPlacements,
    padding = options.padding,
    boundary = options.boundary,
    rootBoundary = options.rootBoundary,
    altBoundary = options.altBoundary,
    _options$flipVariatio = options.flipVariations,
    flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
    allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];
  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);
        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break") break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules

var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}
function preventOverflow(_ref) {
  var state = _ref.state,
    options = _ref.options,
    name = _ref.name;
  var _options$mainAxis = options.mainAxis,
    checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
    _options$altAxis = options.altAxis,
    checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
    boundary = options.boundary,
    rootBoundary = options.rootBoundary,
    altBoundary = options.altBoundary,
    padding = options.padding,
    _options$tether = options.tether,
    tether = _options$tether === void 0 ? true : _options$tether,
    _options$tetherOffset = options.tetherOffset,
    tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = offset + overflow[mainSide];
    var max$1 = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === 'x' ? top : left;
    var _altSide = mainAxis === 'x' ? bottom : right;
    var _offset = popperOffsets[altAxis];
    var _len = altAxis === 'y' ? 'height' : 'width';
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules

var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};
var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state,
    name = _ref.name,
    options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';
  if (!arrowElement || !popperOffsets) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}
function effect(_ref2) {
  var state = _ref2.state,
    options = _ref2.options;
  var _options$element = options.element,
    arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;
  if (arrowElement == null) {
    return;
  } // CSS selector

  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (process.env.NODE_ENV !== "production") {
    if (!isHTMLElement(arrowElement)) {
      console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
    }
    return;
  }
  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules

var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state,
    name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules

var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};
var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
var createPopper$1 = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers$1
}); // eslint-disable-next-line import/no-unused-modules

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

exports.applyStyles = applyStyles$1;
exports.arrow = arrow$1;
exports.computeStyles = computeStyles$1;
exports.createPopper = createPopper;
exports.createPopperLite = createPopper$1;
exports.defaultModifiers = defaultModifiers;
exports.detectOverflow = detectOverflow;
exports.eventListeners = eventListeners;
exports.flip = flip$1;
exports.hide = hide$1;
exports.offset = offset$1;
exports.popperGenerator = popperGenerator;
exports.popperOffsets = popperOffsets$1;
exports.preventOverflow = preventOverflow$1;

}).call(this)}).call(this,require('_process'))
},{"_process":689}],2:[function(require,module,exports){
"use strict";

require('../stable');
require('../stage/3');
module.exports = require('../internals/path');

},{"../internals/path":197,"../stable":651,"../stage/3":652}],3:[function(require,module,exports){
"use strict";

var isCallable = require('../internals/is-callable');
var tryToString = require('../internals/try-to-string');
var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};

},{"../internals/is-callable":138,"../internals/try-to-string":263}],4:[function(require,module,exports){
"use strict";

var isConstructor = require('../internals/is-constructor');
var tryToString = require('../internals/try-to-string');
var $TypeError = TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a constructor');
};

},{"../internals/is-constructor":139,"../internals/try-to-string":263}],5:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var isCallable = require('../internals/is-callable');
var $String = String;
var $TypeError = TypeError;
module.exports = function (argument) {
  if (_typeof(argument) == 'object' || isCallable(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};

},{"../internals/is-callable":138}],6:[function(require,module,exports){
"use strict";

var has = require('../internals/set-helpers').has;

// Perform ? RequireInternalSlot(M, [[SetData]])
module.exports = function (it) {
  has(it);
  return it;
};

},{"../internals/set-helpers":217}],7:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var bind = require('../internals/function-bind-context');
var anObject = require('../internals/an-object');
var isNullOrUndefined = require('../internals/is-null-or-undefined');
var getMethod = require('../internals/get-method');
var wellKnownSymbol = require('../internals/well-known-symbol');
var ASYNC_DISPOSE = wellKnownSymbol('asyncDispose');
var DISPOSE = wellKnownSymbol('dispose');
var push = uncurryThis([].push);
var getDisposeMethod = function getDisposeMethod(V, hint) {
  if (hint == 'async-dispose') {
    return getMethod(V, ASYNC_DISPOSE) || getMethod(V, DISPOSE);
  }
  return getMethod(V, DISPOSE);
};

// `CreateDisposableResource` abstract operation
// https://tc39.es/proposal-explicit-resource-management/#sec-createdisposableresource
var createDisposableResource = function createDisposableResource(V, hint, method) {
  return bind(method || getDisposeMethod(V, hint), V);
};

// `AddDisposableResource` abstract operation
// https://tc39.es/proposal-explicit-resource-management/#sec-adddisposableresource-disposable-v-hint-disposemethod
module.exports = function (disposable, V, hint, method) {
  var resource;
  if (!method) {
    if (isNullOrUndefined(V)) return;
    resource = createDisposableResource(V, hint);
  } else if (isNullOrUndefined(V)) {
    resource = createDisposableResource(undefined, hint, method);
  } else {
    resource = createDisposableResource(anObject(V), hint, method);
  }
  push(disposable.stack, resource);
};

},{"../internals/an-object":11,"../internals/function-bind-context":103,"../internals/function-uncurry-this":110,"../internals/get-method":119,"../internals/is-null-or-undefined":143,"../internals/well-known-symbol":277}],8:[function(require,module,exports){
"use strict";

var wellKnownSymbol = require('../internals/well-known-symbol');
var create = require('../internals/object-create');
var defineProperty = require('../internals/object-define-property').f;
var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

},{"../internals/object-create":177,"../internals/object-define-property":179,"../internals/well-known-symbol":277}],9:[function(require,module,exports){
'use strict';

var charAt = require('../internals/string-multibyte').charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};

},{"../internals/string-multibyte":234}],10:[function(require,module,exports){
"use strict";

var isPrototypeOf = require('../internals/object-is-prototype-of');
var $TypeError = TypeError;
module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw $TypeError('Incorrect invocation');
};

},{"../internals/object-is-prototype-of":186}],11:[function(require,module,exports){
"use strict";

var isObject = require('../internals/is-object');
var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};

},{"../internals/is-object":144}],12:[function(require,module,exports){
"use strict";

// eslint-disable-next-line es/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';

},{}],13:[function(require,module,exports){
"use strict";

var uncurryThisAccessor = require('../internals/function-uncurry-this-accessor');
var classof = require('../internals/classof-raw');
var $TypeError = TypeError;

// Includes
// - Perform ? RequireInternalSlot(O, [[ArrayBufferData]]).
// - If IsSharedArrayBuffer(O) is true, throw a TypeError exception.
module.exports = uncurryThisAccessor(ArrayBuffer.prototype, 'byteLength', 'get') || function (O) {
  if (classof(O) != 'ArrayBuffer') throw $TypeError('ArrayBuffer expected');
  return O.byteLength;
};

},{"../internals/classof-raw":52,"../internals/function-uncurry-this-accessor":108}],14:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var arrayBufferByteLength = require('../internals/array-buffer-byte-length');
var slice = uncurryThis(ArrayBuffer.prototype.slice);
module.exports = function (O) {
  if (arrayBufferByteLength(O) !== 0) return false;
  try {
    slice(O, 0, 0);
    return false;
  } catch (error) {
    return true;
  }
};

},{"../internals/array-buffer-byte-length":13,"../internals/function-uncurry-this":110}],15:[function(require,module,exports){
"use strict";

// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it
var fails = require('../internals/fails');
module.exports = fails(function () {
  if (typeof ArrayBuffer == 'function') {
    var buffer = new ArrayBuffer(8);
    // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe
    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', {
      value: 8
    });
  }
});

},{"../internals/fails":98}],16:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var uncurryThisAccessor = require('../internals/function-uncurry-this-accessor');
var toIndex = require('../internals/to-index');
var isDetached = require('../internals/array-buffer-is-detached');
var arrayBufferByteLength = require('../internals/array-buffer-byte-length');
var PROPER_TRANSFER = require('../internals/structured-clone-proper-transfer');
var TypeError = global.TypeError;
var structuredClone = global.structuredClone;
var ArrayBuffer = global.ArrayBuffer;
var DataView = global.DataView;
var min = Math.min;
var ArrayBufferPrototype = ArrayBuffer.prototype;
var DataViewPrototype = DataView.prototype;
var slice = uncurryThis(ArrayBufferPrototype.slice);
var isResizable = uncurryThisAccessor(ArrayBufferPrototype, 'resizable', 'get');
var maxByteLength = uncurryThisAccessor(ArrayBufferPrototype, 'maxByteLength', 'get');
var getInt8 = uncurryThis(DataViewPrototype.getInt8);
var setInt8 = uncurryThis(DataViewPrototype.setInt8);
module.exports = PROPER_TRANSFER && function (arrayBuffer, newLength, preserveResizability) {
  var byteLength = arrayBufferByteLength(arrayBuffer);
  var newByteLength = newLength === undefined ? byteLength : min(toIndex(newLength), byteLength);
  var fixedLength = !isResizable || !isResizable(arrayBuffer);
  if (isDetached(arrayBuffer)) throw TypeError('ArrayBuffer is detached');
  var newBuffer = structuredClone(arrayBuffer, {
    transfer: [arrayBuffer]
  });
  if (byteLength == newByteLength && (preserveResizability || fixedLength)) return newBuffer;
  if (!preserveResizability || fixedLength) return slice(newBuffer, 0, newByteLength);
  var newNewBuffer = new ArrayBuffer(newByteLength, maxByteLength && {
    maxByteLength: maxByteLength(newBuffer)
  });
  var a = new DataView(newBuffer);
  var b = new DataView(newNewBuffer);
  for (var i = 0; i < newByteLength; i++) setInt8(b, i, getInt8(a, i));
  return newNewBuffer;
};

},{"../internals/array-buffer-byte-length":13,"../internals/array-buffer-is-detached":14,"../internals/function-uncurry-this":110,"../internals/function-uncurry-this-accessor":108,"../internals/global":122,"../internals/structured-clone-proper-transfer":243,"../internals/to-index":251}],17:[function(require,module,exports){
'use strict';

var NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-basic-detection');
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var hasOwn = require('../internals/has-own-property');
var classof = require('../internals/classof');
var tryToString = require('../internals/try-to-string');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var defineBuiltIn = require('../internals/define-built-in');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var wellKnownSymbol = require('../internals/well-known-symbol');
var uid = require('../internals/uid');
var InternalStateModule = require('../internals/internal-state');
var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError = global.TypeError;
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME, Constructor, Prototype;
var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};
var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};
var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView' || hasOwn(TypedArrayConstructorsList, klass) || hasOwn(BigIntArrayConstructorsList, klass);
};
var getTypedArrayConstructor = function getTypedArrayConstructor(it) {
  var proto = getPrototypeOf(it);
  if (!isObject(proto)) return;
  var state = getInternalState(proto);
  return state && hasOwn(state, TYPED_ARRAY_CONSTRUCTOR) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor(proto);
};
var isTypedArray = function isTypedArray(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return hasOwn(TypedArrayConstructorsList, klass) || hasOwn(BigIntArrayConstructorsList, klass);
};
var aTypedArray = function aTypedArray(it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};
var aTypedArrayConstructor = function aTypedArrayConstructor(C) {
  if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
  throw TypeError(tryToString(C) + ' is not a typed array constructor');
};
var exportTypedArrayMethod = function exportTypedArrayMethod(KEY, property, forced, options) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) {
      // old WebKit bug - some methods are non-configurable
      try {
        TypedArrayConstructor.prototype[KEY] = property;
      } catch (error2) {/* empty */}
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    defineBuiltIn(TypedArrayPrototype, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
  }
};
var exportTypedArrayStaticMethod = function exportTypedArrayStaticMethod(KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) {/* empty */}
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) {/* empty */}
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      defineBuiltIn(TypedArrayConstructor, KEY, property);
    }
  }
};
for (NAME in TypedArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;else NATIVE_ARRAY_BUFFER_VIEWS = false;
}
for (NAME in BigIntArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}
if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}
if (DESCRIPTORS && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQUIRED = true;
  defineBuiltInAccessor(TypedArrayPrototype, TO_STRING_TAG, {
    configurable: true,
    get: function get() {
      return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
    }
  });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}
module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  getTypedArrayConstructor: getTypedArrayConstructor,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};

},{"../internals/array-buffer-basic-detection":12,"../internals/classof":53,"../internals/create-non-enumerable-property":62,"../internals/define-built-in":68,"../internals/define-built-in-accessor":67,"../internals/descriptors":72,"../internals/global":122,"../internals/has-own-property":123,"../internals/internal-state":134,"../internals/is-callable":138,"../internals/is-object":144,"../internals/object-get-prototype-of":184,"../internals/object-is-prototype-of":186,"../internals/object-set-prototype-of":191,"../internals/try-to-string":263,"../internals/uid":269,"../internals/well-known-symbol":277}],18:[function(require,module,exports){
'use strict';

var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var DESCRIPTORS = require('../internals/descriptors');
var NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-basic-detection');
var FunctionName = require('../internals/function-name');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var defineBuiltIns = require('../internals/define-built-ins');
var fails = require('../internals/fails');
var anInstance = require('../internals/an-instance');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toLength = require('../internals/to-length');
var toIndex = require('../internals/to-index');
var IEEE754 = require('../internals/ieee754');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var arrayFill = require('../internals/array-fill');
var arraySlice = require('../internals/array-slice-simple');
var setToStringTag = require('../internals/set-to-string-tag');
var InternalStateModule = require('../internals/internal-state');
var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length';
var WRONG_INDEX = 'Wrong index';
var getInternalArrayBufferState = InternalStateModule.getterFor(ARRAY_BUFFER);
var getInternalDataViewState = InternalStateModule.getterFor(DATA_VIEW);
var setInternalState = InternalStateModule.set;
var NativeArrayBuffer = global[ARRAY_BUFFER];
var $ArrayBuffer = NativeArrayBuffer;
var ArrayBufferPrototype = $ArrayBuffer && $ArrayBuffer[PROTOTYPE];
var $DataView = global[DATA_VIEW];
var DataViewPrototype = $DataView && $DataView[PROTOTYPE];
var ObjectPrototype = Object.prototype;
var Array = global.Array;
var RangeError = global.RangeError;
var fill = uncurryThis(arrayFill);
var reverse = uncurryThis([].reverse);
var packIEEE754 = IEEE754.pack;
var unpackIEEE754 = IEEE754.unpack;
var packInt8 = function packInt8(number) {
  return [number & 0xFF];
};
var packInt16 = function packInt16(number) {
  return [number & 0xFF, number >> 8 & 0xFF];
};
var packInt32 = function packInt32(number) {
  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
};
var unpackInt32 = function unpackInt32(buffer) {
  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
};
var packFloat32 = function packFloat32(number) {
  return packIEEE754(number, 23, 4);
};
var packFloat64 = function packFloat64(number) {
  return packIEEE754(number, 52, 8);
};
var addGetter = function addGetter(Constructor, key, getInternalState) {
  defineBuiltInAccessor(Constructor[PROTOTYPE], key, {
    configurable: true,
    get: function get() {
      return getInternalState(this)[key];
    }
  });
};
var get = function get(view, count, index, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalDataViewState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = store.bytes;
  var start = intIndex + store.byteOffset;
  var pack = arraySlice(bytes, start, start + count);
  return isLittleEndian ? pack : reverse(pack);
};
var set = function set(view, count, index, conversion, value, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalDataViewState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = store.bytes;
  var start = intIndex + store.byteOffset;
  var pack = conversion(+value);
  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
};
if (!NATIVE_ARRAY_BUFFER) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, ArrayBufferPrototype);
    var byteLength = toIndex(length);
    setInternalState(this, {
      type: ARRAY_BUFFER,
      bytes: fill(Array(byteLength), 0),
      byteLength: byteLength
    });
    if (!DESCRIPTORS) {
      this.byteLength = byteLength;
      this.detached = false;
    }
  };
  ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE];
  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, DataViewPrototype);
    anInstance(buffer, ArrayBufferPrototype);
    var bufferState = getInternalArrayBufferState(buffer);
    var bufferLength = bufferState.byteLength;
    var offset = toIntegerOrInfinity(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    setInternalState(this, {
      type: DATA_VIEW,
      buffer: buffer,
      byteLength: byteLength,
      byteOffset: offset,
      bytes: bufferState.bytes
    });
    if (!DESCRIPTORS) {
      this.buffer = buffer;
      this.byteLength = byteLength;
      this.byteOffset = offset;
    }
  };
  DataViewPrototype = $DataView[PROTOTYPE];
  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, 'byteLength', getInternalArrayBufferState);
    addGetter($DataView, 'buffer', getInternalDataViewState);
    addGetter($DataView, 'byteLength', getInternalDataViewState);
    addGetter($DataView, 'byteOffset', getInternalDataViewState);
  }
  defineBuiltIns(DataViewPrototype, {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
    }
  });
} else {
  var INCORRECT_ARRAY_BUFFER_NAME = PROPER_FUNCTION_NAME && NativeArrayBuffer.name !== ARRAY_BUFFER;
  /* eslint-disable no-new -- required for testing */
  if (!fails(function () {
    NativeArrayBuffer(1);
  }) || !fails(function () {
    new NativeArrayBuffer(-1);
  }) || fails(function () {
    new NativeArrayBuffer();
    new NativeArrayBuffer(1.5);
    new NativeArrayBuffer(NaN);
    return NativeArrayBuffer.length != 1 || INCORRECT_ARRAY_BUFFER_NAME && !CONFIGURABLE_FUNCTION_NAME;
  })) {
    /* eslint-enable no-new -- required for testing */
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, ArrayBufferPrototype);
      return new NativeArrayBuffer(toIndex(length));
    };
    $ArrayBuffer[PROTOTYPE] = ArrayBufferPrototype;
    for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) {
        createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer[key]);
      }
    }
    ArrayBufferPrototype.constructor = $ArrayBuffer;
  } else if (INCORRECT_ARRAY_BUFFER_NAME && CONFIGURABLE_FUNCTION_NAME) {
    createNonEnumerableProperty(NativeArrayBuffer, 'name', ARRAY_BUFFER);
  }

  // WebKit bug - the same parent prototype for typed arrays and data view
  if (setPrototypeOf && getPrototypeOf(DataViewPrototype) !== ObjectPrototype) {
    setPrototypeOf(DataViewPrototype, ObjectPrototype);
  }

  // iOS Safari 7.x bug
  var testView = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = uncurryThis(DataViewPrototype.setInt8);
  testView.setInt8(0, 2147483648);
  testView.setInt8(1, 2147483649);
  if (testView.getInt8(0) || !testView.getInt8(1)) defineBuiltIns(DataViewPrototype, {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8(this, byteOffset, value << 24 >> 24);
    }
  }, {
    unsafe: true
  });
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
module.exports = {
  ArrayBuffer: $ArrayBuffer,
  DataView: $DataView
};

},{"../internals/an-instance":10,"../internals/array-buffer-basic-detection":12,"../internals/array-fill":20,"../internals/array-slice-simple":35,"../internals/create-non-enumerable-property":62,"../internals/define-built-in-accessor":67,"../internals/define-built-ins":69,"../internals/descriptors":72,"../internals/fails":98,"../internals/function-name":107,"../internals/function-uncurry-this":110,"../internals/global":122,"../internals/ieee754":128,"../internals/internal-state":134,"../internals/object-get-own-property-names":182,"../internals/object-get-prototype-of":184,"../internals/object-set-prototype-of":191,"../internals/set-to-string-tag":227,"../internals/to-index":251,"../internals/to-integer-or-infinity":253,"../internals/to-length":254}],19:[function(require,module,exports){
'use strict';

var toObject = require('../internals/to-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var deletePropertyOrThrow = require('../internals/delete-property-or-throw');
var min = Math.min;

// `Array.prototype.copyWithin` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.copywithin
// eslint-disable-next-line es/no-array-prototype-copywithin -- safe
module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = lengthOfArrayLike(O);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];else deletePropertyOrThrow(O, to);
    to += inc;
    from += inc;
  }
  return O;
};

},{"../internals/delete-property-or-throw":71,"../internals/length-of-array-like":158,"../internals/to-absolute-index":249,"../internals/to-object":255}],20:[function(require,module,exports){
'use strict';

var toObject = require('../internals/to-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var lengthOfArrayLike = require('../internals/length-of-array-like');

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = lengthOfArrayLike(O);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"../internals/length-of-array-like":158,"../internals/to-absolute-index":249,"../internals/to-object":255}],21:[function(require,module,exports){
'use strict';

var $forEach = require('../internals/array-iteration').forEach;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  // eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;

},{"../internals/array-iteration":29,"../internals/array-method-is-strict":32}],22:[function(require,module,exports){
'use strict';

var bind = require('../internals/function-bind-context');
var uncurryThis = require('../internals/function-uncurry-this');
var toObject = require('../internals/to-object');
var isConstructor = require('../internals/is-constructor');
var getAsyncIterator = require('../internals/get-async-iterator');
var getIterator = require('../internals/get-iterator');
var getIteratorDirect = require('../internals/get-iterator-direct');
var getIteratorMethod = require('../internals/get-iterator-method');
var getMethod = require('../internals/get-method');
var getVirtual = require('../internals/entry-virtual');
var getBuiltIn = require('../internals/get-built-in');
var wellKnownSymbol = require('../internals/well-known-symbol');
var AsyncFromSyncIterator = require('../internals/async-from-sync-iterator');
var toArray = require('../internals/async-iterator-iteration').toArray;
var ASYNC_ITERATOR = wellKnownSymbol('asyncIterator');
var arrayIterator = uncurryThis(getVirtual('Array').values);
var arrayIteratorNext = uncurryThis(arrayIterator([]).next);
var safeArrayIterator = function safeArrayIterator() {
  return new SafeArrayIterator(this);
};
var SafeArrayIterator = function SafeArrayIterator(O) {
  this.iterator = arrayIterator(O);
};
SafeArrayIterator.prototype.next = function () {
  return arrayIteratorNext(this.iterator);
};

// `Array.fromAsync` method implementation
// https://github.com/tc39/proposal-array-from-async
module.exports = function fromAsync(asyncItems /* , mapfn = undefined, thisArg = undefined */) {
  var C = this;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var thisArg = argumentsLength > 2 ? arguments[2] : undefined;
  return new (getBuiltIn('Promise'))(function (resolve) {
    var O = toObject(asyncItems);
    if (mapfn !== undefined) mapfn = bind(mapfn, thisArg);
    var usingAsyncIterator = getMethod(O, ASYNC_ITERATOR);
    var usingSyncIterator = usingAsyncIterator ? undefined : getIteratorMethod(O) || safeArrayIterator;
    var A = isConstructor(C) ? new C() : [];
    var iterator = usingAsyncIterator ? getAsyncIterator(O, usingAsyncIterator) : new AsyncFromSyncIterator(getIteratorDirect(getIterator(O, usingSyncIterator)));
    resolve(toArray(iterator, mapfn, A));
  });
};

},{"../internals/async-from-sync-iterator":42,"../internals/async-iterator-iteration":45,"../internals/entry-virtual":91,"../internals/function-bind-context":103,"../internals/function-uncurry-this":110,"../internals/get-async-iterator":112,"../internals/get-built-in":113,"../internals/get-iterator":117,"../internals/get-iterator-direct":114,"../internals/get-iterator-method":116,"../internals/get-method":119,"../internals/is-constructor":139,"../internals/to-object":255,"../internals/well-known-symbol":277}],23:[function(require,module,exports){
"use strict";

var lengthOfArrayLike = require('../internals/length-of-array-like');
module.exports = function (Constructor, list) {
  var index = 0;
  var length = lengthOfArrayLike(list);
  var result = new Constructor(length);
  while (length > index) result[index] = list[index++];
  return result;
};

},{"../internals/length-of-array-like":158}],24:[function(require,module,exports){
'use strict';

var bind = require('../internals/function-bind-context');
var call = require('../internals/function-call');
var toObject = require('../internals/to-object');
var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var isConstructor = require('../internals/is-constructor');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var createProperty = require('../internals/create-property');
var getIterator = require('../internals/get-iterator');
var getIteratorMethod = require('../internals/get-iterator-method');
var $Array = Array;

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var IS_CONSTRUCTOR = isConstructor(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    result = IS_CONSTRUCTOR ? new this() : [];
    for (; !(step = call(next, iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = lengthOfArrayLike(O);
    result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
    for (; length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

},{"../internals/call-with-safe-iteration-closing":50,"../internals/create-property":64,"../internals/function-bind-context":103,"../internals/function-call":106,"../internals/get-iterator":117,"../internals/get-iterator-method":116,"../internals/is-array-iterator-method":135,"../internals/is-constructor":139,"../internals/length-of-array-like":158,"../internals/to-object":255}],25:[function(require,module,exports){
'use strict';

var bind = require('../internals/function-bind-context');
var uncurryThis = require('../internals/function-uncurry-this');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var MapHelpers = require('../internals/map-helpers');
var Map = MapHelpers.Map;
var mapGet = MapHelpers.get;
var mapHas = MapHelpers.has;
var mapSet = MapHelpers.set;
var push = uncurryThis([].push);

// `Array.prototype.groupToMap` method
// https://github.com/tc39/proposal-array-grouping
module.exports = function groupToMap(callbackfn /* , thisArg */) {
  var O = toObject(this);
  var self = IndexedObject(O);
  var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  var map = new Map();
  var length = lengthOfArrayLike(self);
  var index = 0;
  var key, value;
  for (; length > index; index++) {
    value = self[index];
    key = boundFunction(value, index, O);
    if (mapHas(map, key)) push(mapGet(map, key), value);else mapSet(map, key, [value]);
  }
  return map;
};

},{"../internals/function-bind-context":103,"../internals/function-uncurry-this":110,"../internals/indexed-object":129,"../internals/length-of-array-like":158,"../internals/map-helpers":160,"../internals/to-object":255}],26:[function(require,module,exports){
"use strict";

var bind = require('../internals/function-bind-context');
var uncurryThis = require('../internals/function-uncurry-this');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var toPropertyKey = require('../internals/to-property-key');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var objectCreate = require('../internals/object-create');
var arrayFromConstructorAndList = require('../internals/array-from-constructor-and-list');
var $Array = Array;
var push = uncurryThis([].push);
module.exports = function ($this, callbackfn, that, specificConstructor) {
  var O = toObject($this);
  var self = IndexedObject(O);
  var boundFunction = bind(callbackfn, that);
  var target = objectCreate(null);
  var length = lengthOfArrayLike(self);
  var index = 0;
  var Constructor, key, value;
  for (; length > index; index++) {
    value = self[index];
    key = toPropertyKey(boundFunction(value, index, O));
    // in some IE10 builds, `hasOwnProperty` returns incorrect result on integer keys
    // but since it's a `null` prototype object, we can safely use `in`
    if (key in target) push(target[key], value);else target[key] = [value];
  }
  // TODO: Remove this block from `core-js@4`
  if (specificConstructor) {
    Constructor = specificConstructor(O);
    if (Constructor !== $Array) {
      for (key in target) target[key] = arrayFromConstructorAndList(Constructor, target[key]);
    }
  }
  return target;
};

},{"../internals/array-from-constructor-and-list":23,"../internals/function-bind-context":103,"../internals/function-uncurry-this":110,"../internals/indexed-object":129,"../internals/length-of-array-like":158,"../internals/object-create":177,"../internals/to-object":255,"../internals/to-property-key":259}],27:[function(require,module,exports){
"use strict";

var toIndexedObject = require('../internals/to-indexed-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var lengthOfArrayLike = require('../internals/length-of-array-like');

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function createMethod(IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    }
    return !IS_INCLUDES && -1;
  };
};
module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

},{"../internals/length-of-array-like":158,"../internals/to-absolute-index":249,"../internals/to-indexed-object":252}],28:[function(require,module,exports){
"use strict";

var bind = require('../internals/function-bind-context');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');

// `Array.prototype.{ findLast, findLastIndex }` methods implementation
var createMethod = function createMethod(TYPE) {
  var IS_FIND_LAST_INDEX = TYPE == 1;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var index = lengthOfArrayLike(self);
    var value, result;
    while (index-- > 0) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (result) switch (TYPE) {
        case 0:
          return value;
        // findLast
        case 1:
          return index;
        // findLastIndex
      }
    }

    return IS_FIND_LAST_INDEX ? -1 : undefined;
  };
};
module.exports = {
  // `Array.prototype.findLast` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLast: createMethod(0),
  // `Array.prototype.findLastIndex` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLastIndex: createMethod(1)
};

},{"../internals/function-bind-context":103,"../internals/indexed-object":129,"../internals/length-of-array-like":158,"../internals/to-object":255}],29:[function(require,module,exports){
"use strict";

var bind = require('../internals/function-bind-context');
var uncurryThis = require('../internals/function-uncurry-this');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var arraySpeciesCreate = require('../internals/array-species-create');
var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function createMethod(TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (; length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3:
            return true;
          // some
          case 5:
            return value;
          // find
          case 6:
            return index;
          // findIndex
          case 2:
            push(target, value);
          // filter
        } else switch (TYPE) {
          case 4:
            return false;
          // every
          case 7:
            push(target, value);
          // filterReject
        }
      }
    }

    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};
module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};

},{"../internals/array-species-create":39,"../internals/function-bind-context":103,"../internals/function-uncurry-this":110,"../internals/indexed-object":129,"../internals/length-of-array-like":158,"../internals/to-object":255}],30:[function(require,module,exports){
'use strict';

/* eslint-disable es/no-array-prototype-lastindexof -- safe */
var apply = require('../internals/function-apply');
var toIndexedObject = require('../internals/to-indexed-object');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var min = Math.min;
var $lastIndexOf = [].lastIndexOf;
var NEGATIVE_ZERO = !!$lastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('lastIndexOf');
var FORCED = NEGATIVE_ZERO || !STRICT_METHOD;

// `Array.prototype.lastIndexOf` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
module.exports = FORCED ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
  // convert -0 to +0
  if (NEGATIVE_ZERO) return apply($lastIndexOf, this, arguments) || 0;
  var O = toIndexedObject(this);
  var length = lengthOfArrayLike(O);
  var index = length - 1;
  if (arguments.length > 1) index = min(index, toIntegerOrInfinity(arguments[1]));
  if (index < 0) index = length + index;
  for (; index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
  return -1;
} : $lastIndexOf;

},{"../internals/array-method-is-strict":32,"../internals/function-apply":102,"../internals/length-of-array-like":158,"../internals/to-indexed-object":252,"../internals/to-integer-or-infinity":253}],31:[function(require,module,exports){
"use strict";

var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var V8_VERSION = require('../internals/engine-v8-version');
var SPECIES = wellKnownSymbol('species');
module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return {
        foo: 1
      };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

},{"../internals/engine-v8-version":89,"../internals/fails":98,"../internals/well-known-symbol":277}],32:[function(require,module,exports){
'use strict';

var fails = require('../internals/fails');
module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () {
      return 1;
    }, 1);
  });
};

},{"../internals/fails":98}],33:[function(require,module,exports){
"use strict";

var aCallable = require('../internals/a-callable');
var toObject = require('../internals/to-object');
var IndexedObject = require('../internals/indexed-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var $TypeError = TypeError;

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function createMethod(IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aCallable(callbackfn);
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(O);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw $TypeError('Reduce of empty array with no initial value');
      }
    }
    for (; IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};
module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};

},{"../internals/a-callable":3,"../internals/indexed-object":129,"../internals/length-of-array-like":158,"../internals/to-object":255}],34:[function(require,module,exports){
'use strict';

var DESCRIPTORS = require('../internals/descriptors');
var isArray = require('../internals/is-array');
var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', {
      writable: false
    }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();
module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw $TypeError('Cannot set read only .length');
  }
  return O.length = length;
} : function (O, length) {
  return O.length = length;
};

},{"../internals/descriptors":72,"../internals/is-array":136}],35:[function(require,module,exports){
"use strict";

var toAbsoluteIndex = require('../internals/to-absolute-index');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var createProperty = require('../internals/create-property');
var $Array = Array;
var max = Math.max;
module.exports = function (O, start, end) {
  var length = lengthOfArrayLike(O);
  var k = toAbsoluteIndex(start, length);
  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
  var result = $Array(max(fin - k, 0));
  for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
  result.length = n;
  return result;
};

},{"../internals/create-property":64,"../internals/length-of-array-like":158,"../internals/to-absolute-index":249}],36:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
module.exports = uncurryThis([].slice);

},{"../internals/function-uncurry-this":110}],37:[function(require,module,exports){
"use strict";

var arraySlice = require('../internals/array-slice-simple');
var floor = Math.floor;
var mergeSort = function mergeSort(array, comparefn) {
  var length = array.length;
  var middle = floor(length / 2);
  return length < 8 ? insertionSort(array, comparefn) : merge(array, mergeSort(arraySlice(array, 0, middle), comparefn), mergeSort(arraySlice(array, middle), comparefn), comparefn);
};
var insertionSort = function insertionSort(array, comparefn) {
  var length = array.length;
  var i = 1;
  var element, j;
  while (i < length) {
    j = i;
    element = array[i];
    while (j && comparefn(array[j - 1], element) > 0) {
      array[j] = array[--j];
    }
    if (j !== i++) array[j] = element;
  }
  return array;
};
var merge = function merge(array, left, right, comparefn) {
  var llength = left.length;
  var rlength = right.length;
  var lindex = 0;
  var rindex = 0;
  while (lindex < llength || rindex < rlength) {
    array[lindex + rindex] = lindex < llength && rindex < rlength ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++] : lindex < llength ? left[lindex++] : right[rindex++];
  }
  return array;
};
module.exports = mergeSort;

},{"../internals/array-slice-simple":35}],38:[function(require,module,exports){
"use strict";

var isArray = require('../internals/is-array');
var isConstructor = require('../internals/is-constructor');
var isObject = require('../internals/is-object');
var wellKnownSymbol = require('../internals/well-known-symbol');
var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  }
  return C === undefined ? $Array : C;
};

},{"../internals/is-array":136,"../internals/is-constructor":139,"../internals/is-object":144,"../internals/well-known-symbol":277}],39:[function(require,module,exports){
"use strict";

var arraySpeciesConstructor = require('../internals/array-species-constructor');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

},{"../internals/array-species-constructor":38}],40:[function(require,module,exports){
"use strict";

var lengthOfArrayLike = require('../internals/length-of-array-like');

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
module.exports = function (O, C) {
  var len = lengthOfArrayLike(O);
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = O[len - k - 1];
  return A;
};

},{"../internals/length-of-array-like":158}],41:[function(require,module,exports){
"use strict";

var lengthOfArrayLike = require('../internals/length-of-array-like');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var $RangeError = RangeError;

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
module.exports = function (O, C, index, value) {
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
  if (actualIndex >= len || actualIndex < 0) throw $RangeError('Incorrect index');
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = k === actualIndex ? value : O[k];
  return A;
};

},{"../internals/length-of-array-like":158,"../internals/to-integer-or-infinity":253}],42:[function(require,module,exports){
'use strict';

var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var create = require('../internals/object-create');
var getMethod = require('../internals/get-method');
var defineBuiltIns = require('../internals/define-built-ins');
var InternalStateModule = require('../internals/internal-state');
var getBuiltIn = require('../internals/get-built-in');
var AsyncIteratorPrototype = require('../internals/async-iterator-prototype');
var createIterResultObject = require('../internals/create-iter-result-object');
var Promise = getBuiltIn('Promise');
var ASYNC_FROM_SYNC_ITERATOR = 'AsyncFromSyncIterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ASYNC_FROM_SYNC_ITERATOR);
var asyncFromSyncIteratorContinuation = function asyncFromSyncIteratorContinuation(result, resolve, reject) {
  var done = result.done;
  Promise.resolve(result.value).then(function (value) {
    resolve(createIterResultObject(value, done));
  }, reject);
};
var AsyncFromSyncIterator = function AsyncIterator(iteratorRecord) {
  iteratorRecord.type = ASYNC_FROM_SYNC_ITERATOR;
  setInternalState(this, iteratorRecord);
};
AsyncFromSyncIterator.prototype = defineBuiltIns(create(AsyncIteratorPrototype), {
  next: function next() {
    var state = getInternalState(this);
    return new Promise(function (resolve, reject) {
      var result = anObject(call(state.next, state.iterator));
      asyncFromSyncIteratorContinuation(result, resolve, reject);
    });
  },
  'return': function _return() {
    var iterator = getInternalState(this).iterator;
    return new Promise(function (resolve, reject) {
      var $return = getMethod(iterator, 'return');
      if ($return === undefined) return resolve(createIterResultObject(undefined, true));
      var result = anObject(call($return, iterator));
      asyncFromSyncIteratorContinuation(result, resolve, reject);
    });
  }
});
module.exports = AsyncFromSyncIterator;

},{"../internals/an-object":11,"../internals/async-iterator-prototype":47,"../internals/create-iter-result-object":61,"../internals/define-built-ins":69,"../internals/function-call":106,"../internals/get-built-in":113,"../internals/get-method":119,"../internals/internal-state":134,"../internals/object-create":177}],43:[function(require,module,exports){
"use strict";

var call = require('../internals/function-call');
var getBuiltIn = require('../internals/get-built-in');
var getMethod = require('../internals/get-method');
module.exports = function (iterator, method, argument, reject) {
  try {
    var returnMethod = getMethod(iterator, 'return');
    if (returnMethod) {
      return getBuiltIn('Promise').resolve(call(returnMethod, iterator)).then(function () {
        method(argument);
      }, function (error) {
        reject(error);
      });
    }
  } catch (error2) {
    return reject(error2);
  }
  method(argument);
};

},{"../internals/function-call":106,"../internals/get-built-in":113,"../internals/get-method":119}],44:[function(require,module,exports){
'use strict';

var call = require('../internals/function-call');
var perform = require('../internals/perform');
var anObject = require('../internals/an-object');
var create = require('../internals/object-create');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var defineBuiltIns = require('../internals/define-built-ins');
var wellKnownSymbol = require('../internals/well-known-symbol');
var InternalStateModule = require('../internals/internal-state');
var getBuiltIn = require('../internals/get-built-in');
var getMethod = require('../internals/get-method');
var AsyncIteratorPrototype = require('../internals/async-iterator-prototype');
var createIterResultObject = require('../internals/create-iter-result-object');
var iteratorClose = require('../internals/iterator-close');
var Promise = getBuiltIn('Promise');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ASYNC_ITERATOR_HELPER = 'AsyncIteratorHelper';
var WRAP_FOR_VALID_ASYNC_ITERATOR = 'WrapForValidAsyncIterator';
var setInternalState = InternalStateModule.set;
var createAsyncIteratorProxyPrototype = function createAsyncIteratorProxyPrototype(IS_ITERATOR) {
  var IS_GENERATOR = !IS_ITERATOR;
  var getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ASYNC_ITERATOR : ASYNC_ITERATOR_HELPER);
  var getStateOrEarlyExit = function getStateOrEarlyExit(that) {
    var stateCompletion = perform(function () {
      return getInternalState(that);
    });
    var stateError = stateCompletion.error;
    var state = stateCompletion.value;
    if (stateError || IS_GENERATOR && state.done) {
      return {
        exit: true,
        value: stateError ? Promise.reject(state) : Promise.resolve(createIterResultObject(undefined, true))
      };
    }
    return {
      exit: false,
      value: state
    };
  };
  return defineBuiltIns(create(AsyncIteratorPrototype), {
    next: function next() {
      var stateCompletion = getStateOrEarlyExit(this);
      var state = stateCompletion.value;
      if (stateCompletion.exit) return state;
      var handlerCompletion = perform(function () {
        return anObject(state.nextHandler(Promise));
      });
      var handlerError = handlerCompletion.error;
      var value = handlerCompletion.value;
      if (handlerError) state.done = true;
      return handlerError ? Promise.reject(value) : Promise.resolve(value);
    },
    'return': function _return() {
      var stateCompletion = getStateOrEarlyExit(this);
      var state = stateCompletion.value;
      if (stateCompletion.exit) return state;
      state.done = true;
      var iterator = state.iterator;
      var returnMethod, result;
      var completion = perform(function () {
        if (state.inner) try {
          iteratorClose(state.inner.iterator, 'normal');
        } catch (error) {
          return iteratorClose(iterator, 'throw', error);
        }
        return getMethod(iterator, 'return');
      });
      returnMethod = result = completion.value;
      if (completion.error) return Promise.reject(result);
      if (returnMethod === undefined) return Promise.resolve(createIterResultObject(undefined, true));
      completion = perform(function () {
        return call(returnMethod, iterator);
      });
      result = completion.value;
      if (completion.error) return Promise.reject(result);
      return IS_ITERATOR ? Promise.resolve(result) : Promise.resolve(result).then(function (resolved) {
        anObject(resolved);
        return createIterResultObject(undefined, true);
      });
    }
  });
};
var WrapForValidAsyncIteratorPrototype = createAsyncIteratorProxyPrototype(true);
var AsyncIteratorHelperPrototype = createAsyncIteratorProxyPrototype(false);
createNonEnumerableProperty(AsyncIteratorHelperPrototype, TO_STRING_TAG, 'Async Iterator Helper');
module.exports = function (nextHandler, IS_ITERATOR) {
  var AsyncIteratorProxy = function AsyncIterator(record, state) {
    if (state) {
      state.iterator = record.iterator;
      state.next = record.next;
    } else state = record;
    state.type = IS_ITERATOR ? WRAP_FOR_VALID_ASYNC_ITERATOR : ASYNC_ITERATOR_HELPER;
    state.nextHandler = nextHandler;
    state.counter = 0;
    state.done = false;
    setInternalState(this, state);
  };
  AsyncIteratorProxy.prototype = IS_ITERATOR ? WrapForValidAsyncIteratorPrototype : AsyncIteratorHelperPrototype;
  return AsyncIteratorProxy;
};

},{"../internals/an-object":11,"../internals/async-iterator-prototype":47,"../internals/create-iter-result-object":61,"../internals/create-non-enumerable-property":62,"../internals/define-built-ins":69,"../internals/function-call":106,"../internals/get-built-in":113,"../internals/get-method":119,"../internals/internal-state":134,"../internals/iterator-close":151,"../internals/object-create":177,"../internals/perform":198,"../internals/well-known-symbol":277}],45:[function(require,module,exports){
'use strict';

// https://github.com/tc39/proposal-iterator-helpers
// https://github.com/tc39/proposal-array-from-async
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var doesNotExceedSafeInteger = require('../internals/does-not-exceed-safe-integer');
var getBuiltIn = require('../internals/get-built-in');
var getIteratorDirect = require('../internals/get-iterator-direct');
var closeAsyncIteration = require('../internals/async-iterator-close');
var createMethod = function createMethod(TYPE) {
  var IS_TO_ARRAY = TYPE == 0;
  var IS_FOR_EACH = TYPE == 1;
  var IS_EVERY = TYPE == 2;
  var IS_SOME = TYPE == 3;
  return function (object, fn, target) {
    var record = getIteratorDirect(object);
    var Promise = getBuiltIn('Promise');
    var iterator = record.iterator;
    var next = record.next;
    var counter = 0;
    var MAPPING = fn !== undefined;
    if (MAPPING || !IS_TO_ARRAY) aCallable(fn);
    return new Promise(function (resolve, reject) {
      var ifAbruptCloseAsyncIterator = function ifAbruptCloseAsyncIterator(error) {
        closeAsyncIteration(iterator, reject, error, reject);
      };
      var loop = function loop() {
        try {
          if (MAPPING) try {
            doesNotExceedSafeInteger(counter);
          } catch (error5) {
            ifAbruptCloseAsyncIterator(error5);
          }
          Promise.resolve(anObject(call(next, iterator))).then(function (step) {
            try {
              if (anObject(step).done) {
                if (IS_TO_ARRAY) {
                  target.length = counter;
                  resolve(target);
                } else resolve(IS_SOME ? false : IS_EVERY || undefined);
              } else {
                var value = step.value;
                try {
                  if (MAPPING) {
                    var result = fn(value, counter);
                    var handler = function handler($result) {
                      if (IS_FOR_EACH) {
                        loop();
                      } else if (IS_EVERY) {
                        $result ? loop() : closeAsyncIteration(iterator, resolve, false, reject);
                      } else if (IS_TO_ARRAY) {
                        try {
                          target[counter++] = $result;
                          loop();
                        } catch (error4) {
                          ifAbruptCloseAsyncIterator(error4);
                        }
                      } else {
                        $result ? closeAsyncIteration(iterator, resolve, IS_SOME || value, reject) : loop();
                      }
                    };
                    if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator);else handler(result);
                  } else {
                    target[counter++] = value;
                    loop();
                  }
                } catch (error3) {
                  ifAbruptCloseAsyncIterator(error3);
                }
              }
            } catch (error2) {
              reject(error2);
            }
          }, reject);
        } catch (error) {
          reject(error);
        }
      };
      loop();
    });
  };
};
module.exports = {
  toArray: createMethod(0),
  forEach: createMethod(1),
  every: createMethod(2),
  some: createMethod(3),
  find: createMethod(4)
};

},{"../internals/a-callable":3,"../internals/an-object":11,"../internals/async-iterator-close":43,"../internals/does-not-exceed-safe-integer":75,"../internals/function-call":106,"../internals/get-built-in":113,"../internals/get-iterator-direct":114,"../internals/is-object":144}],46:[function(require,module,exports){
'use strict';

var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var getIteratorDirect = require('../internals/get-iterator-direct');
var createAsyncIteratorProxy = require('../internals/async-iterator-create-proxy');
var createIterResultObject = require('../internals/create-iter-result-object');
var closeAsyncIteration = require('../internals/async-iterator-close');
var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise) {
  var state = this;
  var iterator = state.iterator;
  var mapper = state.mapper;
  return new Promise(function (resolve, reject) {
    var doneAndReject = function doneAndReject(error) {
      state.done = true;
      reject(error);
    };
    var ifAbruptCloseAsyncIterator = function ifAbruptCloseAsyncIterator(error) {
      closeAsyncIteration(iterator, doneAndReject, error, doneAndReject);
    };
    Promise.resolve(anObject(call(state.next, iterator))).then(function (step) {
      try {
        if (anObject(step).done) {
          state.done = true;
          resolve(createIterResultObject(undefined, true));
        } else {
          var value = step.value;
          try {
            var result = mapper(value, state.counter++);
            var handler = function handler(mapped) {
              resolve(createIterResultObject(mapped, false));
            };
            if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator);else handler(result);
          } catch (error2) {
            ifAbruptCloseAsyncIterator(error2);
          }
        }
      } catch (error) {
        doneAndReject(error);
      }
    }, doneAndReject);
  });
});

// `AsyncIterator.prototype.map` method
// https://github.com/tc39/proposal-iterator-helpers
module.exports = function map(mapper) {
  return new AsyncIteratorProxy(getIteratorDirect(this), {
    mapper: aCallable(mapper)
  });
};

},{"../internals/a-callable":3,"../internals/an-object":11,"../internals/async-iterator-close":43,"../internals/async-iterator-create-proxy":44,"../internals/create-iter-result-object":61,"../internals/function-call":106,"../internals/get-iterator-direct":114,"../internals/is-object":144}],47:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var shared = require('../internals/shared-store');
var isCallable = require('../internals/is-callable');
var create = require('../internals/object-create');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var defineBuiltIn = require('../internals/define-built-in');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');
var USE_FUNCTION_CONSTRUCTOR = 'USE_FUNCTION_CONSTRUCTOR';
var ASYNC_ITERATOR = wellKnownSymbol('asyncIterator');
var AsyncIterator = global.AsyncIterator;
var PassedAsyncIteratorPrototype = shared.AsyncIteratorPrototype;
var AsyncIteratorPrototype, prototype;
if (PassedAsyncIteratorPrototype) {
  AsyncIteratorPrototype = PassedAsyncIteratorPrototype;
} else if (isCallable(AsyncIterator)) {
  AsyncIteratorPrototype = AsyncIterator.prototype;
} else if (shared[USE_FUNCTION_CONSTRUCTOR] || global[USE_FUNCTION_CONSTRUCTOR]) {
  try {
    // eslint-disable-next-line no-new-func -- we have no alternatives without usage of modern syntax
    prototype = getPrototypeOf(getPrototypeOf(getPrototypeOf(Function('return async function*(){}()')())));
    if (getPrototypeOf(prototype) === Object.prototype) AsyncIteratorPrototype = prototype;
  } catch (error) {/* empty */}
}
if (!AsyncIteratorPrototype) AsyncIteratorPrototype = {};else if (IS_PURE) AsyncIteratorPrototype = create(AsyncIteratorPrototype);
if (!isCallable(AsyncIteratorPrototype[ASYNC_ITERATOR])) {
  defineBuiltIn(AsyncIteratorPrototype, ASYNC_ITERATOR, function () {
    return this;
  });
}
module.exports = AsyncIteratorPrototype;

},{"../internals/define-built-in":68,"../internals/global":122,"../internals/is-callable":138,"../internals/is-pure":145,"../internals/object-create":177,"../internals/object-get-prototype-of":184,"../internals/shared-store":230,"../internals/well-known-symbol":277}],48:[function(require,module,exports){
"use strict";

var call = require('../internals/function-call');
var createAsyncIteratorProxy = require('../internals/async-iterator-create-proxy');
module.exports = createAsyncIteratorProxy(function () {
  return call(this.next, this.iterator);
}, true);

},{"../internals/async-iterator-create-proxy":44,"../internals/function-call":106}],49:[function(require,module,exports){
"use strict";

var itoc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var ctoi = {};
for (var index = 0; index < 66; index++) ctoi[itoc.charAt(index)] = index;
module.exports = {
  itoc: itoc,
  ctoi: ctoi
};

},{}],50:[function(require,module,exports){
"use strict";

var anObject = require('../internals/an-object');
var iteratorClose = require('../internals/iterator-close');

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};

},{"../internals/an-object":11,"../internals/iterator-close":151}],51:[function(require,module,exports){
"use strict";

var wellKnownSymbol = require('../internals/well-known-symbol');
var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;
try {
  var called = 0;
  var iteratorWithReturn = {
    next: function next() {
      return {
        done: !!called++
      };
    },
    'return': function _return() {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () {
    throw 2;
  });
} catch (error) {/* empty */}
module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function next() {
          return {
            done: ITERATION_SUPPORT = true
          };
        }
      };
    };
    exec(object);
  } catch (error) {/* empty */}
  return ITERATION_SUPPORT;
};

},{"../internals/well-known-symbol":277}],52:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);
module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};

},{"../internals/function-uncurry-this":110}],53:[function(require,module,exports){
"use strict";

var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var isCallable = require('../internals/is-callable');
var classofRaw = require('../internals/classof-raw');
var wellKnownSymbol = require('../internals/well-known-symbol');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (error) {/* empty */}
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
  // builtinTag case
  : CORRECT_ARGUMENTS ? classofRaw(O)
  // ES3 arguments fallback
  : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};

},{"../internals/classof-raw":52,"../internals/is-callable":138,"../internals/to-string-tag-support":260,"../internals/well-known-symbol":277}],54:[function(require,module,exports){
'use strict';

var create = require('../internals/object-create');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var defineBuiltIns = require('../internals/define-built-ins');
var bind = require('../internals/function-bind-context');
var anInstance = require('../internals/an-instance');
var isNullOrUndefined = require('../internals/is-null-or-undefined');
var iterate = require('../internals/iterate');
var defineIterator = require('../internals/iterator-define');
var createIterResultObject = require('../internals/create-iter-result-object');
var setSpecies = require('../internals/set-species');
var DESCRIPTORS = require('../internals/descriptors');
var fastKey = require('../internals/internal-metadata').fastKey;
var InternalStateModule = require('../internals/internal-state');
var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;
module.exports = {
  getConstructor: function getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var Constructor = wrapper(function (that, iterable) {
      anInstance(that, Prototype);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        index: create(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!DESCRIPTORS) that.size = 0;
      if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], {
        that: that,
        AS_ENTRIES: IS_MAP
      });
    });
    var Prototype = Constructor.prototype;
    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var define = function define(that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
        // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (DESCRIPTORS) state.size++;else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      }
      return that;
    };
    var getEntry = function getEntry(that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };
    defineBuiltIns(Prototype, {
      // `{ Map, Set }.prototype.clear()` methods
      // https://tc39.es/ecma262/#sec-map.prototype.clear
      // https://tc39.es/ecma262/#sec-set.prototype.clear
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (DESCRIPTORS) state.size = 0;else that.size = 0;
      },
      // `{ Map, Set }.prototype.delete(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.delete
      // https://tc39.es/ecma262/#sec-set.prototype.delete
      'delete': function _delete(key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (DESCRIPTORS) state.size--;else that.size--;
        }
        return !!entry;
      },
      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.foreach
      // https://tc39.es/ecma262/#sec-set.prototype.foreach
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // `{ Map, Set}.prototype.has(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.has
      // https://tc39.es/ecma262/#sec-set.prototype.has
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });
    defineBuiltIns(Prototype, IS_MAP ? {
      // `Map.prototype.get(key)` method
      // https://tc39.es/ecma262/#sec-map.prototype.get
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // `Map.prototype.set(key, value)` method
      // https://tc39.es/ecma262/#sec-map.prototype.set
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // `Set.prototype.add(value)` method
      // https://tc39.es/ecma262/#sec-set.prototype.add
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (DESCRIPTORS) defineBuiltInAccessor(Prototype, 'size', {
      configurable: true,
      get: function get() {
        return getInternalState(this).size;
      }
    });
    return Constructor;
  },
  setStrong: function setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
    // https://tc39.es/ecma262/#sec-map.prototype.entries
    // https://tc39.es/ecma262/#sec-map.prototype.keys
    // https://tc39.es/ecma262/#sec-map.prototype.values
    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
    // https://tc39.es/ecma262/#sec-set.prototype.entries
    // https://tc39.es/ecma262/#sec-set.prototype.keys
    // https://tc39.es/ecma262/#sec-set.prototype.values
    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
    defineIterator(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return createIterResultObject(undefined, true);
      }
      // return step by kind
      if (kind == 'keys') return createIterResultObject(entry.key, false);
      if (kind == 'values') return createIterResultObject(entry.value, false);
      return createIterResultObject([entry.key, entry.value], false);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // `{ Map, Set }.prototype[@@species]` accessors
    // https://tc39.es/ecma262/#sec-get-map-@@species
    // https://tc39.es/ecma262/#sec-get-set-@@species
    setSpecies(CONSTRUCTOR_NAME);
  }
};

},{"../internals/an-instance":10,"../internals/create-iter-result-object":61,"../internals/define-built-in-accessor":67,"../internals/define-built-ins":69,"../internals/descriptors":72,"../internals/function-bind-context":103,"../internals/internal-metadata":133,"../internals/internal-state":134,"../internals/is-null-or-undefined":143,"../internals/iterate":150,"../internals/iterator-define":154,"../internals/object-create":177,"../internals/set-species":225}],55:[function(require,module,exports){
'use strict';

var uncurryThis = require('../internals/function-uncurry-this');
var defineBuiltIns = require('../internals/define-built-ins');
var getWeakData = require('../internals/internal-metadata').getWeakData;
var anInstance = require('../internals/an-instance');
var anObject = require('../internals/an-object');
var isNullOrUndefined = require('../internals/is-null-or-undefined');
var isObject = require('../internals/is-object');
var iterate = require('../internals/iterate');
var ArrayIterationModule = require('../internals/array-iteration');
var hasOwn = require('../internals/has-own-property');
var InternalStateModule = require('../internals/internal-state');
var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;
var find = ArrayIterationModule.find;
var findIndex = ArrayIterationModule.findIndex;
var splice = uncurryThis([].splice);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function uncaughtFrozenStore(state) {
  return state.frozen || (state.frozen = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function UncaughtFrozenStore() {
  this.entries = [];
};
var findUncaughtFrozen = function findUncaughtFrozen(store, key) {
  return find(store.entries, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function get(key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function has(key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function set(key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;else this.entries.push([key, value]);
  },
  'delete': function _delete(key) {
    var index = findIndex(this.entries, function (it) {
      return it[0] === key;
    });
    if (~index) splice(this.entries, index, 1);
    return !!~index;
  }
};
module.exports = {
  getConstructor: function getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var Constructor = wrapper(function (that, iterable) {
      anInstance(that, Prototype);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        id: id++,
        frozen: undefined
      });
      if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], {
        that: that,
        AS_ENTRIES: IS_MAP
      });
    });
    var Prototype = Constructor.prototype;
    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var define = function define(that, key, value) {
      var state = getInternalState(that);
      var data = getWeakData(anObject(key), true);
      if (data === true) uncaughtFrozenStore(state).set(key, value);else data[state.id] = value;
      return that;
    };
    defineBuiltIns(Prototype, {
      // `{ WeakMap, WeakSet }.prototype.delete(key)` methods
      // https://tc39.es/ecma262/#sec-weakmap.prototype.delete
      // https://tc39.es/ecma262/#sec-weakset.prototype.delete
      'delete': function _delete(key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
        return data && hasOwn(data, state.id) && delete data[state.id];
      },
      // `{ WeakMap, WeakSet }.prototype.has(key)` methods
      // https://tc39.es/ecma262/#sec-weakmap.prototype.has
      // https://tc39.es/ecma262/#sec-weakset.prototype.has
      has: function has(key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state).has(key);
        return data && hasOwn(data, state.id);
      }
    });
    defineBuiltIns(Prototype, IS_MAP ? {
      // `WeakMap.prototype.get(key)` method
      // https://tc39.es/ecma262/#sec-weakmap.prototype.get
      get: function get(key) {
        var state = getInternalState(this);
        if (isObject(key)) {
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).get(key);
          return data ? data[state.id] : undefined;
        }
      },
      // `WeakMap.prototype.set(key, value)` method
      // https://tc39.es/ecma262/#sec-weakmap.prototype.set
      set: function set(key, value) {
        return define(this, key, value);
      }
    } : {
      // `WeakSet.prototype.add(value)` method
      // https://tc39.es/ecma262/#sec-weakset.prototype.add
      add: function add(value) {
        return define(this, value, true);
      }
    });
    return Constructor;
  }
};

},{"../internals/an-instance":10,"../internals/an-object":11,"../internals/array-iteration":29,"../internals/define-built-ins":69,"../internals/function-uncurry-this":110,"../internals/has-own-property":123,"../internals/internal-metadata":133,"../internals/internal-state":134,"../internals/is-null-or-undefined":143,"../internals/is-object":144,"../internals/iterate":150}],56:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var isForced = require('../internals/is-forced');
var defineBuiltIn = require('../internals/define-built-in');
var InternalMetadataModule = require('../internals/internal-metadata');
var iterate = require('../internals/iterate');
var anInstance = require('../internals/an-instance');
var isCallable = require('../internals/is-callable');
var isNullOrUndefined = require('../internals/is-null-or-undefined');
var isObject = require('../internals/is-object');
var fails = require('../internals/fails');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var setToStringTag = require('../internals/set-to-string-tag');
var inheritIfRequired = require('../internals/inherit-if-required');
module.exports = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var exported = {};
  var fixMethod = function fixMethod(KEY) {
    var uncurriedNativeMethod = uncurryThis(NativePrototype[KEY]);
    defineBuiltIn(NativePrototype, KEY, KEY == 'add' ? function add(value) {
      uncurriedNativeMethod(this, value === 0 ? 0 : value);
      return this;
    } : KEY == 'delete' ? function (key) {
      return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
    } : KEY == 'get' ? function get(key) {
      return IS_WEAK && !isObject(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
    } : KEY == 'has' ? function has(key) {
      return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
    } : function set(key, value) {
      uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
      return this;
    });
  };
  var REPLACE = isForced(CONSTRUCTOR_NAME, !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
    new NativeConstructor().entries().next();
  })));
  if (REPLACE) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.enable();
  } else if (isForced(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () {
      instance.has(1);
    });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new -- required for testing
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) {
      new NativeConstructor(iterable);
    });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, NativePrototype);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], {
          that: that,
          AS_ENTRIES: IS_MAP
        });
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }
  exported[CONSTRUCTOR_NAME] = Constructor;
  $({
    global: true,
    constructor: true,
    forced: Constructor != NativeConstructor
  }, exported);
  setToStringTag(Constructor, CONSTRUCTOR_NAME);
  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);
  return Constructor;
};

},{"../internals/an-instance":10,"../internals/check-correctness-of-iteration":51,"../internals/define-built-in":68,"../internals/export":97,"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/global":122,"../internals/inherit-if-required":130,"../internals/internal-metadata":133,"../internals/is-callable":138,"../internals/is-forced":141,"../internals/is-null-or-undefined":143,"../internals/is-object":144,"../internals/iterate":150,"../internals/set-to-string-tag":227}],57:[function(require,module,exports){
"use strict";

var hasOwn = require('../internals/has-own-property');
var ownKeys = require('../internals/own-keys');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');
module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

},{"../internals/has-own-property":123,"../internals/object-define-property":179,"../internals/object-get-own-property-descriptor":180,"../internals/own-keys":195}],58:[function(require,module,exports){
"use strict";

var wellKnownSymbol = require('../internals/well-known-symbol');
var MATCH = wellKnownSymbol('match');
module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) {/* empty */}
  }
  return false;
};

},{"../internals/well-known-symbol":277}],59:[function(require,module,exports){
"use strict";

var fails = require('../internals/fails');
module.exports = !fails(function () {
  function F() {/* empty */}
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

},{"../internals/fails":98}],60:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toString = require('../internals/to-string');
var quot = /"/g;
var replace = uncurryThis(''.replace);

// `CreateHTML` abstract operation
// https://tc39.es/ecma262/#sec-createhtml
module.exports = function (string, tag, attribute, value) {
  var S = toString(requireObjectCoercible(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + replace(toString(value), quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};

},{"../internals/function-uncurry-this":110,"../internals/require-object-coercible":212,"../internals/to-string":261}],61:[function(require,module,exports){
"use strict";

// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return {
    value: value,
    done: done
  };
};

},{}],62:[function(require,module,exports){
"use strict";

var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"../internals/create-property-descriptor":63,"../internals/descriptors":72,"../internals/object-define-property":179}],63:[function(require,module,exports){
"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],64:[function(require,module,exports){
'use strict';

var toPropertyKey = require('../internals/to-property-key');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
module.exports = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
};

},{"../internals/create-property-descriptor":63,"../internals/object-define-property":179,"../internals/to-property-key":259}],65:[function(require,module,exports){
'use strict';

var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var padStart = require('../internals/string-pad').start;
var $RangeError = RangeError;
var $isFinite = isFinite;
var abs = Math.abs;
var DatePrototype = Date.prototype;
var nativeDateToISOString = DatePrototype.toISOString;
var thisTimeValue = uncurryThis(DatePrototype.getTime);
var getUTCDate = uncurryThis(DatePrototype.getUTCDate);
var getUTCFullYear = uncurryThis(DatePrototype.getUTCFullYear);
var getUTCHours = uncurryThis(DatePrototype.getUTCHours);
var getUTCMilliseconds = uncurryThis(DatePrototype.getUTCMilliseconds);
var getUTCMinutes = uncurryThis(DatePrototype.getUTCMinutes);
var getUTCMonth = uncurryThis(DatePrototype.getUTCMonth);
var getUTCSeconds = uncurryThis(DatePrototype.getUTCSeconds);

// `Date.prototype.toISOString` method implementation
// https://tc39.es/ecma262/#sec-date.prototype.toisostring
// PhantomJS / old WebKit fails here:
module.exports = fails(function () {
  return nativeDateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  nativeDateToISOString.call(new Date(NaN));
}) ? function toISOString() {
  if (!$isFinite(thisTimeValue(this))) throw $RangeError('Invalid time value');
  var date = this;
  var year = getUTCFullYear(date);
  var milliseconds = getUTCMilliseconds(date);
  var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
  return sign + padStart(abs(year), sign ? 6 : 4, 0) + '-' + padStart(getUTCMonth(date) + 1, 2, 0) + '-' + padStart(getUTCDate(date), 2, 0) + 'T' + padStart(getUTCHours(date), 2, 0) + ':' + padStart(getUTCMinutes(date), 2, 0) + ':' + padStart(getUTCSeconds(date), 2, 0) + '.' + padStart(milliseconds, 3, 0) + 'Z';
} : nativeDateToISOString;

},{"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/string-pad":236}],66:[function(require,module,exports){
'use strict';

var anObject = require('../internals/an-object');
var ordinaryToPrimitive = require('../internals/ordinary-to-primitive');
var $TypeError = TypeError;

// `Date.prototype[@@toPrimitive](hint)` method implementation
// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
module.exports = function (hint) {
  anObject(this);
  if (hint === 'string' || hint === 'default') hint = 'string';else if (hint !== 'number') throw $TypeError('Incorrect hint');
  return ordinaryToPrimitive(this, hint);
};

},{"../internals/an-object":11,"../internals/ordinary-to-primitive":194}],67:[function(require,module,exports){
"use strict";

var makeBuiltIn = require('../internals/make-built-in');
var defineProperty = require('../internals/object-define-property');
module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, {
    getter: true
  });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, {
    setter: true
  });
  return defineProperty.f(target, name, descriptor);
};

},{"../internals/make-built-in":159,"../internals/object-define-property":179}],68:[function(require,module,exports){
"use strict";

var isCallable = require('../internals/is-callable');
var definePropertyModule = require('../internals/object-define-property');
var makeBuiltIn = require('../internals/make-built-in');
var defineGlobalProperty = require('../internals/define-global-property');
module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];else if (O[key]) simple = true;
    } catch (error) {/* empty */}
    if (simple) O[key] = value;else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  }
  return O;
};

},{"../internals/define-global-property":70,"../internals/is-callable":138,"../internals/make-built-in":159,"../internals/object-define-property":179}],69:[function(require,module,exports){
"use strict";

var defineBuiltIn = require('../internals/define-built-in');
module.exports = function (target, src, options) {
  for (var key in src) defineBuiltIn(target, key, src[key], options);
  return target;
};

},{"../internals/define-built-in":68}],70:[function(require,module,exports){
"use strict";

var global = require('../internals/global');

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
module.exports = function (key, value) {
  try {
    defineProperty(global, key, {
      value: value,
      configurable: true,
      writable: true
    });
  } catch (error) {
    global[key] = value;
  }
  return value;
};

},{"../internals/global":122}],71:[function(require,module,exports){
'use strict';

var tryToString = require('../internals/try-to-string');
var $TypeError = TypeError;
module.exports = function (O, P) {
  if (!delete O[P]) throw $TypeError('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
};

},{"../internals/try-to-string":263}],72:[function(require,module,exports){
"use strict";

var fails = require('../internals/fails');

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, {
    get: function get() {
      return 7;
    }
  })[1] != 7;
});

},{"../internals/fails":98}],73:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var documentAll = (typeof document === "undefined" ? "undefined" : _typeof(document)) == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;
module.exports = {
  all: documentAll,
  IS_HTMLDDA: IS_HTMLDDA
};

},{}],74:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var isObject = require('../internals/is-object');
var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

},{"../internals/global":122,"../internals/is-object":144}],75:[function(require,module,exports){
"use strict";

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};

},{}],76:[function(require,module,exports){
"use strict";

module.exports = {
  IndexSizeError: {
    s: 'INDEX_SIZE_ERR',
    c: 1,
    m: 1
  },
  DOMStringSizeError: {
    s: 'DOMSTRING_SIZE_ERR',
    c: 2,
    m: 0
  },
  HierarchyRequestError: {
    s: 'HIERARCHY_REQUEST_ERR',
    c: 3,
    m: 1
  },
  WrongDocumentError: {
    s: 'WRONG_DOCUMENT_ERR',
    c: 4,
    m: 1
  },
  InvalidCharacterError: {
    s: 'INVALID_CHARACTER_ERR',
    c: 5,
    m: 1
  },
  NoDataAllowedError: {
    s: 'NO_DATA_ALLOWED_ERR',
    c: 6,
    m: 0
  },
  NoModificationAllowedError: {
    s: 'NO_MODIFICATION_ALLOWED_ERR',
    c: 7,
    m: 1
  },
  NotFoundError: {
    s: 'NOT_FOUND_ERR',
    c: 8,
    m: 1
  },
  NotSupportedError: {
    s: 'NOT_SUPPORTED_ERR',
    c: 9,
    m: 1
  },
  InUseAttributeError: {
    s: 'INUSE_ATTRIBUTE_ERR',
    c: 10,
    m: 1
  },
  InvalidStateError: {
    s: 'INVALID_STATE_ERR',
    c: 11,
    m: 1
  },
  SyntaxError: {
    s: 'SYNTAX_ERR',
    c: 12,
    m: 1
  },
  InvalidModificationError: {
    s: 'INVALID_MODIFICATION_ERR',
    c: 13,
    m: 1
  },
  NamespaceError: {
    s: 'NAMESPACE_ERR',
    c: 14,
    m: 1
  },
  InvalidAccessError: {
    s: 'INVALID_ACCESS_ERR',
    c: 15,
    m: 1
  },
  ValidationError: {
    s: 'VALIDATION_ERR',
    c: 16,
    m: 0
  },
  TypeMismatchError: {
    s: 'TYPE_MISMATCH_ERR',
    c: 17,
    m: 1
  },
  SecurityError: {
    s: 'SECURITY_ERR',
    c: 18,
    m: 1
  },
  NetworkError: {
    s: 'NETWORK_ERR',
    c: 19,
    m: 1
  },
  AbortError: {
    s: 'ABORT_ERR',
    c: 20,
    m: 1
  },
  URLMismatchError: {
    s: 'URL_MISMATCH_ERR',
    c: 21,
    m: 1
  },
  QuotaExceededError: {
    s: 'QUOTA_EXCEEDED_ERR',
    c: 22,
    m: 1
  },
  TimeoutError: {
    s: 'TIMEOUT_ERR',
    c: 23,
    m: 1
  },
  InvalidNodeTypeError: {
    s: 'INVALID_NODE_TYPE_ERR',
    c: 24,
    m: 1
  },
  DataCloneError: {
    s: 'DATA_CLONE_ERR',
    c: 25,
    m: 1
  }
};

},{}],77:[function(require,module,exports){
"use strict";

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

},{}],78:[function(require,module,exports){
"use strict";

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = require('../internals/document-create-element');
var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;
module.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;

},{"../internals/document-create-element":74}],79:[function(require,module,exports){
"use strict";

var userAgent = require('../internals/engine-user-agent');
var firefox = userAgent.match(/firefox\/(\d+)/i);
module.exports = !!firefox && +firefox[1];

},{"../internals/engine-user-agent":88}],80:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var IS_DENO = require('../internals/engine-is-deno');
var IS_NODE = require('../internals/engine-is-node');
module.exports = !IS_DENO && !IS_NODE && (typeof window === "undefined" ? "undefined" : _typeof(window)) == 'object' && (typeof document === "undefined" ? "undefined" : _typeof(document)) == 'object';

},{"../internals/engine-is-deno":82,"../internals/engine-is-node":86}],81:[function(require,module,exports){
"use strict";

/* global Bun -- Deno case */
module.exports = typeof Bun == 'function' && Bun && typeof Bun.version == 'string';

},{}],82:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/* global Deno -- Deno case */
module.exports = (typeof Deno === "undefined" ? "undefined" : _typeof(Deno)) == 'object' && Deno && _typeof(Deno.version) == 'object';

},{}],83:[function(require,module,exports){
"use strict";

var UA = require('../internals/engine-user-agent');
module.exports = /MSIE|Trident/.test(UA);

},{"../internals/engine-user-agent":88}],84:[function(require,module,exports){
"use strict";

var userAgent = require('../internals/engine-user-agent');
module.exports = /ipad|iphone|ipod/i.test(userAgent) && typeof Pebble != 'undefined';

},{"../internals/engine-user-agent":88}],85:[function(require,module,exports){
"use strict";

var userAgent = require('../internals/engine-user-agent');

// eslint-disable-next-line redos/no-vulnerable -- safe
module.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);

},{"../internals/engine-user-agent":88}],86:[function(require,module,exports){
(function (process){(function (){
"use strict";

var classof = require('../internals/classof-raw');
module.exports = typeof process != 'undefined' && classof(process) == 'process';

}).call(this)}).call(this,require('_process'))
},{"../internals/classof-raw":52,"_process":689}],87:[function(require,module,exports){
"use strict";

var userAgent = require('../internals/engine-user-agent');
module.exports = /web0s(?!.*chrome)/i.test(userAgent);

},{"../internals/engine-user-agent":88}],88:[function(require,module,exports){
"use strict";

module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';

},{}],89:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var userAgent = require('../internals/engine-user-agent');
var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;
if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}
module.exports = version;

},{"../internals/engine-user-agent":88,"../internals/global":122}],90:[function(require,module,exports){
"use strict";

var userAgent = require('../internals/engine-user-agent');
var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);
module.exports = !!webkit && +webkit[1];

},{"../internals/engine-user-agent":88}],91:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
module.exports = function (CONSTRUCTOR) {
  return global[CONSTRUCTOR].prototype;
};

},{"../internals/global":122}],92:[function(require,module,exports){
"use strict";

// IE8- don't enum bug keys
module.exports = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

},{}],93:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var $Error = Error;
var replace = uncurryThis(''.replace);
var TEST = function (arg) {
  return String($Error(arg).stack);
}('zxcasd');
// eslint-disable-next-line redos/no-vulnerable -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);
module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  }
  return stack;
};

},{"../internals/function-uncurry-this":110}],94:[function(require,module,exports){
"use strict";

var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var clearErrorStack = require('../internals/error-stack-clear');
var ERROR_STACK_INSTALLABLE = require('../internals/error-stack-installable');

// non-standard V8
var captureStackTrace = Error.captureStackTrace;
module.exports = function (error, C, stack, dropEntries) {
  if (ERROR_STACK_INSTALLABLE) {
    if (captureStackTrace) captureStackTrace(error, C);else createNonEnumerableProperty(error, 'stack', clearErrorStack(stack, dropEntries));
  }
};

},{"../internals/create-non-enumerable-property":62,"../internals/error-stack-clear":93,"../internals/error-stack-installable":95}],95:[function(require,module,exports){
"use strict";

var fails = require('../internals/fails');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
module.exports = !fails(function () {
  var error = Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});

},{"../internals/create-property-descriptor":63,"../internals/fails":98}],96:[function(require,module,exports){
'use strict';

var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var anObject = require('../internals/an-object');
var create = require('../internals/object-create');
var normalizeStringArgument = require('../internals/normalize-string-argument');
var nativeErrorToString = Error.prototype.toString;
var INCORRECT_TO_STRING = fails(function () {
  if (DESCRIPTORS) {
    // Chrome 32- incorrectly call accessor
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    var object = create(Object.defineProperty({}, 'name', {
      get: function get() {
        return this === object;
      }
    }));
    if (nativeErrorToString.call(object) !== 'true') return true;
  }
  // FF10- does not properly handle non-strings
  return nativeErrorToString.call({
    message: 1,
    name: 2
  }) !== '2: 1'
  // IE8 does not properly handle defaults
  || nativeErrorToString.call({}) !== 'Error';
});
module.exports = INCORRECT_TO_STRING ? function toString() {
  var O = anObject(this);
  var name = normalizeStringArgument(O.name, 'Error');
  var message = normalizeStringArgument(O.message);
  return !name ? message : !message ? name : name + ': ' + message;
} : nativeErrorToString;

},{"../internals/an-object":11,"../internals/descriptors":72,"../internals/fails":98,"../internals/normalize-string-argument":170,"../internals/object-create":177}],97:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var global = require('../internals/global');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var defineBuiltIn = require('../internals/define-built-in');
var defineGlobalProperty = require('../internals/define-global-property');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var isForced = require('../internals/is-forced');

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (_typeof(sourceProperty) == _typeof(targetProperty)) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || targetProperty && targetProperty.sham) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};

},{"../internals/copy-constructor-properties":57,"../internals/create-non-enumerable-property":62,"../internals/define-built-in":68,"../internals/define-global-property":70,"../internals/global":122,"../internals/is-forced":141,"../internals/object-get-own-property-descriptor":180}],98:[function(require,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

},{}],99:[function(require,module,exports){
'use strict';

// TODO: Remove from `core-js@4` since it's moved to entry points
require('../modules/es.regexp.exec');
var uncurryThis = require('../internals/function-uncurry-this-clause');
var defineBuiltIn = require('../internals/define-built-in');
var regexpExec = require('../internals/regexp-exec');
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var SPECIES = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;
module.exports = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);
  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () {
      return 7;
    };
    return ''[KEY](O) != 7;
  });
  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () {
        return re;
      };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }
    re.exec = function () {
      execCalled = true;
      return null;
    };
    re[SYMBOL]('');
    return !execCalled;
  });
  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || FORCED) {
    var uncurriedNativeRegExpMethod = uncurryThis(/./[SYMBOL]);
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var uncurriedNativeMethod = uncurryThis(nativeMethod);
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return {
            done: true,
            value: uncurriedNativeRegExpMethod(regexp, str, arg2)
          };
        }
        return {
          done: true,
          value: uncurriedNativeMethod(str, regexp, arg2)
        };
      }
      return {
        done: false
      };
    });
    defineBuiltIn(String.prototype, KEY, methods[0]);
    defineBuiltIn(RegExpPrototype, SYMBOL, methods[1]);
  }
  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
};

},{"../internals/create-non-enumerable-property":62,"../internals/define-built-in":68,"../internals/fails":98,"../internals/function-uncurry-this-clause":109,"../internals/regexp-exec":206,"../internals/well-known-symbol":277,"../modules/es.regexp.exec":432}],100:[function(require,module,exports){
'use strict';

var isArray = require('../internals/is-array');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var doesNotExceedSafeInteger = require('../internals/does-not-exceed-safe-integer');
var bind = require('../internals/function-bind-context');

// `FlattenIntoArray` abstract operation
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var flattenIntoArray = function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? bind(mapper, thisArg) : false;
  var element, elementLen;
  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];
      if (depth > 0 && isArray(element)) {
        elementLen = lengthOfArrayLike(element);
        targetIndex = flattenIntoArray(target, original, element, elementLen, targetIndex, depth - 1) - 1;
      } else {
        doesNotExceedSafeInteger(targetIndex + 1);
        target[targetIndex] = element;
      }
      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
};
module.exports = flattenIntoArray;

},{"../internals/does-not-exceed-safe-integer":75,"../internals/function-bind-context":103,"../internals/is-array":136,"../internals/length-of-array-like":158}],101:[function(require,module,exports){
"use strict";

var fails = require('../internals/fails');
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
  return Object.isExtensible(Object.preventExtensions({}));
});

},{"../internals/fails":98}],102:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var NATIVE_BIND = require('../internals/function-bind-native');
var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});

},{"../internals/function-bind-native":104}],103:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this-clause');
var aCallable = require('../internals/a-callable');
var NATIVE_BIND = require('../internals/function-bind-native');
var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function /* ...args */
  () {
    return fn.apply(that, arguments);
  };
};

},{"../internals/a-callable":3,"../internals/function-bind-native":104,"../internals/function-uncurry-this-clause":109}],104:[function(require,module,exports){
"use strict";

var fails = require('../internals/fails');
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = function () {/* empty */}.bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

},{"../internals/fails":98}],105:[function(require,module,exports){
'use strict';

var uncurryThis = require('../internals/function-uncurry-this');
var aCallable = require('../internals/a-callable');
var isObject = require('../internals/is-object');
var hasOwn = require('../internals/has-own-property');
var arraySlice = require('../internals/array-slice');
var NATIVE_BIND = require('../internals/function-bind-native');
var $Function = Function;
var concat = uncurryThis([].concat);
var join = uncurryThis([].join);
var factories = {};
var construct = function construct(C, argsLength, args) {
  if (!hasOwn(factories, argsLength)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    factories[argsLength] = $Function('C,a', 'return new C(' + join(list, ',') + ')');
  }
  return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.es/ecma262/#sec-function.prototype.bind
// eslint-disable-next-line es/no-function-prototype-bind -- detection
module.exports = NATIVE_BIND ? $Function.bind : function bind(that /* , ...args */) {
  var F = aCallable(this);
  var Prototype = F.prototype;
  var partArgs = arraySlice(arguments, 1);
  var boundFunction = function bound( /* args... */
  ) {
    var args = concat(partArgs, arraySlice(arguments));
    return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
  };
  if (isObject(Prototype)) boundFunction.prototype = Prototype;
  return boundFunction;
};

},{"../internals/a-callable":3,"../internals/array-slice":36,"../internals/function-bind-native":104,"../internals/function-uncurry-this":110,"../internals/has-own-property":123,"../internals/is-object":144}],106:[function(require,module,exports){
"use strict";

var NATIVE_BIND = require('../internals/function-bind-native');
var call = Function.prototype.call;
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};

},{"../internals/function-bind-native":104}],107:[function(require,module,exports){
"use strict";

var DESCRIPTORS = require('../internals/descriptors');
var hasOwn = require('../internals/has-own-property');
var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;
var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && function something() {/* empty */}.name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable);
module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

},{"../internals/descriptors":72,"../internals/has-own-property":123}],108:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var aCallable = require('../internals/a-callable');
module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) {/* empty */}
};

},{"../internals/a-callable":3,"../internals/function-uncurry-this":110}],109:[function(require,module,exports){
"use strict";

var classofRaw = require('../internals/classof-raw');
var uncurryThis = require('../internals/function-uncurry-this');
module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};

},{"../internals/classof-raw":52,"../internals/function-uncurry-this":110}],110:[function(require,module,exports){
"use strict";

var NATIVE_BIND = require('../internals/function-bind-native');
var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);
module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};

},{"../internals/function-bind-native":104}],111:[function(require,module,exports){
"use strict";

var call = require('../internals/function-call');
var isCallable = require('../internals/is-callable');
var anObject = require('../internals/an-object');
var getIteratorDirect = require('../internals/get-iterator-direct');
var getIteratorMethod = require('../internals/get-iterator-method');
var getMethod = require('../internals/get-method');
var wellKnownSymbol = require('../internals/well-known-symbol');
var AsyncFromSyncIterator = require('../internals/async-from-sync-iterator');
var ASYNC_ITERATOR = wellKnownSymbol('asyncIterator');
module.exports = function from(obj) {
  var object = anObject(obj);
  var alreadyAsync = true;
  var method = getMethod(object, ASYNC_ITERATOR);
  var iterator;
  if (!isCallable(method)) {
    method = getIteratorMethod(object);
    alreadyAsync = false;
  }
  if (isCallable(method)) {
    iterator = call(method, object);
  } else {
    iterator = object;
    alreadyAsync = true;
  }
  anObject(iterator);
  return getIteratorDirect(alreadyAsync ? iterator : new AsyncFromSyncIterator(getIteratorDirect(iterator)));
};

},{"../internals/an-object":11,"../internals/async-from-sync-iterator":42,"../internals/function-call":106,"../internals/get-iterator-direct":114,"../internals/get-iterator-method":116,"../internals/get-method":119,"../internals/is-callable":138,"../internals/well-known-symbol":277}],112:[function(require,module,exports){
"use strict";

var call = require('../internals/function-call');
var AsyncFromSyncIterator = require('../internals/async-from-sync-iterator');
var anObject = require('../internals/an-object');
var getIterator = require('../internals/get-iterator');
var getIteratorDirect = require('../internals/get-iterator-direct');
var getMethod = require('../internals/get-method');
var wellKnownSymbol = require('../internals/well-known-symbol');
var ASYNC_ITERATOR = wellKnownSymbol('asyncIterator');
module.exports = function (it, usingIterator) {
  var method = arguments.length < 2 ? getMethod(it, ASYNC_ITERATOR) : usingIterator;
  return method ? anObject(call(method, it)) : new AsyncFromSyncIterator(getIteratorDirect(getIterator(it)));
};

},{"../internals/an-object":11,"../internals/async-from-sync-iterator":42,"../internals/function-call":106,"../internals/get-iterator":117,"../internals/get-iterator-direct":114,"../internals/get-method":119,"../internals/well-known-symbol":277}],113:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var isCallable = require('../internals/is-callable');
var aFunction = function aFunction(argument) {
  return isCallable(argument) ? argument : undefined;
};
module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};

},{"../internals/global":122,"../internals/is-callable":138}],114:[function(require,module,exports){
"use strict";

var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
module.exports = function (obj) {
  return {
    iterator: obj,
    next: aCallable(anObject(obj).next)
  };
};

},{"../internals/a-callable":3,"../internals/an-object":11}],115:[function(require,module,exports){
"use strict";

var call = require('../internals/function-call');
var isCallable = require('../internals/is-callable');
var anObject = require('../internals/an-object');
var getIteratorDirect = require('../internals/get-iterator-direct');
var getIteratorMethod = require('../internals/get-iterator-method');
module.exports = function (obj) {
  var object = anObject(obj);
  var method = getIteratorMethod(object);
  return getIteratorDirect(anObject(isCallable(method) ? call(method, object) : object));
};

},{"../internals/an-object":11,"../internals/function-call":106,"../internals/get-iterator-direct":114,"../internals/get-iterator-method":116,"../internals/is-callable":138}],116:[function(require,module,exports){
"use strict";

var classof = require('../internals/classof');
var getMethod = require('../internals/get-method');
var isNullOrUndefined = require('../internals/is-null-or-undefined');
var Iterators = require('../internals/iterators');
var wellKnownSymbol = require('../internals/well-known-symbol');
var ITERATOR = wellKnownSymbol('iterator');
module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR) || getMethod(it, '@@iterator') || Iterators[classof(it)];
};

},{"../internals/classof":53,"../internals/get-method":119,"../internals/is-null-or-undefined":143,"../internals/iterators":157,"../internals/well-known-symbol":277}],117:[function(require,module,exports){
"use strict";

var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var tryToString = require('../internals/try-to-string');
var getIteratorMethod = require('../internals/get-iterator-method');
var $TypeError = TypeError;
module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw $TypeError(tryToString(argument) + ' is not iterable');
};

},{"../internals/a-callable":3,"../internals/an-object":11,"../internals/function-call":106,"../internals/get-iterator-method":116,"../internals/try-to-string":263}],118:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var isArray = require('../internals/is-array');
var isCallable = require('../internals/is-callable');
var classof = require('../internals/classof-raw');
var toString = require('../internals/to-string');
var push = uncurryThis([].push);
module.exports = function (replacer) {
  if (isCallable(replacer)) return replacer;
  if (!isArray(replacer)) return;
  var rawLength = replacer.length;
  var keys = [];
  for (var i = 0; i < rawLength; i++) {
    var element = replacer[i];
    if (typeof element == 'string') push(keys, element);else if (typeof element == 'number' || classof(element) == 'Number' || classof(element) == 'String') push(keys, toString(element));
  }
  var keysLength = keys.length;
  var root = true;
  return function (key, value) {
    if (root) {
      root = false;
      return value;
    }
    if (isArray(this)) return value;
    for (var j = 0; j < keysLength; j++) if (keys[j] === key) return value;
  };
};

},{"../internals/classof-raw":52,"../internals/function-uncurry-this":110,"../internals/is-array":136,"../internals/is-callable":138,"../internals/to-string":261}],119:[function(require,module,exports){
"use strict";

var aCallable = require('../internals/a-callable');
var isNullOrUndefined = require('../internals/is-null-or-undefined');

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};

},{"../internals/a-callable":3,"../internals/is-null-or-undefined":143}],120:[function(require,module,exports){
"use strict";

var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var call = require('../internals/function-call');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var $TypeError = TypeError;
var max = Math.max;
var SetRecord = function SetRecord(set, size, has, keys) {
  this.set = set;
  this.size = size;
  this.has = has;
  this.keys = keys;
};
SetRecord.prototype = {
  getIterator: function getIterator() {
    return anObject(call(this.keys, this.set));
  },
  includes: function includes(it) {
    return call(this.has, this.set, it);
  }
};

// `GetSetRecord` abstract operation
// https://tc39.es/proposal-set-methods/#sec-getsetrecord
module.exports = function (obj) {
  anObject(obj);
  var numSize = +obj.size;
  // NOTE: If size is undefined, then numSize will be NaN
  // eslint-disable-next-line no-self-compare -- NaN check
  if (numSize != numSize) throw $TypeError('Invalid size');
  return new SetRecord(obj, max(toIntegerOrInfinity(numSize), 0), aCallable(obj.has), aCallable(obj.keys));
};

},{"../internals/a-callable":3,"../internals/an-object":11,"../internals/function-call":106,"../internals/to-integer-or-infinity":253}],121:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var toObject = require('../internals/to-object');
var floor = Math.floor;
var charAt = uncurryThis(''.charAt);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
// eslint-disable-next-line redos/no-vulnerable -- safe
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
module.exports = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace(replacement, symbols, function (match, ch) {
    var capture;
    switch (charAt(ch, 0)) {
      case '$':
        return '$';
      case '&':
        return matched;
      case '`':
        return stringSlice(str, 0, position);
      case "'":
        return stringSlice(str, tailPos);
      case '<':
        capture = namedCaptures[stringSlice(ch, 1, -1)];
        break;
      default:
        // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};

},{"../internals/function-uncurry-this":110,"../internals/to-object":255}],122:[function(require,module,exports){
(function (global){(function (){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var check = function check(it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
// eslint-disable-next-line es/no-global-this -- safe
check((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) == 'object' && globalThis) || check((typeof window === "undefined" ? "undefined" : _typeof(window)) == 'object' && window) ||
// eslint-disable-next-line no-restricted-globals -- safe
check((typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self) || check((typeof global === "undefined" ? "undefined" : _typeof(global)) == 'object' && global) ||
// eslint-disable-next-line no-new-func -- fallback
function () {
  return this;
}() || Function('return this')();

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],123:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var toObject = require('../internals/to-object');
var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};

},{"../internals/function-uncurry-this":110,"../internals/to-object":255}],124:[function(require,module,exports){
"use strict";

module.exports = {};

},{}],125:[function(require,module,exports){
"use strict";

module.exports = function (a, b) {
  try {
    // eslint-disable-next-line no-console -- safe
    arguments.length == 1 ? console.error(a) : console.error(a, b);
  } catch (error) {/* empty */}
};

},{}],126:[function(require,module,exports){
"use strict";

var getBuiltIn = require('../internals/get-built-in');
module.exports = getBuiltIn('document', 'documentElement');

},{"../internals/get-built-in":113}],127:[function(require,module,exports){
"use strict";

var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var createElement = require('../internals/document-create-element');

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

},{"../internals/descriptors":72,"../internals/document-create-element":74,"../internals/fails":98}],128:[function(require,module,exports){
"use strict";

// IEEE754 conversions based on https://github.com/feross/ieee754
var $Array = Array;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var pack = function pack(number, mantissaLength, bytes) {
  var buffer = $Array(bytes);
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
  var index = 0;
  var exponent, mantissa, c;
  number = abs(number);
  // eslint-disable-next-line no-self-compare -- NaN check
  if (number != number || number === Infinity) {
    // eslint-disable-next-line no-self-compare -- NaN check
    mantissa = number != number ? 1 : 0;
    exponent = eMax;
  } else {
    exponent = floor(log(number) / LN2);
    c = pow(2, -exponent);
    if (number * c < 1) {
      exponent--;
      c *= 2;
    }
    if (exponent + eBias >= 1) {
      number += rt / c;
    } else {
      number += rt * pow(2, 1 - eBias);
    }
    if (number * c >= 2) {
      exponent++;
      c /= 2;
    }
    if (exponent + eBias >= eMax) {
      mantissa = 0;
      exponent = eMax;
    } else if (exponent + eBias >= 1) {
      mantissa = (number * c - 1) * pow(2, mantissaLength);
      exponent = exponent + eBias;
    } else {
      mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
      exponent = 0;
    }
  }
  while (mantissaLength >= 8) {
    buffer[index++] = mantissa & 255;
    mantissa /= 256;
    mantissaLength -= 8;
  }
  exponent = exponent << mantissaLength | mantissa;
  exponentLength += mantissaLength;
  while (exponentLength > 0) {
    buffer[index++] = exponent & 255;
    exponent /= 256;
    exponentLength -= 8;
  }
  buffer[--index] |= sign * 128;
  return buffer;
};
var unpack = function unpack(buffer, mantissaLength) {
  var bytes = buffer.length;
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var nBits = exponentLength - 7;
  var index = bytes - 1;
  var sign = buffer[index--];
  var exponent = sign & 127;
  var mantissa;
  sign >>= 7;
  while (nBits > 0) {
    exponent = exponent * 256 + buffer[index--];
    nBits -= 8;
  }
  mantissa = exponent & (1 << -nBits) - 1;
  exponent >>= -nBits;
  nBits += mantissaLength;
  while (nBits > 0) {
    mantissa = mantissa * 256 + buffer[index--];
    nBits -= 8;
  }
  if (exponent === 0) {
    exponent = 1 - eBias;
  } else if (exponent === eMax) {
    return mantissa ? NaN : sign ? -Infinity : Infinity;
  } else {
    mantissa = mantissa + pow(2, mantissaLength);
    exponent = exponent - eBias;
  }
  return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
};
module.exports = {
  pack: pack,
  unpack: unpack
};

},{}],129:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var classof = require('../internals/classof-raw');
var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;

},{"../internals/classof-raw":52,"../internals/fails":98,"../internals/function-uncurry-this":110}],130:[function(require,module,exports){
"use strict";

var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var setPrototypeOf = require('../internals/object-set-prototype-of');

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
  // it can work only with native `setPrototypeOf`
  setPrototypeOf &&
  // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
  isCallable(NewTarget = dummy.constructor) && NewTarget !== Wrapper && isObject(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};

},{"../internals/is-callable":138,"../internals/is-object":144,"../internals/object-set-prototype-of":191}],131:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var isCallable = require('../internals/is-callable');
var store = require('../internals/shared-store');
var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}
module.exports = store.inspectSource;

},{"../internals/function-uncurry-this":110,"../internals/is-callable":138,"../internals/shared-store":230}],132:[function(require,module,exports){
"use strict";

var isObject = require('../internals/is-object');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
};

},{"../internals/create-non-enumerable-property":62,"../internals/is-object":144}],133:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var hiddenKeys = require('../internals/hidden-keys');
var isObject = require('../internals/is-object');
var hasOwn = require('../internals/has-own-property');
var defineProperty = require('../internals/object-define-property').f;
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertyNamesExternalModule = require('../internals/object-get-own-property-names-external');
var isExtensible = require('../internals/object-is-extensible');
var uid = require('../internals/uid');
var FREEZING = require('../internals/freezing');
var REQUIRED = false;
var METADATA = uid('meta');
var id = 0;
var setMetadata = function setMetadata(it) {
  defineProperty(it, METADATA, {
    value: {
      objectID: 'O' + id++,
      // object ID
      weakData: {} // weak collections IDs
    }
  });
};

var fastKey = function fastKey(it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return _typeof(it) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
    // return object ID
  }
  return it[METADATA].objectID;
};
var getWeakData = function getWeakData(it, create) {
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
    // return the store of weak collections IDs
  }
  return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function onFreeze(it) {
  if (FREEZING && REQUIRED && isExtensible(it) && !hasOwn(it, METADATA)) setMetadata(it);
  return it;
};
var enable = function enable() {
  meta.enable = function () {/* empty */};
  REQUIRED = true;
  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
  var splice = uncurryThis([].splice);
  var test = {};
  test[METADATA] = 1;

  // prevent exposing of metadata key
  if (getOwnPropertyNames(test).length) {
    getOwnPropertyNamesModule.f = function (it) {
      var result = getOwnPropertyNames(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice(result, i, 1);
          break;
        }
      }
      return result;
    };
    $({
      target: 'Object',
      stat: true,
      forced: true
    }, {
      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
    });
  }
};
var meta = module.exports = {
  enable: enable,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};
hiddenKeys[METADATA] = true;

},{"../internals/export":97,"../internals/freezing":101,"../internals/function-uncurry-this":110,"../internals/has-own-property":123,"../internals/hidden-keys":124,"../internals/is-object":144,"../internals/object-define-property":179,"../internals/object-get-own-property-names":182,"../internals/object-get-own-property-names-external":181,"../internals/object-is-extensible":185,"../internals/uid":269}],134:[function(require,module,exports){
"use strict";

var NATIVE_WEAK_MAP = require('../internals/weak-map-basic-detection');
var global = require('../internals/global');
var isObject = require('../internals/is-object');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var hasOwn = require('../internals/has-own-property');
var shared = require('../internals/shared-store');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');
var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;
var enforce = function enforce(it) {
  return has(it) ? get(it) : set(it, {});
};
var getterFor = function getterFor(TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    }
    return state;
  };
};
if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function set(it, metadata) {
    if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function get(it) {
    return store.get(it) || {};
  };
  has = function has(it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function set(it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function get(it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function has(it) {
    return hasOwn(it, STATE);
  };
}
module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

},{"../internals/create-non-enumerable-property":62,"../internals/global":122,"../internals/has-own-property":123,"../internals/hidden-keys":124,"../internals/is-object":144,"../internals/shared-key":229,"../internals/shared-store":230,"../internals/weak-map-basic-detection":274}],135:[function(require,module,exports){
"use strict";

var wellKnownSymbol = require('../internals/well-known-symbol');
var Iterators = require('../internals/iterators');
var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

},{"../internals/iterators":157,"../internals/well-known-symbol":277}],136:[function(require,module,exports){
"use strict";

var classof = require('../internals/classof-raw');

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};

},{"../internals/classof-raw":52}],137:[function(require,module,exports){
"use strict";

var classof = require('../internals/classof');
module.exports = function (it) {
  var klass = classof(it);
  return klass == 'BigInt64Array' || klass == 'BigUint64Array';
};

},{"../internals/classof":53}],138:[function(require,module,exports){
"use strict";

var $documentAll = require('../internals/document-all');
var documentAll = $documentAll.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};

},{"../internals/document-all":73}],139:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');
var classof = require('../internals/classof');
var getBuiltIn = require('../internals/get-built-in');
var inspectSource = require('../internals/inspect-source');
var noop = function noop() {/* empty */};
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);
var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};
var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction':
      return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};
isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function () {
    called = true;
  }) || called;
}) ? isConstructorLegacy : isConstructorModern;

},{"../internals/classof":53,"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/get-built-in":113,"../internals/inspect-source":131,"../internals/is-callable":138}],140:[function(require,module,exports){
"use strict";

var hasOwn = require('../internals/has-own-property');
module.exports = function (descriptor) {
  return descriptor !== undefined && (hasOwn(descriptor, 'value') || hasOwn(descriptor, 'writable'));
};

},{"../internals/has-own-property":123}],141:[function(require,module,exports){
"use strict";

var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');
var replacement = /#|\.prototype\./;
var isForced = function isForced(feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true : value == NATIVE ? false : isCallable(detection) ? fails(detection) : !!detection;
};
var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};
var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';
module.exports = isForced;

},{"../internals/fails":98,"../internals/is-callable":138}],142:[function(require,module,exports){
"use strict";

var isObject = require('../internals/is-object');
var floor = Math.floor;

// `IsIntegralNumber` abstract operation
// https://tc39.es/ecma262/#sec-isintegralnumber
// eslint-disable-next-line es/no-number-isinteger -- safe
module.exports = Number.isInteger || function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"../internals/is-object":144}],143:[function(require,module,exports){
"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};

},{}],144:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var isCallable = require('../internals/is-callable');
var $documentAll = require('../internals/document-all');
var documentAll = $documentAll.all;
module.exports = $documentAll.IS_HTMLDDA ? function (it) {
  return _typeof(it) == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return _typeof(it) == 'object' ? it !== null : isCallable(it);
};

},{"../internals/document-all":73,"../internals/is-callable":138}],145:[function(require,module,exports){
"use strict";

module.exports = false;

},{}],146:[function(require,module,exports){
"use strict";

var isObject = require('../internals/is-object');
var getInternalState = require('../internals/internal-state').get;
module.exports = function isRawJSON(O) {
  if (!isObject(O)) return false;
  var state = getInternalState(O);
  return !!state && state.type === 'RawJSON';
};

},{"../internals/internal-state":134,"../internals/is-object":144}],147:[function(require,module,exports){
"use strict";

var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var wellKnownSymbol = require('../internals/well-known-symbol');
var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};

},{"../internals/classof-raw":52,"../internals/is-object":144,"../internals/well-known-symbol":277}],148:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var getBuiltIn = require('../internals/get-built-in');
var isCallable = require('../internals/is-callable');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');
var $Object = Object;
module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return _typeof(it) == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};

},{"../internals/get-built-in":113,"../internals/is-callable":138,"../internals/object-is-prototype-of":186,"../internals/use-symbol-as-uid":271}],149:[function(require,module,exports){
"use strict";

var call = require('../internals/function-call');
module.exports = function (iterator, fn, $next) {
  var next = $next || iterator.next;
  var step, result;
  while (!(step = call(next, iterator)).done) {
    result = fn(step.value);
    if (result !== undefined) return result;
  }
};

},{"../internals/function-call":106}],150:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var bind = require('../internals/function-bind-context');
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var tryToString = require('../internals/try-to-string');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var getIterator = require('../internals/get-iterator');
var getIteratorMethod = require('../internals/get-iterator-method');
var iteratorClose = require('../internals/iterator-close');
var $TypeError = TypeError;
var Result = function Result(stopped, result) {
  this.stopped = stopped;
  this.result = result;
};
var ResultPrototype = Result.prototype;
module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;
  var stop = function stop(condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };
  var callFn = function callFn(value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    }
    return INTERRUPTED ? fn(value, stop) : fn(value);
  };
  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      }
      return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }
  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (_typeof(result) == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  }
  return new Result(false);
};

},{"../internals/an-object":11,"../internals/function-bind-context":103,"../internals/function-call":106,"../internals/get-iterator":117,"../internals/get-iterator-method":116,"../internals/is-array-iterator-method":135,"../internals/iterator-close":151,"../internals/length-of-array-like":158,"../internals/object-is-prototype-of":186,"../internals/try-to-string":263}],151:[function(require,module,exports){
"use strict";

var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var getMethod = require('../internals/get-method');
module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};

},{"../internals/an-object":11,"../internals/function-call":106,"../internals/get-method":119}],152:[function(require,module,exports){
'use strict';

var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype;
var create = require('../internals/object-create');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var setToStringTag = require('../internals/set-to-string-tag');
var Iterators = require('../internals/iterators');
var returnThis = function returnThis() {
  return this;
};
module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, {
    next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next)
  });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};

},{"../internals/create-property-descriptor":63,"../internals/iterators":157,"../internals/iterators-core":156,"../internals/object-create":177,"../internals/set-to-string-tag":227}],153:[function(require,module,exports){
'use strict';

var call = require('../internals/function-call');
var create = require('../internals/object-create');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var defineBuiltIns = require('../internals/define-built-ins');
var wellKnownSymbol = require('../internals/well-known-symbol');
var InternalStateModule = require('../internals/internal-state');
var getMethod = require('../internals/get-method');
var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype;
var createIterResultObject = require('../internals/create-iter-result-object');
var iteratorClose = require('../internals/iterator-close');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ITERATOR_HELPER = 'IteratorHelper';
var WRAP_FOR_VALID_ITERATOR = 'WrapForValidIterator';
var setInternalState = InternalStateModule.set;
var createIteratorProxyPrototype = function createIteratorProxyPrototype(IS_ITERATOR) {
  var getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER);
  return defineBuiltIns(create(IteratorPrototype), {
    next: function next() {
      var state = getInternalState(this);
      // for simplification:
      //   for `%WrapForValidIteratorPrototype%.next` our `nextHandler` returns `IterResultObject`
      //   for `%IteratorHelperPrototype%.next` - just a value
      if (IS_ITERATOR) return state.nextHandler();
      try {
        var result = state.done ? undefined : state.nextHandler();
        return createIterResultObject(result, state.done);
      } catch (error) {
        state.done = true;
        throw error;
      }
    },
    'return': function _return() {
      var state = getInternalState(this);
      var iterator = state.iterator;
      state.done = true;
      if (IS_ITERATOR) {
        var returnMethod = getMethod(iterator, 'return');
        return returnMethod ? call(returnMethod, iterator) : createIterResultObject(undefined, true);
      }
      if (state.inner) try {
        iteratorClose(state.inner.iterator, 'normal');
      } catch (error) {
        return iteratorClose(iterator, 'throw', error);
      }
      iteratorClose(iterator, 'normal');
      return createIterResultObject(undefined, true);
    }
  });
};
var WrapForValidIteratorPrototype = createIteratorProxyPrototype(true);
var IteratorHelperPrototype = createIteratorProxyPrototype(false);
createNonEnumerableProperty(IteratorHelperPrototype, TO_STRING_TAG, 'Iterator Helper');
module.exports = function (nextHandler, IS_ITERATOR) {
  var IteratorProxy = function Iterator(record, state) {
    if (state) {
      state.iterator = record.iterator;
      state.next = record.next;
    } else state = record;
    state.type = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER;
    state.nextHandler = nextHandler;
    state.counter = 0;
    state.done = false;
    setInternalState(this, state);
  };
  IteratorProxy.prototype = IS_ITERATOR ? WrapForValidIteratorPrototype : IteratorHelperPrototype;
  return IteratorProxy;
};

},{"../internals/create-iter-result-object":61,"../internals/create-non-enumerable-property":62,"../internals/define-built-ins":69,"../internals/function-call":106,"../internals/get-method":119,"../internals/internal-state":134,"../internals/iterator-close":151,"../internals/iterators-core":156,"../internals/object-create":177,"../internals/well-known-symbol":277}],154:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var IS_PURE = require('../internals/is-pure');
var FunctionName = require('../internals/function-name');
var isCallable = require('../internals/is-callable');
var createIteratorConstructor = require('../internals/iterator-create-constructor');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var setToStringTag = require('../internals/set-to-string-tag');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var defineBuiltIn = require('../internals/define-built-in');
var wellKnownSymbol = require('../internals/well-known-symbol');
var Iterators = require('../internals/iterators');
var IteratorsCore = require('../internals/iterators-core');
var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';
var returnThis = function returnThis() {
  return this;
};
module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);
  var getIterationMethod = function getIterationMethod(KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS:
        return function keys() {
          return new IteratorConstructor(this, KIND);
        };
      case VALUES:
        return function values() {
          return new IteratorConstructor(this, KIND);
        };
      case ENTRIES:
        return function entries() {
          return new IteratorConstructor(this, KIND);
        };
    }
    return function () {
      return new IteratorConstructor(this);
    };
  };
  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR] || IterablePrototype['@@iterator'] || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() {
        return call(nativeIterator, this);
      };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({
      target: NAME,
      proto: true,
      forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME
    }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, {
      name: DEFAULT
    });
  }
  Iterators[NAME] = defaultIterator;
  return methods;
};

},{"../internals/create-non-enumerable-property":62,"../internals/define-built-in":68,"../internals/export":97,"../internals/function-call":106,"../internals/function-name":107,"../internals/is-callable":138,"../internals/is-pure":145,"../internals/iterator-create-constructor":152,"../internals/iterators":157,"../internals/iterators-core":156,"../internals/object-get-prototype-of":184,"../internals/object-set-prototype-of":191,"../internals/set-to-string-tag":227,"../internals/well-known-symbol":277}],155:[function(require,module,exports){
'use strict';

var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var getIteratorDirect = require('../internals/get-iterator-direct');
var createIteratorProxy = require('../internals/iterator-create-proxy');
var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');
var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var result = anObject(call(this.next, iterator));
  var done = this.done = !!result.done;
  if (!done) return callWithSafeIterationClosing(iterator, this.mapper, [result.value, this.counter++], true);
});

// `Iterator.prototype.map` method
// https://github.com/tc39/proposal-iterator-helpers
module.exports = function map(mapper) {
  return new IteratorProxy(getIteratorDirect(this), {
    mapper: aCallable(mapper)
  });
};

},{"../internals/a-callable":3,"../internals/an-object":11,"../internals/call-with-safe-iteration-closing":50,"../internals/function-call":106,"../internals/get-iterator-direct":114,"../internals/iterator-create-proxy":153}],156:[function(require,module,exports){
'use strict';

var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var create = require('../internals/object-create');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var defineBuiltIn = require('../internals/define-built-in');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');
var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}
var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});
if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}
module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

},{"../internals/define-built-in":68,"../internals/fails":98,"../internals/is-callable":138,"../internals/is-object":144,"../internals/is-pure":145,"../internals/object-create":177,"../internals/object-get-prototype-of":184,"../internals/well-known-symbol":277}],157:[function(require,module,exports){
"use strict";

module.exports = {};

},{}],158:[function(require,module,exports){
"use strict";

var toLength = require('../internals/to-length');

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};

},{"../internals/to-length":254}],159:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');
var hasOwn = require('../internals/has-own-property');
var DESCRIPTORS = require('../internals/descriptors');
var CONFIGURABLE_FUNCTION_NAME = require('../internals/function-name').CONFIGURABLE;
var inspectSource = require('../internals/inspect-source');
var InternalStateModule = require('../internals/internal-state');
var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);
var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () {/* empty */}, 'length', {
    value: 8
  }).length !== 8;
});
var TEMPLATE = String(String).split('String');
var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
    if (DESCRIPTORS) defineProperty(value, 'name', {
      value: name,
      configurable: true
    });else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', {
      value: options.arity
    });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', {
        writable: false
      });
      // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) {/* empty */}
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  }
  return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');

},{"../internals/descriptors":72,"../internals/fails":98,"../internals/function-name":107,"../internals/function-uncurry-this":110,"../internals/has-own-property":123,"../internals/inspect-source":131,"../internals/internal-state":134,"../internals/is-callable":138}],160:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');

// eslint-disable-next-line es/no-map -- safe
var MapPrototype = Map.prototype;
module.exports = {
  // eslint-disable-next-line es/no-map -- safe
  Map: Map,
  set: uncurryThis(MapPrototype.set),
  get: uncurryThis(MapPrototype.get),
  has: uncurryThis(MapPrototype.has),
  remove: uncurryThis(MapPrototype['delete']),
  proto: MapPrototype
};

},{"../internals/function-uncurry-this":110}],161:[function(require,module,exports){
"use strict";

// eslint-disable-next-line es/no-math-expm1 -- safe
var $expm1 = Math.expm1;
var exp = Math.exp;

// `Math.expm1` method implementation
// https://tc39.es/ecma262/#sec-math.expm1
module.exports = !$expm1
// Old FF bug
|| $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
// Tor Browser bug
|| $expm1(-2e-17) != -2e-17 ? function expm1(x) {
  var n = +x;
  return n == 0 ? n : n > -1e-6 && n < 1e-6 ? n + n * n / 2 : exp(n) - 1;
} : $expm1;

},{}],162:[function(require,module,exports){
"use strict";

var sign = require('../internals/math-sign');
var abs = Math.abs;
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);
var roundTiesToEven = function roundTiesToEven(n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

// `Math.fround` method implementation
// https://tc39.es/ecma262/#sec-math.fround
// eslint-disable-next-line es/no-math-fround -- safe
module.exports = Math.fround || function fround(x) {
  var n = +x;
  var $abs = abs(n);
  var $sign = sign(n);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare -- NaN check
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

},{"../internals/math-sign":165}],163:[function(require,module,exports){
"use strict";

var log = Math.log;
var LOG10E = Math.LOG10E;

// eslint-disable-next-line es/no-math-log10 -- safe
module.exports = Math.log10 || function log10(x) {
  return log(x) * LOG10E;
};

},{}],164:[function(require,module,exports){
"use strict";

var log = Math.log;

// `Math.log1p` method implementation
// https://tc39.es/ecma262/#sec-math.log1p
// eslint-disable-next-line es/no-math-log1p -- safe
module.exports = Math.log1p || function log1p(x) {
  var n = +x;
  return n > -1e-8 && n < 1e-8 ? n - n * n / 2 : log(1 + n);
};

},{}],165:[function(require,module,exports){
"use strict";

// `Math.sign` method implementation
// https://tc39.es/ecma262/#sec-math.sign
// eslint-disable-next-line es/no-math-sign -- safe
module.exports = Math.sign || function sign(x) {
  var n = +x;
  // eslint-disable-next-line no-self-compare -- NaN check
  return n == 0 || n != n ? n : n < 0 ? -1 : 1;
};

},{}],166:[function(require,module,exports){
"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};

},{}],167:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var bind = require('../internals/function-bind-context');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var macrotask = require('../internals/task').set;
var Queue = require('../internals/queue');
var IS_IOS = require('../internals/engine-is-ios');
var IS_IOS_PEBBLE = require('../internals/engine-is-ios-pebble');
var IS_WEBOS_WEBKIT = require('../internals/engine-is-webos-webkit');
var IS_NODE = require('../internals/engine-is-node');
var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var document = global.document;
var process = global.process;
var Promise = global.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var microtask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
var notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!microtask) {
  var queue = new Queue();
  var flush = function flush() {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (fn = queue.get()) try {
      fn();
    } catch (error) {
      if (queue.head) notify();
      throw error;
    }
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, {
      characterData: true
    });
    notify = function notify() {
      node.data = toggle = !toggle;
    };
    // environments with maybe non-completely correct, but existent Promise
  } else if (!IS_IOS_PEBBLE && Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    // workaround of WebKit ~ iOS Safari 10.1 bug
    promise.constructor = Promise;
    then = bind(promise.then, promise);
    notify = function notify() {
      then(flush);
    };
    // Node.js without promises
  } else if (IS_NODE) {
    notify = function notify() {
      process.nextTick(flush);
    };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessage
    // - onreadystatechange
    // - setTimeout
  } else {
    // `webpack` dev server bug on IE global methods - use bind(fn, global)
    macrotask = bind(macrotask, global);
    notify = function notify() {
      macrotask(flush);
    };
  }
  microtask = function microtask(fn) {
    if (!queue.head) notify();
    queue.add(fn);
  };
}
module.exports = microtask;

},{"../internals/engine-is-ios":85,"../internals/engine-is-ios-pebble":84,"../internals/engine-is-node":86,"../internals/engine-is-webos-webkit":87,"../internals/function-bind-context":103,"../internals/global":122,"../internals/object-get-own-property-descriptor":180,"../internals/queue":204,"../internals/task":247}],168:[function(require,module,exports){
"use strict";

/* eslint-disable es/no-json -- safe */
var fails = require('../internals/fails');
module.exports = !fails(function () {
  var unsafeInt = '9007199254740993';
  var raw = JSON.rawJSON(unsafeInt);
  return !JSON.isRawJSON(raw) || JSON.stringify(raw) !== unsafeInt;
});

},{"../internals/fails":98}],169:[function(require,module,exports){
'use strict';

var aCallable = require('../internals/a-callable');
var $TypeError = TypeError;
var PromiseCapability = function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw $TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable(resolve);
  this.reject = aCallable(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"../internals/a-callable":3}],170:[function(require,module,exports){
"use strict";

var toString = require('../internals/to-string');
module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};

},{"../internals/to-string":261}],171:[function(require,module,exports){
"use strict";

var $RangeError = RangeError;
module.exports = function (it) {
  // eslint-disable-next-line no-self-compare -- NaN check
  if (it === it) return it;
  throw $RangeError('NaN is not allowed');
};

},{}],172:[function(require,module,exports){
"use strict";

var isRegExp = require('../internals/is-regexp');
var $TypeError = TypeError;
module.exports = function (it) {
  if (isRegExp(it)) {
    throw $TypeError("The method doesn't accept regular expressions");
  }
  return it;
};

},{"../internals/is-regexp":147}],173:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var globalIsFinite = global.isFinite;

// `Number.isFinite` method
// https://tc39.es/ecma262/#sec-number.isfinite
// eslint-disable-next-line es/no-number-isfinite -- safe
module.exports = Number.isFinite || function isFinite(it) {
  return typeof it == 'number' && globalIsFinite(it);
};

},{"../internals/global":122}],174:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var fails = require('../internals/fails');
var uncurryThis = require('../internals/function-uncurry-this');
var toString = require('../internals/to-string');
var trim = require('../internals/string-trim').trim;
var whitespaces = require('../internals/whitespaces');
var charAt = uncurryThis(''.charAt);
var $parseFloat = global.parseFloat;
var _Symbol = global.Symbol;
var ITERATOR = _Symbol && _Symbol.iterator;
var FORCED = 1 / $parseFloat(whitespaces + '-0') !== -Infinity
// MS Edge 18- broken with boxed symbols
|| ITERATOR && !fails(function () {
  $parseFloat(Object(ITERATOR));
});

// `parseFloat` method
// https://tc39.es/ecma262/#sec-parsefloat-string
module.exports = FORCED ? function parseFloat(string) {
  var trimmedString = trim(toString(string));
  var result = $parseFloat(trimmedString);
  return result === 0 && charAt(trimmedString, 0) == '-' ? -0 : result;
} : $parseFloat;

},{"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/global":122,"../internals/string-trim":242,"../internals/to-string":261,"../internals/whitespaces":278}],175:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var fails = require('../internals/fails');
var uncurryThis = require('../internals/function-uncurry-this');
var toString = require('../internals/to-string');
var trim = require('../internals/string-trim').trim;
var whitespaces = require('../internals/whitespaces');
var $parseInt = global.parseInt;
var _Symbol = global.Symbol;
var ITERATOR = _Symbol && _Symbol.iterator;
var hex = /^[+-]?0x/i;
var exec = uncurryThis(hex.exec);
var FORCED = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22
// MS Edge 18- broken with boxed symbols
|| ITERATOR && !fails(function () {
  $parseInt(Object(ITERATOR));
});

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
module.exports = FORCED ? function parseInt(string, radix) {
  var S = trim(toString(string));
  return $parseInt(S, radix >>> 0 || (exec(hex, S) ? 16 : 10));
} : $parseInt;

},{"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/global":122,"../internals/string-trim":242,"../internals/to-string":261,"../internals/whitespaces":278}],176:[function(require,module,exports){
'use strict';

var DESCRIPTORS = require('../internals/descriptors');
var uncurryThis = require('../internals/function-uncurry-this');
var call = require('../internals/function-call');
var fails = require('../internals/fails');
var objectKeys = require('../internals/object-keys');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var toObject = require('../internals/to-object');
var IndexedObject = require('../internals/indexed-object');

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;
var concat = uncurryThis([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({
    b: 1
  }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function get() {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), {
    b: 2
  })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) {
    B[chr] = chr;
  });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  }
  return T;
} : $assign;

},{"../internals/descriptors":72,"../internals/fails":98,"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/indexed-object":129,"../internals/object-get-own-property-symbols":183,"../internals/object-keys":188,"../internals/object-property-is-enumerable":189,"../internals/to-object":255}],177:[function(require,module,exports){
"use strict";

/* global ActiveXObject -- old IE, WSH */
var anObject = require('../internals/an-object');
var definePropertiesModule = require('../internals/object-define-properties');
var enumBugKeys = require('../internals/enum-bug-keys');
var hiddenKeys = require('../internals/hidden-keys');
var html = require('../internals/html');
var documentCreateElement = require('../internals/document-create-element');
var sharedKey = require('../internals/shared-key');
var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');
var EmptyConstructor = function EmptyConstructor() {/* empty */};
var scriptTag = function scriptTag(content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function NullProtoObjectViaActiveX(activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function NullProtoObjectViaIFrame() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var _NullProtoObject = function NullProtoObject() {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) {/* ignore */}
  _NullProtoObject = typeof document != 'undefined' ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) // old IE
  : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete _NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return _NullProtoObject();
};
hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};

},{"../internals/an-object":11,"../internals/document-create-element":74,"../internals/enum-bug-keys":92,"../internals/hidden-keys":124,"../internals/html":126,"../internals/object-define-properties":178,"../internals/shared-key":229}],178:[function(require,module,exports){
"use strict";

var DESCRIPTORS = require('../internals/descriptors');
var V8_PROTOTYPE_DEFINE_BUG = require('../internals/v8-prototype-define-bug');
var definePropertyModule = require('../internals/object-define-property');
var anObject = require('../internals/an-object');
var toIndexedObject = require('../internals/to-indexed-object');
var objectKeys = require('../internals/object-keys');

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};

},{"../internals/an-object":11,"../internals/descriptors":72,"../internals/object-define-property":179,"../internals/object-keys":188,"../internals/to-indexed-object":252,"../internals/v8-prototype-define-bug":272}],179:[function(require,module,exports){
"use strict";

var DESCRIPTORS = require('../internals/descriptors');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
var V8_PROTOTYPE_DEFINE_BUG = require('../internals/v8-prototype-define-bug');
var anObject = require('../internals/an-object');
var toPropertyKey = require('../internals/to-property-key');
var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  }
  return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"../internals/an-object":11,"../internals/descriptors":72,"../internals/ie8-dom-define":127,"../internals/to-property-key":259,"../internals/v8-prototype-define-bug":272}],180:[function(require,module,exports){
"use strict";

var DESCRIPTORS = require('../internals/descriptors');
var call = require('../internals/function-call');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var toIndexedObject = require('../internals/to-indexed-object');
var toPropertyKey = require('../internals/to-property-key');
var hasOwn = require('../internals/has-own-property');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) {/* empty */}
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};

},{"../internals/create-property-descriptor":63,"../internals/descriptors":72,"../internals/function-call":106,"../internals/has-own-property":123,"../internals/ie8-dom-define":127,"../internals/object-property-is-enumerable":189,"../internals/to-indexed-object":252,"../internals/to-property-key":259}],181:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/* eslint-disable es/no-object-getownpropertynames -- safe */
var classof = require('../internals/classof-raw');
var toIndexedObject = require('../internals/to-indexed-object');
var $getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var arraySlice = require('../internals/array-slice-simple');
var windowNames = (typeof window === "undefined" ? "undefined" : _typeof(window)) == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
var getWindowNames = function getWindowNames(it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return arraySlice(windowNames);
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && classof(it) == 'Window' ? getWindowNames(it) : $getOwnPropertyNames(toIndexedObject(it));
};

},{"../internals/array-slice-simple":35,"../internals/classof-raw":52,"../internals/object-get-own-property-names":182,"../internals/to-indexed-object":252}],182:[function(require,module,exports){
"use strict";

var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');
var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

},{"../internals/enum-bug-keys":92,"../internals/object-keys-internal":187}],183:[function(require,module,exports){
"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;

},{}],184:[function(require,module,exports){
"use strict";

var hasOwn = require('../internals/has-own-property');
var isCallable = require('../internals/is-callable');
var toObject = require('../internals/to-object');
var sharedKey = require('../internals/shared-key');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');
var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  }
  return object instanceof $Object ? ObjectPrototype : null;
};

},{"../internals/correct-prototype-getter":59,"../internals/has-own-property":123,"../internals/is-callable":138,"../internals/shared-key":229,"../internals/to-object":255}],185:[function(require,module,exports){
"use strict";

var fails = require('../internals/fails');
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var ARRAY_BUFFER_NON_EXTENSIBLE = require('../internals/array-buffer-non-extensible');

// eslint-disable-next-line es/no-object-isextensible -- safe
var $isExtensible = Object.isExtensible;
var FAILS_ON_PRIMITIVES = fails(function () {
  $isExtensible(1);
});

// `Object.isExtensible` method
// https://tc39.es/ecma262/#sec-object.isextensible
module.exports = FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE ? function isExtensible(it) {
  if (!isObject(it)) return false;
  if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) == 'ArrayBuffer') return false;
  return $isExtensible ? $isExtensible(it) : true;
} : $isExtensible;

},{"../internals/array-buffer-non-extensible":15,"../internals/classof-raw":52,"../internals/fails":98,"../internals/is-object":144}],186:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
module.exports = uncurryThis({}.isPrototypeOf);

},{"../internals/function-uncurry-this":110}],187:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var hasOwn = require('../internals/has-own-property');
var toIndexedObject = require('../internals/to-indexed-object');
var indexOf = require('../internals/array-includes').indexOf;
var hiddenKeys = require('../internals/hidden-keys');
var push = uncurryThis([].push);
module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};

},{"../internals/array-includes":27,"../internals/function-uncurry-this":110,"../internals/has-own-property":123,"../internals/hidden-keys":124,"../internals/to-indexed-object":252}],188:[function(require,module,exports){
"use strict";

var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

},{"../internals/enum-bug-keys":92,"../internals/object-keys-internal":187}],189:[function(require,module,exports){
'use strict';

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({
  1: 2
}, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

},{}],190:[function(require,module,exports){
'use strict';

var IS_PURE = require('../internals/is-pure');
var global = require('../internals/global');
var fails = require('../internals/fails');
var WEBKIT = require('../internals/engine-webkit-version');

// Forced replacement object prototype accessors methods
module.exports = IS_PURE || !fails(function () {
  // This feature detection crashes old WebKit
  // https://github.com/zloirock/core-js/issues/232
  if (WEBKIT && WEBKIT < 535) return;
  var key = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call, es/no-legacy-object-prototype-accessor-methods -- required for testing
  __defineSetter__.call(null, key, function () {/* empty */});
  delete global[key];
});

},{"../internals/engine-webkit-version":90,"../internals/fails":98,"../internals/global":122,"../internals/is-pure":145}],191:[function(require,module,exports){
"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = require('../internals/function-uncurry-this-accessor');
var anObject = require('../internals/an-object');
var aPossiblePrototype = require('../internals/a-possible-prototype');

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) {/* empty */}
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);else O.__proto__ = proto;
    return O;
  };
}() : undefined);

},{"../internals/a-possible-prototype":5,"../internals/an-object":11,"../internals/function-uncurry-this-accessor":108}],192:[function(require,module,exports){
"use strict";

var DESCRIPTORS = require('../internals/descriptors');
var uncurryThis = require('../internals/function-uncurry-this');
var objectKeys = require('../internals/object-keys');
var toIndexedObject = require('../internals/to-indexed-object');
var $propertyIsEnumerable = require('../internals/object-property-is-enumerable').f;
var propertyIsEnumerable = uncurryThis($propertyIsEnumerable);
var push = uncurryThis([].push);

// `Object.{ entries, values }` methods implementation
var createMethod = function createMethod(TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || propertyIsEnumerable(O, key)) {
        push(result, TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};
module.exports = {
  // `Object.entries` method
  // https://tc39.es/ecma262/#sec-object.entries
  entries: createMethod(true),
  // `Object.values` method
  // https://tc39.es/ecma262/#sec-object.values
  values: createMethod(false)
};

},{"../internals/descriptors":72,"../internals/function-uncurry-this":110,"../internals/object-keys":188,"../internals/object-property-is-enumerable":189,"../internals/to-indexed-object":252}],193:[function(require,module,exports){
'use strict';

var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var classof = require('../internals/classof');

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

},{"../internals/classof":53,"../internals/to-string-tag-support":260}],194:[function(require,module,exports){
"use strict";

var call = require('../internals/function-call');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};

},{"../internals/function-call":106,"../internals/is-callable":138,"../internals/is-object":144}],195:[function(require,module,exports){
"use strict";

var getBuiltIn = require('../internals/get-built-in');
var uncurryThis = require('../internals/function-uncurry-this');
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var anObject = require('../internals/an-object');
var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};

},{"../internals/an-object":11,"../internals/function-uncurry-this":110,"../internals/get-built-in":113,"../internals/object-get-own-property-names":182,"../internals/object-get-own-property-symbols":183}],196:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var hasOwn = require('../internals/has-own-property');
var $SyntaxError = SyntaxError;
var $parseInt = parseInt;
var fromCharCode = String.fromCharCode;
var at = uncurryThis(''.charAt);
var slice = uncurryThis(''.slice);
var exec = uncurryThis(/./.exec);
var codePoints = {
  '\\"': '"',
  '\\\\': '\\',
  '\\/': '/',
  '\\b': '\b',
  '\\f': '\f',
  '\\n': '\n',
  '\\r': '\r',
  '\\t': '\t'
};
var IS_4_HEX_DIGITS = /^[\da-f]{4}$/i;
// eslint-disable-next-line regexp/no-control-character -- safe
var IS_C0_CONTROL_CODE = /^[\u0000-\u001F]$/;
module.exports = function (source, i) {
  var unterminated = true;
  var value = '';
  while (i < source.length) {
    var chr = at(source, i);
    if (chr == '\\') {
      var twoChars = slice(source, i, i + 2);
      if (hasOwn(codePoints, twoChars)) {
        value += codePoints[twoChars];
        i += 2;
      } else if (twoChars == "\\u") {
        i += 2;
        var fourHexDigits = slice(source, i, i + 4);
        if (!exec(IS_4_HEX_DIGITS, fourHexDigits)) throw $SyntaxError('Bad Unicode escape at: ' + i);
        value += fromCharCode($parseInt(fourHexDigits, 16));
        i += 4;
      } else throw $SyntaxError('Unknown escape sequence: "' + twoChars + '"');
    } else if (chr == '"') {
      unterminated = false;
      i++;
      break;
    } else {
      if (exec(IS_C0_CONTROL_CODE, chr)) throw $SyntaxError('Bad control character in string literal at: ' + i);
      value += chr;
      i++;
    }
  }
  if (unterminated) throw $SyntaxError('Unterminated string at: ' + i);
  return {
    value: value,
    end: i
  };
};

},{"../internals/function-uncurry-this":110,"../internals/has-own-property":123}],197:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
module.exports = global;

},{"../internals/global":122}],198:[function(require,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return {
      error: false,
      value: exec()
    };
  } catch (error) {
    return {
      error: true,
      value: error
    };
  }
};

},{}],199:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var NativePromiseConstructor = require('../internals/promise-native-constructor');
var isCallable = require('../internals/is-callable');
var isForced = require('../internals/is-forced');
var inspectSource = require('../internals/inspect-source');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_BROWSER = require('../internals/engine-is-browser');
var IS_DENO = require('../internals/engine-is-deno');
var IS_PURE = require('../internals/is-pure');
var V8_VERSION = require('../internals/engine-v8-version');
var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var SPECIES = wellKnownSymbol('species');
var SUBCLASSING = false;
var NATIVE_PROMISE_REJECTION_EVENT = isCallable(global.PromiseRejectionEvent);
var FORCED_PROMISE_CONSTRUCTOR = isForced('Promise', function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
  // We need Promise#{ catch, finally } in the pure version for preventing prototype pollution
  if (IS_PURE && !(NativePromisePrototype['catch'] && NativePromisePrototype['finally'])) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
    // Detect correctness of subclassing with @@species support
    var promise = new NativePromiseConstructor(function (resolve) {
      resolve(1);
    });
    var FakePromise = function FakePromise(exec) {
      exec(function () {/* empty */}, function () {/* empty */});
    };
    var constructor = promise.constructor = {};
    constructor[SPECIES] = FakePromise;
    SUBCLASSING = promise.then(function () {/* empty */}) instanceof FakePromise;
    if (!SUBCLASSING) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  }
  return !GLOBAL_CORE_JS_PROMISE && (IS_BROWSER || IS_DENO) && !NATIVE_PROMISE_REJECTION_EVENT;
});
module.exports = {
  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
  SUBCLASSING: SUBCLASSING
};

},{"../internals/engine-is-browser":80,"../internals/engine-is-deno":82,"../internals/engine-v8-version":89,"../internals/global":122,"../internals/inspect-source":131,"../internals/is-callable":138,"../internals/is-forced":141,"../internals/is-pure":145,"../internals/promise-native-constructor":200,"../internals/well-known-symbol":277}],200:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
module.exports = global.Promise;

},{"../internals/global":122}],201:[function(require,module,exports){
"use strict";

var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var newPromiseCapability = require('../internals/new-promise-capability');
module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"../internals/an-object":11,"../internals/is-object":144,"../internals/new-promise-capability":169}],202:[function(require,module,exports){
"use strict";

var NativePromiseConstructor = require('../internals/promise-native-constructor');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var FORCED_PROMISE_CONSTRUCTOR = require('../internals/promise-constructor-detection').CONSTRUCTOR;
module.exports = FORCED_PROMISE_CONSTRUCTOR || !checkCorrectnessOfIteration(function (iterable) {
  NativePromiseConstructor.all(iterable).then(undefined, function () {/* empty */});
});

},{"../internals/check-correctness-of-iteration":51,"../internals/promise-constructor-detection":199,"../internals/promise-native-constructor":200}],203:[function(require,module,exports){
"use strict";

var defineProperty = require('../internals/object-define-property').f;
module.exports = function (Target, Source, key) {
  key in Target || defineProperty(Target, key, {
    configurable: true,
    get: function get() {
      return Source[key];
    },
    set: function set(it) {
      Source[key] = it;
    }
  });
};

},{"../internals/object-define-property":179}],204:[function(require,module,exports){
"use strict";

var Queue = function Queue() {
  this.head = null;
  this.tail = null;
};
Queue.prototype = {
  add: function add(item) {
    var entry = {
      item: item,
      next: null
    };
    var tail = this.tail;
    if (tail) tail.next = entry;else this.head = entry;
    this.tail = entry;
  },
  get: function get() {
    var entry = this.head;
    if (entry) {
      var next = this.head = entry.next;
      if (next === null) this.tail = null;
      return entry.item;
    }
  }
};
module.exports = Queue;

},{}],205:[function(require,module,exports){
"use strict";

var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var isCallable = require('../internals/is-callable');
var classof = require('../internals/classof-raw');
var regexpExec = require('../internals/regexp-exec');
var $TypeError = TypeError;

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (isCallable(exec)) {
    var result = call(exec, R, S);
    if (result !== null) anObject(result);
    return result;
  }
  if (classof(R) === 'RegExp') return call(regexpExec, R, S);
  throw $TypeError('RegExp#exec called on incompatible receiver');
};

},{"../internals/an-object":11,"../internals/classof-raw":52,"../internals/function-call":106,"../internals/is-callable":138,"../internals/regexp-exec":206}],206:[function(require,module,exports){
'use strict';

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var toString = require('../internals/to-string');
var regexpFlags = require('../internals/regexp-flags');
var stickyHelpers = require('../internals/regexp-sticky-helpers');
var shared = require('../internals/shared');
var create = require('../internals/object-create');
var getInternalState = require('../internals/internal-state').get;
var UNSUPPORTED_DOT_ALL = require('../internals/regexp-unsupported-dot-all');
var UNSUPPORTED_NCG = require('../internals/regexp-unsupported-ncg');
var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt = uncurryThis(''.charAt);
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
var UPDATES_LAST_INDEX_WRONG = function () {
  var re1 = /a/;
  var re2 = /b*/g;
  call(nativeExec, re1, 'a');
  call(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
}();
var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;
if (PATCH) {
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;
    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = call(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }
    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = call(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;
    if (sticky) {
      flags = replace(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }
      strCopy = stringSlice(str, re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }
    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
    match = call(nativeExec, sticky ? reCopy : re, strCopy);
    if (sticky) {
      if (match) {
        match.input = stringSlice(match.input, charsAdded);
        match[0] = stringSlice(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
      call(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }
    if (match && groups) {
      match.groups = object = create(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }
    return match;
  };
}
module.exports = patchedExec;

},{"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/internal-state":134,"../internals/object-create":177,"../internals/regexp-flags":207,"../internals/regexp-sticky-helpers":209,"../internals/regexp-unsupported-dot-all":210,"../internals/regexp-unsupported-ncg":211,"../internals/shared":231,"../internals/to-string":261}],207:[function(require,module,exports){
'use strict';

var anObject = require('../internals/an-object');

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.unicodeSets) result += 'v';
  if (that.sticky) result += 'y';
  return result;
};

},{"../internals/an-object":11}],208:[function(require,module,exports){
"use strict";

var call = require('../internals/function-call');
var hasOwn = require('../internals/has-own-property');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var regExpFlags = require('../internals/regexp-flags');
var RegExpPrototype = RegExp.prototype;
module.exports = function (R) {
  var flags = R.flags;
  return flags === undefined && !('flags' in RegExpPrototype) && !hasOwn(R, 'flags') && isPrototypeOf(RegExpPrototype, R) ? call(regExpFlags, R) : flags;
};

},{"../internals/function-call":106,"../internals/has-own-property":123,"../internals/object-is-prototype-of":186,"../internals/regexp-flags":207}],209:[function(require,module,exports){
"use strict";

var fails = require('../internals/fails');
var global = require('../internals/global');

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = global.RegExp;
var UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

// UC Browser bug
// https://github.com/zloirock/core-js/issues/1008
var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
  return !$RegExp('a', 'y').sticky;
});
var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});
module.exports = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY,
  UNSUPPORTED_Y: UNSUPPORTED_Y
};

},{"../internals/fails":98,"../internals/global":122}],210:[function(require,module,exports){
"use strict";

var fails = require('../internals/fails');
var global = require('../internals/global');

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp = global.RegExp;
module.exports = fails(function () {
  var re = $RegExp('.', 's');
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});

},{"../internals/fails":98,"../internals/global":122}],211:[function(require,module,exports){
"use strict";

var fails = require('../internals/fails');
var global = require('../internals/global');

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = global.RegExp;
module.exports = fails(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' || 'b'.replace(re, '$<a>c') !== 'bc';
});

},{"../internals/fails":98,"../internals/global":122}],212:[function(require,module,exports){
"use strict";

var isNullOrUndefined = require('../internals/is-null-or-undefined');
var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};

},{"../internals/is-null-or-undefined":143}],213:[function(require,module,exports){
"use strict";

// `SameValue` abstract operation
// https://tc39.es/ecma262/#sec-samevalue
// eslint-disable-next-line es/no-object-is -- safe
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare -- NaN check
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],214:[function(require,module,exports){
'use strict';

var global = require('../internals/global');
var apply = require('../internals/function-apply');
var isCallable = require('../internals/is-callable');
var ENGINE_IS_BUN = require('../internals/engine-is-bun');
var USER_AGENT = require('../internals/engine-user-agent');
var arraySlice = require('../internals/array-slice');
var validateArgumentsLength = require('../internals/validate-arguments-length');
var Function = global.Function;
// dirty IE9- and Bun 0.3.0- checks
var WRAP = /MSIE .\./.test(USER_AGENT) || ENGINE_IS_BUN && function () {
  var version = global.Bun.version.split('.');
  return version.length < 3 || version[0] == 0 && (version[1] < 3 || version[1] == 3 && version[2] == 0);
}();

// IE9- / Bun 0.3.0- setTimeout / setInterval / setImmediate additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
// https://github.com/oven-sh/bun/issues/1633
module.exports = function (scheduler, hasTimeArg) {
  var firstParamIndex = hasTimeArg ? 2 : 1;
  return WRAP ? function (handler, timeout /* , ...arguments */) {
    var boundArgs = validateArgumentsLength(arguments.length, 1) > firstParamIndex;
    var fn = isCallable(handler) ? handler : Function(handler);
    var params = boundArgs ? arraySlice(arguments, firstParamIndex) : [];
    var callback = boundArgs ? function () {
      apply(fn, this, params);
    } : fn;
    return hasTimeArg ? scheduler(callback, timeout) : scheduler(callback);
  } : scheduler;
};

},{"../internals/array-slice":36,"../internals/engine-is-bun":81,"../internals/engine-user-agent":88,"../internals/function-apply":102,"../internals/global":122,"../internals/is-callable":138,"../internals/validate-arguments-length":273}],215:[function(require,module,exports){
"use strict";

var SetHelpers = require('../internals/set-helpers');
var iterate = require('../internals/set-iterate');
var Set = SetHelpers.Set;
var add = SetHelpers.add;
module.exports = function (set) {
  var result = new Set();
  iterate(set, function (it) {
    add(result, it);
  });
  return result;
};

},{"../internals/set-helpers":217,"../internals/set-iterate":222}],216:[function(require,module,exports){
'use strict';

var aSet = require('../internals/a-set');
var SetHelpers = require('../internals/set-helpers');
var clone = require('../internals/set-clone');
var size = require('../internals/set-size');
var getSetRecord = require('../internals/get-set-record');
var iterateSet = require('../internals/set-iterate');
var iterateSimple = require('../internals/iterate-simple');
var has = SetHelpers.has;
var remove = SetHelpers.remove;

// `Set.prototype.difference` method
// https://github.com/tc39/proposal-set-methods
module.exports = function difference(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  var result = clone(O);
  if (size(O) <= otherRec.size) iterateSet(O, function (e) {
    if (otherRec.includes(e)) remove(result, e);
  });else iterateSimple(otherRec.getIterator(), function (e) {
    if (has(O, e)) remove(result, e);
  });
  return result;
};

},{"../internals/a-set":6,"../internals/get-set-record":120,"../internals/iterate-simple":149,"../internals/set-clone":215,"../internals/set-helpers":217,"../internals/set-iterate":222,"../internals/set-size":224}],217:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');

// eslint-disable-next-line es/no-set -- safe
var SetPrototype = Set.prototype;
module.exports = {
  // eslint-disable-next-line es/no-set -- safe
  Set: Set,
  add: uncurryThis(SetPrototype.add),
  has: uncurryThis(SetPrototype.has),
  remove: uncurryThis(SetPrototype['delete']),
  proto: SetPrototype,
  $has: SetPrototype.has,
  $keys: SetPrototype.keys
};

},{"../internals/function-uncurry-this":110}],218:[function(require,module,exports){
'use strict';

var aSet = require('../internals/a-set');
var SetHelpers = require('../internals/set-helpers');
var size = require('../internals/set-size');
var getSetRecord = require('../internals/get-set-record');
var iterateSet = require('../internals/set-iterate');
var iterateSimple = require('../internals/iterate-simple');
var Set = SetHelpers.Set;
var add = SetHelpers.add;
var has = SetHelpers.has;
var nativeHas = SetHelpers.$has;
var nativeKeys = SetHelpers.$keys;
var isNativeSetRecord = function isNativeSetRecord(record) {
  return record.has === nativeHas && record.keys === nativeKeys;
};

// `Set.prototype.intersection` method
// https://github.com/tc39/proposal-set-methods
module.exports = function intersection(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  var result = new Set();

  // observable side effects
  if (!isNativeSetRecord(otherRec) && size(O) > otherRec.size) {
    iterateSimple(otherRec.getIterator(), function (e) {
      if (has(O, e)) add(result, e);
    });
    if (size(result) < 2) return result;
    var disordered = result;
    result = new Set();
    iterateSet(O, function (e) {
      if (has(disordered, e)) add(result, e);
    });
  } else {
    iterateSet(O, function (e) {
      if (otherRec.includes(e)) add(result, e);
    });
  }
  return result;
};

},{"../internals/a-set":6,"../internals/get-set-record":120,"../internals/iterate-simple":149,"../internals/set-helpers":217,"../internals/set-iterate":222,"../internals/set-size":224}],219:[function(require,module,exports){
'use strict';

var aSet = require('../internals/a-set');
var has = require('../internals/set-helpers').has;
var size = require('../internals/set-size');
var getSetRecord = require('../internals/get-set-record');
var iterateSet = require('../internals/set-iterate');
var iterateSimple = require('../internals/iterate-simple');
var iteratorClose = require('../internals/iterator-close');

// `Set.prototype.isDisjointFrom` method
// https://tc39.github.io/proposal-set-methods/#Set.prototype.isDisjointFrom
module.exports = function isDisjointFrom(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  if (size(O) <= otherRec.size) return iterateSet(O, function (e) {
    if (otherRec.includes(e)) return false;
  }, true) !== false;
  var iterator = otherRec.getIterator();
  return iterateSimple(iterator, function (e) {
    if (has(O, e)) return iteratorClose(iterator, 'normal', false);
  }) !== false;
};

},{"../internals/a-set":6,"../internals/get-set-record":120,"../internals/iterate-simple":149,"../internals/iterator-close":151,"../internals/set-helpers":217,"../internals/set-iterate":222,"../internals/set-size":224}],220:[function(require,module,exports){
'use strict';

var aSet = require('../internals/a-set');
var size = require('../internals/set-size');
var iterate = require('../internals/set-iterate');
var getSetRecord = require('../internals/get-set-record');

// `Set.prototype.isSubsetOf` method
// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSubsetOf
module.exports = function isSubsetOf(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  if (size(O) > otherRec.size) return false;
  return iterate(O, function (e) {
    if (!otherRec.includes(e)) return false;
  }, true) !== false;
};

},{"../internals/a-set":6,"../internals/get-set-record":120,"../internals/set-iterate":222,"../internals/set-size":224}],221:[function(require,module,exports){
'use strict';

var aSet = require('../internals/a-set');
var has = require('../internals/set-helpers').has;
var size = require('../internals/set-size');
var getSetRecord = require('../internals/get-set-record');
var iterateSimple = require('../internals/iterate-simple');
var iteratorClose = require('../internals/iterator-close');

// `Set.prototype.isSupersetOf` method
// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSupersetOf
module.exports = function isSupersetOf(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  if (size(O) < otherRec.size) return false;
  var iterator = otherRec.getIterator();
  return iterateSimple(iterator, function (e) {
    if (!has(O, e)) return iteratorClose(iterator, 'normal', false);
  }) !== false;
};

},{"../internals/a-set":6,"../internals/get-set-record":120,"../internals/iterate-simple":149,"../internals/iterator-close":151,"../internals/set-helpers":217,"../internals/set-size":224}],222:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var iterateSimple = require('../internals/iterate-simple');
var SetHelpers = require('../internals/set-helpers');
var Set = SetHelpers.Set;
var SetPrototype = SetHelpers.proto;
var forEach = uncurryThis(SetPrototype.forEach);
var keys = uncurryThis(SetPrototype.keys);
var next = keys(new Set()).next;
module.exports = function (set, fn, interruptible) {
  return interruptible ? iterateSimple(keys(set), fn, next) : forEach(set, fn);
};

},{"../internals/function-uncurry-this":110,"../internals/iterate-simple":149,"../internals/set-helpers":217}],223:[function(require,module,exports){
"use strict";

var getBuiltIn = require('../internals/get-built-in');
var createEmptySetLike = function createEmptySetLike() {
  return {
    size: 0,
    has: function has() {
      return false;
    },
    keys: function keys() {
      return {
        next: function next() {
          return {
            done: true
          };
        }
      };
    }
  };
};
module.exports = function (name) {
  try {
    var Set = getBuiltIn('Set');
    new Set()[name](createEmptySetLike());
    return true;
  } catch (error) {
    return false;
  }
};

},{"../internals/get-built-in":113}],224:[function(require,module,exports){
"use strict";

var uncurryThisAccessor = require('../internals/function-uncurry-this-accessor');
var SetHelpers = require('../internals/set-helpers');
module.exports = uncurryThisAccessor(SetHelpers.proto, 'size', 'get') || function (set) {
  return set.size;
};

},{"../internals/function-uncurry-this-accessor":108,"../internals/set-helpers":217}],225:[function(require,module,exports){
'use strict';

var getBuiltIn = require('../internals/get-built-in');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var wellKnownSymbol = require('../internals/well-known-symbol');
var DESCRIPTORS = require('../internals/descriptors');
var SPECIES = wellKnownSymbol('species');
module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineBuiltInAccessor(Constructor, SPECIES, {
      configurable: true,
      get: function get() {
        return this;
      }
    });
  }
};

},{"../internals/define-built-in-accessor":67,"../internals/descriptors":72,"../internals/get-built-in":113,"../internals/well-known-symbol":277}],226:[function(require,module,exports){
'use strict';

var aSet = require('../internals/a-set');
var SetHelpers = require('../internals/set-helpers');
var clone = require('../internals/set-clone');
var getSetRecord = require('../internals/get-set-record');
var iterateSimple = require('../internals/iterate-simple');
var add = SetHelpers.add;
var has = SetHelpers.has;
var remove = SetHelpers.remove;

// `Set.prototype.symmetricDifference` method
// https://github.com/tc39/proposal-set-methods
module.exports = function symmetricDifference(other) {
  var O = aSet(this);
  var keysIter = getSetRecord(other).getIterator();
  var result = clone(O);
  iterateSimple(keysIter, function (e) {
    if (has(O, e)) remove(result, e);else add(result, e);
  });
  return result;
};

},{"../internals/a-set":6,"../internals/get-set-record":120,"../internals/iterate-simple":149,"../internals/set-clone":215,"../internals/set-helpers":217}],227:[function(require,module,exports){
"use strict";

var defineProperty = require('../internals/object-define-property').f;
var hasOwn = require('../internals/has-own-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
module.exports = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG)) {
    defineProperty(target, TO_STRING_TAG, {
      configurable: true,
      value: TAG
    });
  }
};

},{"../internals/has-own-property":123,"../internals/object-define-property":179,"../internals/well-known-symbol":277}],228:[function(require,module,exports){
'use strict';

var aSet = require('../internals/a-set');
var add = require('../internals/set-helpers').add;
var clone = require('../internals/set-clone');
var getSetRecord = require('../internals/get-set-record');
var iterateSimple = require('../internals/iterate-simple');

// `Set.prototype.union` method
// https://github.com/tc39/proposal-set-methods
module.exports = function union(other) {
  var O = aSet(this);
  var keysIter = getSetRecord(other).getIterator();
  var result = clone(O);
  iterateSimple(keysIter, function (it) {
    add(result, it);
  });
  return result;
};

},{"../internals/a-set":6,"../internals/get-set-record":120,"../internals/iterate-simple":149,"../internals/set-clone":215,"../internals/set-helpers":217}],229:[function(require,module,exports){
"use strict";

var shared = require('../internals/shared');
var uid = require('../internals/uid');
var keys = shared('keys');
module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

},{"../internals/shared":231,"../internals/uid":269}],230:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var defineGlobalProperty = require('../internals/define-global-property');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});
module.exports = store;

},{"../internals/define-global-property":70,"../internals/global":122}],231:[function(require,module,exports){
"use strict";

var IS_PURE = require('../internals/is-pure');
var store = require('../internals/shared-store');
(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.28.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.28.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

},{"../internals/is-pure":145,"../internals/shared-store":230}],232:[function(require,module,exports){
"use strict";

var anObject = require('../internals/an-object');
var aConstructor = require('../internals/a-constructor');
var isNullOrUndefined = require('../internals/is-null-or-undefined');
var wellKnownSymbol = require('../internals/well-known-symbol');
var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES]) ? defaultConstructor : aConstructor(S);
};

},{"../internals/a-constructor":4,"../internals/an-object":11,"../internals/is-null-or-undefined":143,"../internals/well-known-symbol":277}],233:[function(require,module,exports){
"use strict";

var fails = require('../internals/fails');

// check the existence of a method, lowercase
// of a tag and escaping quotes in arguments
module.exports = function (METHOD_NAME) {
  return fails(function () {
    var test = ''[METHOD_NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  });
};

},{"../internals/fails":98}],234:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);
var createMethod = function createMethod(CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? charAt(S, position) : first : CONVERT_TO_STRING ? stringSlice(S, position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};
module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};

},{"../internals/function-uncurry-this":110,"../internals/require-object-coercible":212,"../internals/to-integer-or-infinity":253,"../internals/to-string":261}],235:[function(require,module,exports){
"use strict";

// https://github.com/zloirock/core-js/issues/280
var userAgent = require('../internals/engine-user-agent');
module.exports = /Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(userAgent);

},{"../internals/engine-user-agent":88}],236:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var uncurryThis = require('../internals/function-uncurry-this');
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var $repeat = require('../internals/string-repeat');
var requireObjectCoercible = require('../internals/require-object-coercible');
var repeat = uncurryThis($repeat);
var stringSlice = uncurryThis(''.slice);
var ceil = Math.ceil;

// `String.prototype.{ padStart, padEnd }` methods implementation
var createMethod = function createMethod(IS_END) {
  return function ($this, maxLength, fillString) {
    var S = toString(requireObjectCoercible($this));
    var intMaxLength = toLength(maxLength);
    var stringLength = S.length;
    var fillStr = fillString === undefined ? ' ' : toString(fillString);
    var fillLen, stringFiller;
    if (intMaxLength <= stringLength || fillStr == '') return S;
    fillLen = intMaxLength - stringLength;
    stringFiller = repeat(fillStr, ceil(fillLen / fillStr.length));
    if (stringFiller.length > fillLen) stringFiller = stringSlice(stringFiller, 0, fillLen);
    return IS_END ? S + stringFiller : stringFiller + S;
  };
};
module.exports = {
  // `String.prototype.padStart` method
  // https://tc39.es/ecma262/#sec-string.prototype.padstart
  start: createMethod(false),
  // `String.prototype.padEnd` method
  // https://tc39.es/ecma262/#sec-string.prototype.padend
  end: createMethod(true)
};

},{"../internals/function-uncurry-this":110,"../internals/require-object-coercible":212,"../internals/string-repeat":238,"../internals/to-length":254,"../internals/to-string":261}],237:[function(require,module,exports){
"use strict";

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var uncurryThis = require('../internals/function-uncurry-this');
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var $RangeError = RangeError;
var exec = uncurryThis(regexSeparators.exec);
var floor = Math.floor;
var fromCharCode = String.fromCharCode;
var charCodeAt = uncurryThis(''.charCodeAt);
var join = uncurryThis([].join);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var split = uncurryThis(''.split);
var toLowerCase = uncurryThis(''.toLowerCase);

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function ucs2decode(string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = charCodeAt(string, counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = charCodeAt(string, counter++);
      if ((extra & 0xFC00) == 0xDC00) {
        // Low surrogate.
        push(output, ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        push(output, value);
        counter--;
      }
    } else {
      push(output, value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function digitToBasic(digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function adapt(delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  while (delta > baseMinusTMin * tMax >> 1) {
    delta = floor(delta / baseMinusTMin);
    k += base;
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
var encode = function encode(input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      push(output, fromCharCode(currentValue));
    }
  }
  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    push(output, delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      throw $RangeError(OVERFLOW_ERROR);
    }
    delta += (m - n) * handledCPCountPlusOne;
    n = m;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw $RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        var k = base;
        while (true) {
          var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          push(output, fromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor(qMinusT / baseMinusT);
          k += base;
        }
        push(output, fromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        handledCPCount++;
      }
    }
    delta++;
    n++;
  }
  return join(output, '');
};
module.exports = function (input) {
  var encoded = [];
  var labels = split(replace(toLowerCase(input), regexSeparators, "."), '.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    push(encoded, exec(regexNonASCII, label) ? 'xn--' + encode(label) : label);
  }
  return join(encoded, '.');
};

},{"../internals/function-uncurry-this":110}],238:[function(require,module,exports){
'use strict';

var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');
var $RangeError = RangeError;

// `String.prototype.repeat` method implementation
// https://tc39.es/ecma262/#sec-string.prototype.repeat
module.exports = function repeat(count) {
  var str = toString(requireObjectCoercible(this));
  var result = '';
  var n = toIntegerOrInfinity(count);
  if (n < 0 || n == Infinity) throw $RangeError('Wrong number of repetitions');
  for (; n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};

},{"../internals/require-object-coercible":212,"../internals/to-integer-or-infinity":253,"../internals/to-string":261}],239:[function(require,module,exports){
'use strict';

var $trimEnd = require('../internals/string-trim').end;
var forcedStringTrimMethod = require('../internals/string-trim-forced');

// `String.prototype.{ trimEnd, trimRight }` method
// https://tc39.es/ecma262/#sec-string.prototype.trimend
// https://tc39.es/ecma262/#String.prototype.trimright
module.exports = forcedStringTrimMethod('trimEnd') ? function trimEnd() {
  return $trimEnd(this);
  // eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
} : ''.trimEnd;

},{"../internals/string-trim":242,"../internals/string-trim-forced":240}],240:[function(require,module,exports){
"use strict";

var PROPER_FUNCTION_NAME = require('../internals/function-name').PROPER;
var fails = require('../internals/fails');
var whitespaces = require('../internals/whitespaces');
var non = "\u200B\x85\u180E";

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() !== non || PROPER_FUNCTION_NAME && whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};

},{"../internals/fails":98,"../internals/function-name":107,"../internals/whitespaces":278}],241:[function(require,module,exports){
'use strict';

var $trimStart = require('../internals/string-trim').start;
var forcedStringTrimMethod = require('../internals/string-trim-forced');

// `String.prototype.{ trimStart, trimLeft }` method
// https://tc39.es/ecma262/#sec-string.prototype.trimstart
// https://tc39.es/ecma262/#String.prototype.trimleft
module.exports = forcedStringTrimMethod('trimStart') ? function trimStart() {
  return $trimStart(this);
  // eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
} : ''.trimStart;

},{"../internals/string-trim":242,"../internals/string-trim-forced":240}],242:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toString = require('../internals/to-string');
var whitespaces = require('../internals/whitespaces');
var replace = uncurryThis(''.replace);
var ltrim = RegExp('^[' + whitespaces + ']+');
var rtrim = RegExp('(^|[^' + whitespaces + '])[' + whitespaces + ']+$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function createMethod(TYPE) {
  return function ($this) {
    var string = toString(requireObjectCoercible($this));
    if (TYPE & 1) string = replace(string, ltrim, '');
    if (TYPE & 2) string = replace(string, rtrim, '$1');
    return string;
  };
};
module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};

},{"../internals/function-uncurry-this":110,"../internals/require-object-coercible":212,"../internals/to-string":261,"../internals/whitespaces":278}],243:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var fails = require('../internals/fails');
var V8 = require('../internals/engine-v8-version');
var IS_BROWSER = require('../internals/engine-is-browser');
var IS_DENO = require('../internals/engine-is-deno');
var IS_NODE = require('../internals/engine-is-node');
var structuredClone = global.structuredClone;
module.exports = !!structuredClone && !fails(function () {
  // prevent V8 ArrayBufferDetaching protector cell invalidation and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (IS_DENO && V8 > 92 || IS_NODE && V8 > 94 || IS_BROWSER && V8 > 97) return false;
  var buffer = new ArrayBuffer(8);
  var clone = structuredClone(buffer, {
    transfer: [buffer]
  });
  return buffer.byteLength != 0 || clone.byteLength != 8;
});

},{"../internals/engine-is-browser":80,"../internals/engine-is-deno":82,"../internals/engine-is-node":86,"../internals/engine-v8-version":89,"../internals/fails":98,"../internals/global":122}],244:[function(require,module,exports){
"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = require('../internals/engine-v8-version');
var fails = require('../internals/fails');

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
  // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
  !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

},{"../internals/engine-v8-version":89,"../internals/fails":98}],245:[function(require,module,exports){
"use strict";

var call = require('../internals/function-call');
var getBuiltIn = require('../internals/get-built-in');
var wellKnownSymbol = require('../internals/well-known-symbol');
var defineBuiltIn = require('../internals/define-built-in');
module.exports = function () {
  var _Symbol = getBuiltIn('Symbol');
  var SymbolPrototype = _Symbol && _Symbol.prototype;
  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    // eslint-disable-next-line no-unused-vars -- required for .length
    defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function (hint) {
      return call(valueOf, this);
    }, {
      arity: 1
    });
  }
};

},{"../internals/define-built-in":68,"../internals/function-call":106,"../internals/get-built-in":113,"../internals/well-known-symbol":277}],246:[function(require,module,exports){
"use strict";

var NATIVE_SYMBOL = require('../internals/symbol-constructor-detection');

/* eslint-disable es/no-symbol -- safe */
module.exports = NATIVE_SYMBOL && !!Symbol['for'] && !!Symbol.keyFor;

},{"../internals/symbol-constructor-detection":244}],247:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var apply = require('../internals/function-apply');
var bind = require('../internals/function-bind-context');
var isCallable = require('../internals/is-callable');
var hasOwn = require('../internals/has-own-property');
var fails = require('../internals/fails');
var html = require('../internals/html');
var arraySlice = require('../internals/array-slice');
var createElement = require('../internals/document-create-element');
var validateArgumentsLength = require('../internals/validate-arguments-length');
var IS_IOS = require('../internals/engine-is-ios');
var IS_NODE = require('../internals/engine-is-node');
var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var Dispatch = global.Dispatch;
var Function = global.Function;
var MessageChannel = global.MessageChannel;
var String = global.String;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var $location, defer, channel, port;
fails(function () {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  $location = global.location;
});
var run = function run(id) {
  if (hasOwn(queue, id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var runner = function runner(id) {
  return function () {
    run(id);
  };
};
var eventListener = function eventListener(event) {
  run(event.data);
};
var globalPostMessageDefer = function globalPostMessageDefer(id) {
  // old engines have not location.origin
  global.postMessage(String(id), $location.protocol + '//' + $location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(handler) {
    validateArgumentsLength(arguments.length, 1);
    var fn = isCallable(handler) ? handler : Function(handler);
    var args = arraySlice(arguments, 1);
    queue[++counter] = function () {
      apply(fn, undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (IS_NODE) {
    defer = function defer(id) {
      process.nextTick(runner(id));
    };
    // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function defer(id) {
      Dispatch.now(runner(id));
    };
    // Browsers with MessageChannel, includes WebWorkers
    // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = eventListener;
    defer = bind(port.postMessage, port);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && isCallable(global.postMessage) && !global.importScripts && $location && $location.protocol !== 'file:' && !fails(globalPostMessageDefer)) {
    defer = globalPostMessageDefer;
    global.addEventListener('message', eventListener, false);
    // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function defer(id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
    // Rest old browsers
  } else {
    defer = function defer(id) {
      setTimeout(runner(id), 0);
    };
  }
}
module.exports = {
  set: set,
  clear: clear
};

},{"../internals/array-slice":36,"../internals/document-create-element":74,"../internals/engine-is-ios":85,"../internals/engine-is-node":86,"../internals/fails":98,"../internals/function-apply":102,"../internals/function-bind-context":103,"../internals/global":122,"../internals/has-own-property":123,"../internals/html":126,"../internals/is-callable":138,"../internals/validate-arguments-length":273}],248:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');

// `thisNumberValue` abstract operation
// https://tc39.es/ecma262/#sec-thisnumbervalue
module.exports = uncurryThis(1.0.valueOf);

},{"../internals/function-uncurry-this":110}],249:[function(require,module,exports){
"use strict";

var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

},{"../internals/to-integer-or-infinity":253}],250:[function(require,module,exports){
"use strict";

var toPrimitive = require('../internals/to-primitive');
var $TypeError = TypeError;

// `ToBigInt` abstract operation
// https://tc39.es/ecma262/#sec-tobigint
module.exports = function (argument) {
  var prim = toPrimitive(argument, 'number');
  if (typeof prim == 'number') throw $TypeError("Can't convert number to bigint");
  // eslint-disable-next-line es/no-bigint -- safe
  return BigInt(prim);
};

},{"../internals/to-primitive":258}],251:[function(require,module,exports){
"use strict";

var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toLength = require('../internals/to-length');
var $RangeError = RangeError;

// `ToIndex` abstract operation
// https://tc39.es/ecma262/#sec-toindex
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toIntegerOrInfinity(it);
  var length = toLength(number);
  if (number !== length) throw $RangeError('Wrong length or index');
  return length;
};

},{"../internals/to-integer-or-infinity":253,"../internals/to-length":254}],252:[function(require,module,exports){
"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = require('../internals/indexed-object');
var requireObjectCoercible = require('../internals/require-object-coercible');
module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

},{"../internals/indexed-object":129,"../internals/require-object-coercible":212}],253:[function(require,module,exports){
"use strict";

var trunc = require('../internals/math-trunc');

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};

},{"../internals/math-trunc":166}],254:[function(require,module,exports){
"use strict";

var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

},{"../internals/to-integer-or-infinity":253}],255:[function(require,module,exports){
"use strict";

var requireObjectCoercible = require('../internals/require-object-coercible');
var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};

},{"../internals/require-object-coercible":212}],256:[function(require,module,exports){
"use strict";

var toPositiveInteger = require('../internals/to-positive-integer');
var $RangeError = RangeError;
module.exports = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw $RangeError('Wrong offset');
  return offset;
};

},{"../internals/to-positive-integer":257}],257:[function(require,module,exports){
"use strict";

var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var $RangeError = RangeError;
module.exports = function (it) {
  var result = toIntegerOrInfinity(it);
  if (result < 0) throw $RangeError("The argument can't be less than 0");
  return result;
};

},{"../internals/to-integer-or-infinity":253}],258:[function(require,module,exports){
"use strict";

var call = require('../internals/function-call');
var isObject = require('../internals/is-object');
var isSymbol = require('../internals/is-symbol');
var getMethod = require('../internals/get-method');
var ordinaryToPrimitive = require('../internals/ordinary-to-primitive');
var wellKnownSymbol = require('../internals/well-known-symbol');
var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

},{"../internals/function-call":106,"../internals/get-method":119,"../internals/is-object":144,"../internals/is-symbol":148,"../internals/ordinary-to-primitive":194,"../internals/well-known-symbol":277}],259:[function(require,module,exports){
"use strict";

var toPrimitive = require('../internals/to-primitive');
var isSymbol = require('../internals/is-symbol');

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

},{"../internals/is-symbol":148,"../internals/to-primitive":258}],260:[function(require,module,exports){
"use strict";

var wellKnownSymbol = require('../internals/well-known-symbol');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};
test[TO_STRING_TAG] = 'z';
module.exports = String(test) === '[object z]';

},{"../internals/well-known-symbol":277}],261:[function(require,module,exports){
"use strict";

var classof = require('../internals/classof');
var $String = String;
module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};

},{"../internals/classof":53}],262:[function(require,module,exports){
"use strict";

var IS_NODE = require('../internals/engine-is-node');
module.exports = function (name) {
  try {
    // eslint-disable-next-line no-new-func -- safe
    if (IS_NODE) return Function('return require("' + name + '")')();
  } catch (error) {/* empty */}
};

},{"../internals/engine-is-node":86}],263:[function(require,module,exports){
"use strict";

var $String = String;
module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};

},{}],264:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var global = require('../internals/global');
var call = require('../internals/function-call');
var DESCRIPTORS = require('../internals/descriptors');
var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-array-constructors-require-wrappers');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var ArrayBufferModule = require('../internals/array-buffer');
var anInstance = require('../internals/an-instance');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var isIntegralNumber = require('../internals/is-integral-number');
var toLength = require('../internals/to-length');
var toIndex = require('../internals/to-index');
var toOffset = require('../internals/to-offset');
var toPropertyKey = require('../internals/to-property-key');
var hasOwn = require('../internals/has-own-property');
var classof = require('../internals/classof');
var isObject = require('../internals/is-object');
var isSymbol = require('../internals/is-symbol');
var create = require('../internals/object-create');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var typedArrayFrom = require('../internals/typed-array-from');
var forEach = require('../internals/array-iteration').forEach;
var setSpecies = require('../internals/set-species');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var definePropertyModule = require('../internals/object-define-property');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var InternalStateModule = require('../internals/internal-state');
var inheritIfRequired = require('../internals/inherit-if-required');
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var enforceInternalState = InternalStateModule.enforce;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var round = Math.round;
var RangeError = global.RangeError;
var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
var ArrayBufferPrototype = ArrayBuffer.prototype;
var DataView = ArrayBufferModule.DataView;
var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
var TYPED_ARRAY_TAG = ArrayBufferViewCore.TYPED_ARRAY_TAG;
var TypedArray = ArrayBufferViewCore.TypedArray;
var TypedArrayPrototype = ArrayBufferViewCore.TypedArrayPrototype;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var isTypedArray = ArrayBufferViewCore.isTypedArray;
var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
var WRONG_LENGTH = 'Wrong length';
var fromList = function fromList(C, list) {
  aTypedArrayConstructor(C);
  var index = 0;
  var length = list.length;
  var result = new C(length);
  while (length > index) result[index] = list[index++];
  return result;
};
var addGetter = function addGetter(it, key) {
  defineBuiltInAccessor(it, key, {
    configurable: true,
    get: function get() {
      return getInternalState(this)[key];
    }
  });
};
var isArrayBuffer = function isArrayBuffer(it) {
  var klass;
  return isPrototypeOf(ArrayBufferPrototype, it) || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
};
var isTypedArrayIndex = function isTypedArrayIndex(target, key) {
  return isTypedArray(target) && !isSymbol(key) && key in target && isIntegralNumber(+key) && key >= 0;
};
var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
  key = toPropertyKey(key);
  return isTypedArrayIndex(target, key) ? createPropertyDescriptor(2, target[key]) : nativeGetOwnPropertyDescriptor(target, key);
};
var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
  key = toPropertyKey(key);
  if (isTypedArrayIndex(target, key) && isObject(descriptor) && hasOwn(descriptor, 'value') && !hasOwn(descriptor, 'get') && !hasOwn(descriptor, 'set')
  // TODO: add validation descriptor w/o calling accessors
  && !descriptor.configurable && (!hasOwn(descriptor, 'writable') || descriptor.writable) && (!hasOwn(descriptor, 'enumerable') || descriptor.enumerable)) {
    target[key] = descriptor.value;
    return target;
  }
  return nativeDefineProperty(target, key, descriptor);
};
if (DESCRIPTORS) {
  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
    getOwnPropertyDescriptorModule.f = wrappedGetOwnPropertyDescriptor;
    definePropertyModule.f = wrappedDefineProperty;
    addGetter(TypedArrayPrototype, 'buffer');
    addGetter(TypedArrayPrototype, 'byteOffset');
    addGetter(TypedArrayPrototype, 'byteLength');
    addGetter(TypedArrayPrototype, 'length');
  }
  $({
    target: 'Object',
    stat: true,
    forced: !NATIVE_ARRAY_BUFFER_VIEWS
  }, {
    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
    defineProperty: wrappedDefineProperty
  });
  module.exports = function (TYPE, wrapper, CLAMPED) {
    var BYTES = TYPE.match(/\d+/)[0] / 8;
    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + TYPE;
    var SETTER = 'set' + TYPE;
    var NativeTypedArrayConstructor = global[CONSTRUCTOR_NAME];
    var TypedArrayConstructor = NativeTypedArrayConstructor;
    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
    var exported = {};
    var getter = function getter(that, index) {
      var data = getInternalState(that);
      return data.view[GETTER](index * BYTES + data.byteOffset, true);
    };
    var setter = function setter(that, index, value) {
      var data = getInternalState(that);
      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
    };
    var addElement = function addElement(that, index) {
      nativeDefineProperty(that, index, {
        get: function get() {
          return getter(this, index);
        },
        set: function set(value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
        anInstance(that, TypedArrayConstructorPrototype);
        var index = 0;
        var byteOffset = 0;
        var buffer, byteLength, length;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new ArrayBuffer(byteLength);
        } else if (isArrayBuffer(data)) {
          buffer = data;
          byteOffset = toOffset(offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - byteOffset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (isTypedArray(data)) {
          return fromList(TypedArrayConstructor, data);
        } else {
          return call(typedArrayFrom, TypedArrayConstructor, data);
        }
        setInternalState(that, {
          buffer: buffer,
          byteOffset: byteOffset,
          byteLength: byteLength,
          length: length,
          view: new DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create(TypedArrayPrototype);
    } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
        anInstance(dummy, TypedArrayConstructorPrototype);
        return inheritIfRequired(function () {
          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
          if (isArrayBuffer(data)) return $length !== undefined ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length) : typedArrayOffset !== undefined ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES)) : new NativeTypedArrayConstructor(data);
          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
          return call(typedArrayFrom, TypedArrayConstructor, data);
        }(), dummy, TypedArrayConstructor);
      });
      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
        if (!(key in TypedArrayConstructor)) {
          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
        }
      });
      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
    }
    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
    }
    enforceInternalState(TypedArrayConstructorPrototype).TypedArrayConstructor = TypedArrayConstructor;
    if (TYPED_ARRAY_TAG) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
    }
    var FORCED = TypedArrayConstructor != NativeTypedArrayConstructor;
    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;
    $({
      global: true,
      constructor: true,
      forced: FORCED,
      sham: !NATIVE_ARRAY_BUFFER_VIEWS
    }, exported);
    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
    }
    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
    }
    setSpecies(CONSTRUCTOR_NAME);
  };
} else module.exports = function () {/* empty */};

},{"../internals/an-instance":10,"../internals/array-buffer":18,"../internals/array-buffer-view-core":17,"../internals/array-iteration":29,"../internals/classof":53,"../internals/create-non-enumerable-property":62,"../internals/create-property-descriptor":63,"../internals/define-built-in-accessor":67,"../internals/descriptors":72,"../internals/export":97,"../internals/function-call":106,"../internals/global":122,"../internals/has-own-property":123,"../internals/inherit-if-required":130,"../internals/internal-state":134,"../internals/is-integral-number":142,"../internals/is-object":144,"../internals/is-symbol":148,"../internals/object-create":177,"../internals/object-define-property":179,"../internals/object-get-own-property-descriptor":180,"../internals/object-get-own-property-names":182,"../internals/object-is-prototype-of":186,"../internals/object-set-prototype-of":191,"../internals/set-species":225,"../internals/to-index":251,"../internals/to-length":254,"../internals/to-offset":256,"../internals/to-property-key":259,"../internals/typed-array-constructors-require-wrappers":265,"../internals/typed-array-from":267}],265:[function(require,module,exports){
"use strict";

/* eslint-disable no-new -- required for testing */
var global = require('../internals/global');
var fails = require('../internals/fails');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var NATIVE_ARRAY_BUFFER_VIEWS = require('../internals/array-buffer-view-core').NATIVE_ARRAY_BUFFER_VIEWS;
var ArrayBuffer = global.ArrayBuffer;
var Int8Array = global.Int8Array;
module.exports = !NATIVE_ARRAY_BUFFER_VIEWS || !fails(function () {
  Int8Array(1);
}) || !fails(function () {
  new Int8Array(-1);
}) || !checkCorrectnessOfIteration(function (iterable) {
  new Int8Array();
  new Int8Array(null);
  new Int8Array(1.5);
  new Int8Array(iterable);
}, true) || fails(function () {
  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
  return new Int8Array(new ArrayBuffer(2), 1, undefined).length !== 1;
});

},{"../internals/array-buffer-view-core":17,"../internals/check-correctness-of-iteration":51,"../internals/fails":98,"../internals/global":122}],266:[function(require,module,exports){
"use strict";

var arrayFromConstructorAndList = require('../internals/array-from-constructor-and-list');
var typedArraySpeciesConstructor = require('../internals/typed-array-species-constructor');
module.exports = function (instance, list) {
  return arrayFromConstructorAndList(typedArraySpeciesConstructor(instance), list);
};

},{"../internals/array-from-constructor-and-list":23,"../internals/typed-array-species-constructor":268}],267:[function(require,module,exports){
"use strict";

var bind = require('../internals/function-bind-context');
var call = require('../internals/function-call');
var aConstructor = require('../internals/a-constructor');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var getIterator = require('../internals/get-iterator');
var getIteratorMethod = require('../internals/get-iterator-method');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var isBigIntArray = require('../internals/is-big-int-array');
var aTypedArrayConstructor = require('../internals/array-buffer-view-core').aTypedArrayConstructor;
var toBigInt = require('../internals/to-big-int');
module.exports = function from(source /* , mapfn, thisArg */) {
  var C = aConstructor(this);
  var O = toObject(source);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var i, length, result, thisIsBigIntArray, value, step, iterator, next;
  if (iteratorMethod && !isArrayIteratorMethod(iteratorMethod)) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    O = [];
    while (!(step = call(next, iterator)).done) {
      O.push(step.value);
    }
  }
  if (mapping && argumentsLength > 2) {
    mapfn = bind(mapfn, arguments[2]);
  }
  length = lengthOfArrayLike(O);
  result = new (aTypedArrayConstructor(C))(length);
  thisIsBigIntArray = isBigIntArray(result);
  for (i = 0; length > i; i++) {
    value = mapping ? mapfn(O[i], i) : O[i];
    // FF30- typed arrays doesn't properly convert objects to typed array values
    result[i] = thisIsBigIntArray ? toBigInt(value) : +value;
  }
  return result;
};

},{"../internals/a-constructor":4,"../internals/array-buffer-view-core":17,"../internals/function-bind-context":103,"../internals/function-call":106,"../internals/get-iterator":117,"../internals/get-iterator-method":116,"../internals/is-array-iterator-method":135,"../internals/is-big-int-array":137,"../internals/length-of-array-like":158,"../internals/to-big-int":250,"../internals/to-object":255}],268:[function(require,module,exports){
"use strict";

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var speciesConstructor = require('../internals/species-constructor');
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;

// a part of `TypedArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#typedarray-species-create
module.exports = function (originalArray) {
  return aTypedArrayConstructor(speciesConstructor(originalArray, getTypedArrayConstructor(originalArray)));
};

},{"../internals/array-buffer-view-core":17,"../internals/species-constructor":232}],269:[function(require,module,exports){
"use strict";

var uncurryThis = require('../internals/function-uncurry-this');
var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);
module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

},{"../internals/function-uncurry-this":110}],270:[function(require,module,exports){
"use strict";

var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');
var ITERATOR = wellKnownSymbol('iterator');
module.exports = !fails(function () {
  // eslint-disable-next-line unicorn/relative-url-style -- required for testing
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return IS_PURE && !url.toJSON || !searchParams.sort || url.href !== 'http://a/c%20d?a=1&c=3' || searchParams.get('c') !== '3' || String(new URLSearchParams('?a=1')) !== 'a=1' || !searchParams[ITERATOR]
  // throws in Edge
  || new URL('https://a@b').username !== 'a' || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
  // not punycoded in Edge
  || new URL('http://тест').host !== 'xn--e1aybc'
  // not escaped in Chrome 62-
  || new URL('http://a#б').hash !== '#%D0%B1'
  // fails in Chrome 66-
  || result !== 'a1c3'
  // throws in Safari
  || new URL('http://x', undefined).host !== 'x';
});

},{"../internals/fails":98,"../internals/is-pure":145,"../internals/well-known-symbol":277}],271:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = require('../internals/symbol-constructor-detection');
module.exports = NATIVE_SYMBOL && !Symbol.sham && _typeof(Symbol.iterator) == 'symbol';

},{"../internals/symbol-constructor-detection":244}],272:[function(require,module,exports){
"use strict";

var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () {/* empty */}, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});

},{"../internals/descriptors":72,"../internals/fails":98}],273:[function(require,module,exports){
"use strict";

var $TypeError = TypeError;
module.exports = function (passed, required) {
  if (passed < required) throw $TypeError('Not enough arguments');
  return passed;
};

},{}],274:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var isCallable = require('../internals/is-callable');
var WeakMap = global.WeakMap;
module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));

},{"../internals/global":122,"../internals/is-callable":138}],275:[function(require,module,exports){
"use strict";

var path = require('../internals/path');
var hasOwn = require('../internals/has-own-property');
var wrappedWellKnownSymbolModule = require('../internals/well-known-symbol-wrapped');
var defineProperty = require('../internals/object-define-property').f;
module.exports = function (NAME) {
  var _Symbol = path.Symbol || (path.Symbol = {});
  if (!hasOwn(_Symbol, NAME)) defineProperty(_Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};

},{"../internals/has-own-property":123,"../internals/object-define-property":179,"../internals/path":197,"../internals/well-known-symbol-wrapped":276}],276:[function(require,module,exports){
"use strict";

var wellKnownSymbol = require('../internals/well-known-symbol');
exports.f = wellKnownSymbol;

},{"../internals/well-known-symbol":277}],277:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var shared = require('../internals/shared');
var hasOwn = require('../internals/has-own-property');
var uid = require('../internals/uid');
var NATIVE_SYMBOL = require('../internals/symbol-constructor-detection');
var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');
var _Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? _Symbol['for'] || _Symbol : _Symbol && _Symbol.withoutSetter || uid;
module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(_Symbol, name) ? _Symbol[name] : createWellKnownSymbol('Symbol.' + name);
  }
  return WellKnownSymbolsStore[name];
};

},{"../internals/global":122,"../internals/has-own-property":123,"../internals/shared":231,"../internals/symbol-constructor-detection":244,"../internals/uid":269,"../internals/use-symbol-as-uid":271}],278:[function(require,module,exports){
"use strict";

// a string of all valid unicode whitespaces
module.exports = "\t\n\x0B\f\r \xA0\u1680\u2000\u2001\u2002" + "\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";

},{}],279:[function(require,module,exports){
'use strict';

var getBuiltIn = require('../internals/get-built-in');
var hasOwn = require('../internals/has-own-property');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var proxyAccessor = require('../internals/proxy-accessor');
var inheritIfRequired = require('../internals/inherit-if-required');
var normalizeStringArgument = require('../internals/normalize-string-argument');
var installErrorCause = require('../internals/install-error-cause');
var installErrorStack = require('../internals/error-stack-install');
var DESCRIPTORS = require('../internals/descriptors');
var IS_PURE = require('../internals/is-pure');
module.exports = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
  var STACK_TRACE_LIMIT = 'stackTraceLimit';
  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
  var path = FULL_NAME.split('.');
  var ERROR_NAME = path[path.length - 1];
  var OriginalError = getBuiltIn.apply(null, path);
  if (!OriginalError) return;
  var OriginalErrorPrototype = OriginalError.prototype;

  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
  if (!IS_PURE && hasOwn(OriginalErrorPrototype, 'cause')) delete OriginalErrorPrototype.cause;
  if (!FORCED) return OriginalError;
  var BaseError = getBuiltIn('Error');
  var WrappedError = wrapper(function (a, b) {
    var message = normalizeStringArgument(IS_AGGREGATE_ERROR ? b : a, undefined);
    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
    if (message !== undefined) createNonEnumerableProperty(result, 'message', message);
    installErrorStack(result, WrappedError, result.stack, 2);
    if (this && isPrototypeOf(OriginalErrorPrototype, this)) inheritIfRequired(result, this, WrappedError);
    if (arguments.length > OPTIONS_POSITION) installErrorCause(result, arguments[OPTIONS_POSITION]);
    return result;
  });
  WrappedError.prototype = OriginalErrorPrototype;
  if (ERROR_NAME !== 'Error') {
    if (setPrototypeOf) setPrototypeOf(WrappedError, BaseError);else copyConstructorProperties(WrappedError, BaseError, {
      name: true
    });
  } else if (DESCRIPTORS && STACK_TRACE_LIMIT in OriginalError) {
    proxyAccessor(WrappedError, OriginalError, STACK_TRACE_LIMIT);
    proxyAccessor(WrappedError, OriginalError, 'prepareStackTrace');
  }
  copyConstructorProperties(WrappedError, OriginalError);
  if (!IS_PURE) try {
    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
    if (OriginalErrorPrototype.name !== ERROR_NAME) {
      createNonEnumerableProperty(OriginalErrorPrototype, 'name', ERROR_NAME);
    }
    OriginalErrorPrototype.constructor = WrappedError;
  } catch (error) {/* empty */}
  return WrappedError;
};

},{"../internals/copy-constructor-properties":57,"../internals/create-non-enumerable-property":62,"../internals/descriptors":72,"../internals/error-stack-install":94,"../internals/get-built-in":113,"../internals/has-own-property":123,"../internals/inherit-if-required":130,"../internals/install-error-cause":132,"../internals/is-pure":145,"../internals/normalize-string-argument":170,"../internals/object-is-prototype-of":186,"../internals/object-set-prototype-of":191,"../internals/proxy-accessor":203}],280:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var apply = require('../internals/function-apply');
var fails = require('../internals/fails');
var wrapErrorConstructorWithCause = require('../internals/wrap-error-constructor-with-cause');
var AGGREGATE_ERROR = 'AggregateError';
var $AggregateError = getBuiltIn(AGGREGATE_ERROR);
var FORCED = !fails(function () {
  return $AggregateError([1]).errors[0] !== 1;
}) && fails(function () {
  return $AggregateError([1], AGGREGATE_ERROR, {
    cause: 7
  }).cause !== 7;
});

// https://github.com/tc39/proposal-error-cause
$({
  global: true,
  constructor: true,
  arity: 2,
  forced: FORCED
}, {
  AggregateError: wrapErrorConstructorWithCause(AGGREGATE_ERROR, function (init) {
    // eslint-disable-next-line no-unused-vars -- required for functions `.length`
    return function AggregateError(errors, message) {
      return apply(init, this, arguments);
    };
  }, FORCED, true)
});

},{"../internals/export":97,"../internals/fails":98,"../internals/function-apply":102,"../internals/get-built-in":113,"../internals/wrap-error-constructor-with-cause":279}],281:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var create = require('../internals/object-create');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var installErrorCause = require('../internals/install-error-cause');
var installErrorStack = require('../internals/error-stack-install');
var iterate = require('../internals/iterate');
var normalizeStringArgument = require('../internals/normalize-string-argument');
var wellKnownSymbol = require('../internals/well-known-symbol');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Error = Error;
var push = [].push;
var $AggregateError = function AggregateError(errors, message /* , options */) {
  var isInstance = isPrototypeOf(AggregateErrorPrototype, this);
  var that;
  if (setPrototypeOf) {
    that = setPrototypeOf($Error(), isInstance ? getPrototypeOf(this) : AggregateErrorPrototype);
  } else {
    that = isInstance ? this : create(AggregateErrorPrototype);
    createNonEnumerableProperty(that, TO_STRING_TAG, 'Error');
  }
  if (message !== undefined) createNonEnumerableProperty(that, 'message', normalizeStringArgument(message));
  installErrorStack(that, $AggregateError, that.stack, 1);
  if (arguments.length > 2) installErrorCause(that, arguments[2]);
  var errorsArray = [];
  iterate(errors, push, {
    that: errorsArray
  });
  createNonEnumerableProperty(that, 'errors', errorsArray);
  return that;
};
if (setPrototypeOf) setPrototypeOf($AggregateError, $Error);else copyConstructorProperties($AggregateError, $Error, {
  name: true
});
var AggregateErrorPrototype = $AggregateError.prototype = create($Error.prototype, {
  constructor: createPropertyDescriptor(1, $AggregateError),
  message: createPropertyDescriptor(1, ''),
  name: createPropertyDescriptor(1, 'AggregateError')
});

// `AggregateError` constructor
// https://tc39.es/ecma262/#sec-aggregate-error-constructor
$({
  global: true,
  constructor: true,
  arity: 2
}, {
  AggregateError: $AggregateError
});

},{"../internals/copy-constructor-properties":57,"../internals/create-non-enumerable-property":62,"../internals/create-property-descriptor":63,"../internals/error-stack-install":94,"../internals/export":97,"../internals/install-error-cause":132,"../internals/iterate":150,"../internals/normalize-string-argument":170,"../internals/object-create":177,"../internals/object-get-prototype-of":184,"../internals/object-is-prototype-of":186,"../internals/object-set-prototype-of":191,"../internals/well-known-symbol":277}],282:[function(require,module,exports){
"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
require('../modules/es.aggregate-error.constructor');

},{"../modules/es.aggregate-error.constructor":281}],283:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var global = require('../internals/global');
var arrayBufferModule = require('../internals/array-buffer');
var setSpecies = require('../internals/set-species');
var ARRAY_BUFFER = 'ArrayBuffer';
var ArrayBuffer = arrayBufferModule[ARRAY_BUFFER];
var NativeArrayBuffer = global[ARRAY_BUFFER];

// `ArrayBuffer` constructor
// https://tc39.es/ecma262/#sec-arraybuffer-constructor
$({
  global: true,
  constructor: true,
  forced: NativeArrayBuffer !== ArrayBuffer
}, {
  ArrayBuffer: ArrayBuffer
});
setSpecies(ARRAY_BUFFER);

},{"../internals/array-buffer":18,"../internals/export":97,"../internals/global":122,"../internals/set-species":225}],284:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

// `ArrayBuffer.isView` method
// https://tc39.es/ecma262/#sec-arraybuffer.isview
$({
  target: 'ArrayBuffer',
  stat: true,
  forced: !NATIVE_ARRAY_BUFFER_VIEWS
}, {
  isView: ArrayBufferViewCore.isView
});

},{"../internals/array-buffer-view-core":17,"../internals/export":97}],285:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this-clause');
var fails = require('../internals/fails');
var ArrayBufferModule = require('../internals/array-buffer');
var anObject = require('../internals/an-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toLength = require('../internals/to-length');
var speciesConstructor = require('../internals/species-constructor');
var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
var DataView = ArrayBufferModule.DataView;
var DataViewPrototype = DataView.prototype;
var nativeArrayBufferSlice = uncurryThis(ArrayBuffer.prototype.slice);
var getUint8 = uncurryThis(DataViewPrototype.getUint8);
var setUint8 = uncurryThis(DataViewPrototype.setUint8);
var INCORRECT_SLICE = fails(function () {
  return !new ArrayBuffer(2).slice(1, undefined).byteLength;
});

// `ArrayBuffer.prototype.slice` method
// https://tc39.es/ecma262/#sec-arraybuffer.prototype.slice
$({
  target: 'ArrayBuffer',
  proto: true,
  unsafe: true,
  forced: INCORRECT_SLICE
}, {
  slice: function slice(start, end) {
    if (nativeArrayBufferSlice && end === undefined) {
      return nativeArrayBufferSlice(anObject(this), start); // FF fix
    }

    var length = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    var result = new (speciesConstructor(this, ArrayBuffer))(toLength(fin - first));
    var viewSource = new DataView(this);
    var viewTarget = new DataView(result);
    var index = 0;
    while (first < fin) {
      setUint8(viewTarget, index++, getUint8(viewSource, first++));
    }
    return result;
  }
});

},{"../internals/an-object":11,"../internals/array-buffer":18,"../internals/export":97,"../internals/fails":98,"../internals/function-uncurry-this-clause":109,"../internals/species-constructor":232,"../internals/to-absolute-index":249,"../internals/to-length":254}],286:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.at` method
// https://github.com/tc39/proposal-relative-indexing-method
$({
  target: 'Array',
  proto: true
}, {
  at: function at(index) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var relativeIndex = toIntegerOrInfinity(index);
    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
    return k < 0 || k >= len ? undefined : O[k];
  }
});
addToUnscopables('at');

},{"../internals/add-to-unscopables":8,"../internals/export":97,"../internals/length-of-array-like":158,"../internals/to-integer-or-infinity":253,"../internals/to-object":255}],287:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var fails = require('../internals/fails');
var isArray = require('../internals/is-array');
var isObject = require('../internals/is-object');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var doesNotExceedSafeInteger = require('../internals/does-not-exceed-safe-integer');
var createProperty = require('../internals/create-property');
var arraySpeciesCreate = require('../internals/array-species-create');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');
var wellKnownSymbol = require('../internals/well-known-symbol');
var V8_VERSION = require('../internals/engine-v8-version');
var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});
var isConcatSpreadable = function isConcatSpreadable(O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};
var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !arrayMethodHasSpeciesSupport('concat');

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({
  target: 'Array',
  proto: true,
  arity: 1,
  forced: FORCED
}, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = lengthOfArrayLike(E);
        doesNotExceedSafeInteger(n + len);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        doesNotExceedSafeInteger(n + 1);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

},{"../internals/array-method-has-species-support":31,"../internals/array-species-create":39,"../internals/create-property":64,"../internals/does-not-exceed-safe-integer":75,"../internals/engine-v8-version":89,"../internals/export":97,"../internals/fails":98,"../internals/is-array":136,"../internals/is-object":144,"../internals/length-of-array-like":158,"../internals/to-object":255,"../internals/well-known-symbol":277}],288:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var copyWithin = require('../internals/array-copy-within');
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.copyWithin` method
// https://tc39.es/ecma262/#sec-array.prototype.copywithin
$({
  target: 'Array',
  proto: true
}, {
  copyWithin: copyWithin
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('copyWithin');

},{"../internals/add-to-unscopables":8,"../internals/array-copy-within":19,"../internals/export":97}],289:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $every = require('../internals/array-iteration').every;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var STRICT_METHOD = arrayMethodIsStrict('every');

// `Array.prototype.every` method
// https://tc39.es/ecma262/#sec-array.prototype.every
$({
  target: 'Array',
  proto: true,
  forced: !STRICT_METHOD
}, {
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-iteration":29,"../internals/array-method-is-strict":32,"../internals/export":97}],290:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var fill = require('../internals/array-fill');
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.fill` method
// https://tc39.es/ecma262/#sec-array.prototype.fill
$({
  target: 'Array',
  proto: true
}, {
  fill: fill
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('fill');

},{"../internals/add-to-unscopables":8,"../internals/array-fill":20,"../internals/export":97}],291:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $filter = require('../internals/array-iteration').filter;
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');
var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({
  target: 'Array',
  proto: true,
  forced: !HAS_SPECIES_SUPPORT
}, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-iteration":29,"../internals/array-method-has-species-support":31,"../internals/export":97}],292:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $findIndex = require('../internals/array-iteration').findIndex;
var addToUnscopables = require('../internals/add-to-unscopables');
var FIND_INDEX = 'findIndex';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () {
  SKIPS_HOLES = false;
});

// `Array.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-array.prototype.findindex
$({
  target: 'Array',
  proto: true,
  forced: SKIPS_HOLES
}, {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND_INDEX);

},{"../internals/add-to-unscopables":8,"../internals/array-iteration":29,"../internals/export":97}],293:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $findLastIndex = require('../internals/array-iteration-from-last').findLastIndex;
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.findLastIndex` method
// https://github.com/tc39/proposal-array-find-from-last
$({
  target: 'Array',
  proto: true
}, {
  findLastIndex: function findLastIndex(callbackfn /* , that = undefined */) {
    return $findLastIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
addToUnscopables('findLastIndex');

},{"../internals/add-to-unscopables":8,"../internals/array-iteration-from-last":28,"../internals/export":97}],294:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $findLast = require('../internals/array-iteration-from-last').findLast;
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.findLast` method
// https://github.com/tc39/proposal-array-find-from-last
$({
  target: 'Array',
  proto: true
}, {
  findLast: function findLast(callbackfn /* , that = undefined */) {
    return $findLast(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
addToUnscopables('findLast');

},{"../internals/add-to-unscopables":8,"../internals/array-iteration-from-last":28,"../internals/export":97}],295:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $find = require('../internals/array-iteration').find;
var addToUnscopables = require('../internals/add-to-unscopables');
var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () {
  SKIPS_HOLES = false;
});

// `Array.prototype.find` method
// https://tc39.es/ecma262/#sec-array.prototype.find
$({
  target: 'Array',
  proto: true,
  forced: SKIPS_HOLES
}, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);

},{"../internals/add-to-unscopables":8,"../internals/array-iteration":29,"../internals/export":97}],296:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var flattenIntoArray = require('../internals/flatten-into-array');
var aCallable = require('../internals/a-callable');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var arraySpeciesCreate = require('../internals/array-species-create');

// `Array.prototype.flatMap` method
// https://tc39.es/ecma262/#sec-array.prototype.flatmap
$({
  target: 'Array',
  proto: true
}, {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen = lengthOfArrayLike(O);
    var A;
    aCallable(callbackfn);
    A = arraySpeciesCreate(O, 0);
    A.length = flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return A;
  }
});

},{"../internals/a-callable":3,"../internals/array-species-create":39,"../internals/export":97,"../internals/flatten-into-array":100,"../internals/length-of-array-like":158,"../internals/to-object":255}],297:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var flattenIntoArray = require('../internals/flatten-into-array');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var arraySpeciesCreate = require('../internals/array-species-create');

// `Array.prototype.flat` method
// https://tc39.es/ecma262/#sec-array.prototype.flat
$({
  target: 'Array',
  proto: true
}, {
  flat: function flat( /* depthArg = 1 */
  ) {
    var depthArg = arguments.length ? arguments[0] : undefined;
    var O = toObject(this);
    var sourceLen = lengthOfArrayLike(O);
    var A = arraySpeciesCreate(O, 0);
    A.length = flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toIntegerOrInfinity(depthArg));
    return A;
  }
});

},{"../internals/array-species-create":39,"../internals/export":97,"../internals/flatten-into-array":100,"../internals/length-of-array-like":158,"../internals/to-integer-or-infinity":253,"../internals/to-object":255}],298:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var forEach = require('../internals/array-for-each');

// `Array.prototype.forEach` method
// https://tc39.es/ecma262/#sec-array.prototype.foreach
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
$({
  target: 'Array',
  proto: true,
  forced: [].forEach != forEach
}, {
  forEach: forEach
});

},{"../internals/array-for-each":21,"../internals/export":97}],299:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var from = require('../internals/array-from');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
$({
  target: 'Array',
  stat: true,
  forced: INCORRECT_ITERATION
}, {
  from: from
});

},{"../internals/array-from":24,"../internals/check-correctness-of-iteration":51,"../internals/export":97}],300:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $includes = require('../internals/array-includes').includes;
var fails = require('../internals/fails');
var addToUnscopables = require('../internals/add-to-unscopables');

// FF99+ bug
var BROKEN_ON_SPARSE = fails(function () {
  // eslint-disable-next-line es/no-array-prototype-includes -- detection
  return !Array(1).includes();
});

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({
  target: 'Array',
  proto: true,
  forced: BROKEN_ON_SPARSE
}, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');

},{"../internals/add-to-unscopables":8,"../internals/array-includes":27,"../internals/export":97,"../internals/fails":98}],301:[function(require,module,exports){
'use strict';

/* eslint-disable es/no-array-prototype-indexof -- required for testing */
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this-clause');
var $indexOf = require('../internals/array-includes').indexOf;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var nativeIndexOf = uncurryThis([].indexOf);
var NEGATIVE_ZERO = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
var FORCED = NEGATIVE_ZERO || !arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$({
  target: 'Array',
  proto: true,
  forced: FORCED
}, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
    return NEGATIVE_ZERO
    // convert -0 to +0
    ? nativeIndexOf(this, searchElement, fromIndex) || 0 : $indexOf(this, searchElement, fromIndex);
  }
});

},{"../internals/array-includes":27,"../internals/array-method-is-strict":32,"../internals/export":97,"../internals/function-uncurry-this-clause":109}],302:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var isArray = require('../internals/is-array');

// `Array.isArray` method
// https://tc39.es/ecma262/#sec-array.isarray
$({
  target: 'Array',
  stat: true
}, {
  isArray: isArray
});

},{"../internals/export":97,"../internals/is-array":136}],303:[function(require,module,exports){
'use strict';

var toIndexedObject = require('../internals/to-indexed-object');
var addToUnscopables = require('../internals/add-to-unscopables');
var Iterators = require('../internals/iterators');
var InternalStateModule = require('../internals/internal-state');
var defineProperty = require('../internals/object-define-property').f;
var defineIterator = require('../internals/iterator-define');
var createIterResultObject = require('../internals/create-iter-result-object');
var IS_PURE = require('../internals/is-pure');
var DESCRIPTORS = require('../internals/descriptors');
var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated),
    // target
    index: 0,
    // next index
    kind: kind // kind
  });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return createIterResultObject(undefined, true);
  }
  if (kind == 'keys') return createIterResultObject(index, false);
  if (kind == 'values') return createIterResultObject(target[index], false);
  return createIterResultObject([index, target[index]], false);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', {
    value: 'values'
  });
} catch (error) {/* empty */}

},{"../internals/add-to-unscopables":8,"../internals/create-iter-result-object":61,"../internals/descriptors":72,"../internals/internal-state":134,"../internals/is-pure":145,"../internals/iterator-define":154,"../internals/iterators":157,"../internals/object-define-property":179,"../internals/to-indexed-object":252}],304:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var IndexedObject = require('../internals/indexed-object');
var toIndexedObject = require('../internals/to-indexed-object');
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var nativeJoin = uncurryThis([].join);
var ES3_STRINGS = IndexedObject != Object;
var FORCED = ES3_STRINGS || !arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.es/ecma262/#sec-array.prototype.join
$({
  target: 'Array',
  proto: true,
  forced: FORCED
}, {
  join: function join(separator) {
    return nativeJoin(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});

},{"../internals/array-method-is-strict":32,"../internals/export":97,"../internals/function-uncurry-this":110,"../internals/indexed-object":129,"../internals/to-indexed-object":252}],305:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var lastIndexOf = require('../internals/array-last-index-of');

// `Array.prototype.lastIndexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
// eslint-disable-next-line es/no-array-prototype-lastindexof -- required for testing
$({
  target: 'Array',
  proto: true,
  forced: lastIndexOf !== [].lastIndexOf
}, {
  lastIndexOf: lastIndexOf
});

},{"../internals/array-last-index-of":30,"../internals/export":97}],306:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $map = require('../internals/array-iteration').map;
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');
var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({
  target: 'Array',
  proto: true,
  forced: !HAS_SPECIES_SUPPORT
}, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-iteration":29,"../internals/array-method-has-species-support":31,"../internals/export":97}],307:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var fails = require('../internals/fails');
var isConstructor = require('../internals/is-constructor');
var createProperty = require('../internals/create-property');
var $Array = Array;
var ISNT_GENERIC = fails(function () {
  function F() {/* empty */}
  // eslint-disable-next-line es/no-array-of -- safe
  return !($Array.of.call(F) instanceof F);
});

// `Array.of` method
// https://tc39.es/ecma262/#sec-array.of
// WebKit Array.of isn't generic
$({
  target: 'Array',
  stat: true,
  forced: ISNT_GENERIC
}, {
  of: function of( /* ...args */
  ) {
    var index = 0;
    var argumentsLength = arguments.length;
    var result = new (isConstructor(this) ? this : $Array)(argumentsLength);
    while (argumentsLength > index) createProperty(result, index, arguments[index++]);
    result.length = argumentsLength;
    return result;
  }
});

},{"../internals/create-property":64,"../internals/export":97,"../internals/fails":98,"../internals/is-constructor":139}],308:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var setArrayLength = require('../internals/array-set-length');
var doesNotExceedSafeInteger = require('../internals/does-not-exceed-safe-integer');
var fails = require('../internals/fails');
var INCORRECT_TO_LENGTH = fails(function () {
  return [].push.call({
    length: 0x100000000
  }, 1) !== 4294967297;
});

// V8 and Safari <= 15.4, FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var properErrorOnNonWritableLength = function properErrorOnNonWritableLength() {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', {
      writable: false
    }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
};
var FORCED = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$({
  target: 'Array',
  proto: true,
  arity: 1,
  forced: FORCED
}, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  }
});

},{"../internals/array-set-length":34,"../internals/does-not-exceed-safe-integer":75,"../internals/export":97,"../internals/fails":98,"../internals/length-of-array-like":158,"../internals/to-object":255}],309:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $reduceRight = require('../internals/array-reduce').right;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var CHROME_VERSION = require('../internals/engine-v8-version');
var IS_NODE = require('../internals/engine-is-node');

// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;
var FORCED = CHROME_BUG || !arrayMethodIsStrict('reduceRight');

// `Array.prototype.reduceRight` method
// https://tc39.es/ecma262/#sec-array.prototype.reduceright
$({
  target: 'Array',
  proto: true,
  forced: FORCED
}, {
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduceRight(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-method-is-strict":32,"../internals/array-reduce":33,"../internals/engine-is-node":86,"../internals/engine-v8-version":89,"../internals/export":97}],310:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $reduce = require('../internals/array-reduce').left;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var CHROME_VERSION = require('../internals/engine-v8-version');
var IS_NODE = require('../internals/engine-is-node');

// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;
var FORCED = CHROME_BUG || !arrayMethodIsStrict('reduce');

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$({
  target: 'Array',
  proto: true,
  forced: FORCED
}, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-method-is-strict":32,"../internals/array-reduce":33,"../internals/engine-is-node":86,"../internals/engine-v8-version":89,"../internals/export":97}],311:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var isArray = require('../internals/is-array');
var nativeReverse = uncurryThis([].reverse);
var test = [1, 2];

// `Array.prototype.reverse` method
// https://tc39.es/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
$({
  target: 'Array',
  proto: true,
  forced: String(test) === String(test.reverse())
}, {
  reverse: function reverse() {
    // eslint-disable-next-line no-self-assign -- dirty hack
    if (isArray(this)) this.length = this.length;
    return nativeReverse(this);
  }
});

},{"../internals/export":97,"../internals/function-uncurry-this":110,"../internals/is-array":136}],312:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var isArray = require('../internals/is-array');
var isConstructor = require('../internals/is-constructor');
var isObject = require('../internals/is-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toIndexedObject = require('../internals/to-indexed-object');
var createProperty = require('../internals/create-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');
var nativeSlice = require('../internals/array-slice');
var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
var SPECIES = wellKnownSymbol('species');
var $Array = Array;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({
  target: 'Array',
  proto: true,
  forced: !HAS_SPECIES_SUPPORT
}, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = lengthOfArrayLike(O);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (isConstructor(Constructor) && (Constructor === $Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === $Array || Constructor === undefined) {
        return nativeSlice(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? $Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

},{"../internals/array-method-has-species-support":31,"../internals/array-slice":36,"../internals/create-property":64,"../internals/export":97,"../internals/is-array":136,"../internals/is-constructor":139,"../internals/is-object":144,"../internals/length-of-array-like":158,"../internals/to-absolute-index":249,"../internals/to-indexed-object":252,"../internals/well-known-symbol":277}],313:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $some = require('../internals/array-iteration').some;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var STRICT_METHOD = arrayMethodIsStrict('some');

// `Array.prototype.some` method
// https://tc39.es/ecma262/#sec-array.prototype.some
$({
  target: 'Array',
  proto: true,
  forced: !STRICT_METHOD
}, {
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-iteration":29,"../internals/array-method-is-strict":32,"../internals/export":97}],314:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var aCallable = require('../internals/a-callable');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var deletePropertyOrThrow = require('../internals/delete-property-or-throw');
var toString = require('../internals/to-string');
var fails = require('../internals/fails');
var internalSort = require('../internals/array-sort');
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var FF = require('../internals/engine-ff-version');
var IE_OR_EDGE = require('../internals/engine-is-ie-or-edge');
var V8 = require('../internals/engine-v8-version');
var WEBKIT = require('../internals/engine-webkit-version');
var test = [];
var nativeSort = uncurryThis(test.sort);
var push = uncurryThis(test.push);

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test.sort(null);
});
// Old WebKit
var STRICT_METHOD = arrayMethodIsStrict('sort');
var STABLE_SORT = !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (V8) return V8 < 70;
  if (FF && FF > 3) return;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 603;
  var result = '';
  var code, chr, value, index;

  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
  for (code = 65; code < 76; code++) {
    chr = String.fromCharCode(code);
    switch (code) {
      case 66:
      case 69:
      case 70:
      case 72:
        value = 3;
        break;
      case 68:
      case 71:
        value = 4;
        break;
      default:
        value = 2;
    }
    for (index = 0; index < 47; index++) {
      test.push({
        k: chr + index,
        v: value
      });
    }
  }
  test.sort(function (a, b) {
    return b.v - a.v;
  });
  for (index = 0; index < test.length; index++) {
    chr = test[index].k.charAt(0);
    if (result.charAt(result.length - 1) !== chr) result += chr;
  }
  return result !== 'DGBEFHACIJK';
});
var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT;
var getSortCompare = function getSortCompare(comparefn) {
  return function (x, y) {
    if (y === undefined) return -1;
    if (x === undefined) return 1;
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    return toString(x) > toString(y) ? 1 : -1;
  };
};

// `Array.prototype.sort` method
// https://tc39.es/ecma262/#sec-array.prototype.sort
$({
  target: 'Array',
  proto: true,
  forced: FORCED
}, {
  sort: function sort(comparefn) {
    if (comparefn !== undefined) aCallable(comparefn);
    var array = toObject(this);
    if (STABLE_SORT) return comparefn === undefined ? nativeSort(array) : nativeSort(array, comparefn);
    var items = [];
    var arrayLength = lengthOfArrayLike(array);
    var itemsLength, index;
    for (index = 0; index < arrayLength; index++) {
      if (index in array) push(items, array[index]);
    }
    internalSort(items, getSortCompare(comparefn));
    itemsLength = lengthOfArrayLike(items);
    index = 0;
    while (index < itemsLength) array[index] = items[index++];
    while (index < arrayLength) deletePropertyOrThrow(array, index++);
    return array;
  }
});

},{"../internals/a-callable":3,"../internals/array-method-is-strict":32,"../internals/array-sort":37,"../internals/delete-property-or-throw":71,"../internals/engine-ff-version":79,"../internals/engine-is-ie-or-edge":83,"../internals/engine-v8-version":89,"../internals/engine-webkit-version":90,"../internals/export":97,"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/length-of-array-like":158,"../internals/to-object":255,"../internals/to-string":261}],315:[function(require,module,exports){
"use strict";

var setSpecies = require('../internals/set-species');

// `Array[@@species]` getter
// https://tc39.es/ecma262/#sec-get-array-@@species
setSpecies('Array');

},{"../internals/set-species":225}],316:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var toObject = require('../internals/to-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var setArrayLength = require('../internals/array-set-length');
var doesNotExceedSafeInteger = require('../internals/does-not-exceed-safe-integer');
var arraySpeciesCreate = require('../internals/array-species-create');
var createProperty = require('../internals/create-property');
var deletePropertyOrThrow = require('../internals/delete-property-or-throw');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');
var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
var max = Math.max;
var min = Math.min;

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({
  target: 'Array',
  proto: true,
  forced: !HAS_SPECIES_SUPPORT
}, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
    }
    doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];else deletePropertyOrThrow(O, to);
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) deletePropertyOrThrow(O, k - 1);
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];else deletePropertyOrThrow(O, to);
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    setArrayLength(O, len - actualDeleteCount + insertCount);
    return A;
  }
});

},{"../internals/array-method-has-species-support":31,"../internals/array-set-length":34,"../internals/array-species-create":39,"../internals/create-property":64,"../internals/delete-property-or-throw":71,"../internals/does-not-exceed-safe-integer":75,"../internals/export":97,"../internals/length-of-array-like":158,"../internals/to-absolute-index":249,"../internals/to-integer-or-infinity":253,"../internals/to-object":255}],317:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var arrayToReversed = require('../internals/array-to-reversed');
var toIndexedObject = require('../internals/to-indexed-object');
var addToUnscopables = require('../internals/add-to-unscopables');
var $Array = Array;

// `Array.prototype.toReversed` method
// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
$({
  target: 'Array',
  proto: true
}, {
  toReversed: function toReversed() {
    return arrayToReversed(toIndexedObject(this), $Array);
  }
});
addToUnscopables('toReversed');

},{"../internals/add-to-unscopables":8,"../internals/array-to-reversed":40,"../internals/export":97,"../internals/to-indexed-object":252}],318:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var aCallable = require('../internals/a-callable');
var toIndexedObject = require('../internals/to-indexed-object');
var arrayFromConstructorAndList = require('../internals/array-from-constructor-and-list');
var getVirtual = require('../internals/entry-virtual');
var addToUnscopables = require('../internals/add-to-unscopables');
var $Array = Array;
var sort = uncurryThis(getVirtual('Array').sort);

// `Array.prototype.toSorted` method
// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toSorted
$({
  target: 'Array',
  proto: true
}, {
  toSorted: function toSorted(compareFn) {
    if (compareFn !== undefined) aCallable(compareFn);
    var O = toIndexedObject(this);
    var A = arrayFromConstructorAndList($Array, O);
    return sort(A, compareFn);
  }
});
addToUnscopables('toSorted');

},{"../internals/a-callable":3,"../internals/add-to-unscopables":8,"../internals/array-from-constructor-and-list":23,"../internals/entry-virtual":91,"../internals/export":97,"../internals/function-uncurry-this":110,"../internals/to-indexed-object":252}],319:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var addToUnscopables = require('../internals/add-to-unscopables');
var doesNotExceedSafeInteger = require('../internals/does-not-exceed-safe-integer');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toIndexedObject = require('../internals/to-indexed-object');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var $Array = Array;
var max = Math.max;
var min = Math.min;

// `Array.prototype.toSpliced` method
// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toSpliced
$({
  target: 'Array',
  proto: true
}, {
  toSpliced: function toSpliced(start, deleteCount /* , ...items */) {
    var O = toIndexedObject(this);
    var len = lengthOfArrayLike(O);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var k = 0;
    var insertCount, actualDeleteCount, newLen, A;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
    }
    newLen = doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
    A = $Array(newLen);
    for (; k < actualStart; k++) A[k] = O[k];
    for (; k < actualStart + insertCount; k++) A[k] = arguments[k - actualStart + 2];
    for (; k < newLen; k++) A[k] = O[k + actualDeleteCount - insertCount];
    return A;
  }
});
addToUnscopables('toSpliced');

},{"../internals/add-to-unscopables":8,"../internals/does-not-exceed-safe-integer":75,"../internals/export":97,"../internals/length-of-array-like":158,"../internals/to-absolute-index":249,"../internals/to-indexed-object":252,"../internals/to-integer-or-infinity":253}],320:[function(require,module,exports){
"use strict";

// this method was added to unscopables after implementation
// in popular engines, so it's moved to a separate module
var addToUnscopables = require('../internals/add-to-unscopables');

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('flatMap');

},{"../internals/add-to-unscopables":8}],321:[function(require,module,exports){
"use strict";

// this method was added to unscopables after implementation
// in popular engines, so it's moved to a separate module
var addToUnscopables = require('../internals/add-to-unscopables');

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('flat');

},{"../internals/add-to-unscopables":8}],322:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var setArrayLength = require('../internals/array-set-length');
var deletePropertyOrThrow = require('../internals/delete-property-or-throw');
var doesNotExceedSafeInteger = require('../internals/does-not-exceed-safe-integer');

// IE8-
var INCORRECT_RESULT = [].unshift(0) !== 1;

// V8 ~ Chrome < 71 and Safari <= 15.4, FF < 23 throws InternalError
var properErrorOnNonWritableLength = function properErrorOnNonWritableLength() {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', {
      writable: false
    }).unshift();
  } catch (error) {
    return error instanceof TypeError;
  }
};
var FORCED = INCORRECT_RESULT || !properErrorOnNonWritableLength();

// `Array.prototype.unshift` method
// https://tc39.es/ecma262/#sec-array.prototype.unshift
$({
  target: 'Array',
  proto: true,
  arity: 1,
  forced: FORCED
}, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  unshift: function unshift(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    if (argCount) {
      doesNotExceedSafeInteger(len + argCount);
      var k = len;
      while (k--) {
        var to = k + argCount;
        if (k in O) O[to] = O[k];else deletePropertyOrThrow(O, to);
      }
      for (var j = 0; j < argCount; j++) {
        O[j] = arguments[j];
      }
    }
    return setArrayLength(O, len + argCount);
  }
});

},{"../internals/array-set-length":34,"../internals/delete-property-or-throw":71,"../internals/does-not-exceed-safe-integer":75,"../internals/export":97,"../internals/length-of-array-like":158,"../internals/to-object":255}],323:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var arrayWith = require('../internals/array-with');
var toIndexedObject = require('../internals/to-indexed-object');
var $Array = Array;

// `Array.prototype.with` method
// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
$({
  target: 'Array',
  proto: true
}, {
  'with': function _with(index, value) {
    return arrayWith(toIndexedObject(this), $Array, index, value);
  }
});

},{"../internals/array-with":41,"../internals/export":97,"../internals/to-indexed-object":252}],324:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var ArrayBufferModule = require('../internals/array-buffer');
var NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-basic-detection');

// `DataView` constructor
// https://tc39.es/ecma262/#sec-dataview-constructor
$({
  global: true,
  constructor: true,
  forced: !NATIVE_ARRAY_BUFFER
}, {
  DataView: ArrayBufferModule.DataView
});

},{"../internals/array-buffer":18,"../internals/array-buffer-basic-detection":12,"../internals/export":97}],325:[function(require,module,exports){
"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
require('../modules/es.data-view.constructor');

},{"../modules/es.data-view.constructor":324}],326:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');

// IE8- non-standard case
var FORCED = fails(function () {
  // eslint-disable-next-line es/no-date-prototype-getyear-setyear -- detection
  return new Date(16e11).getYear() !== 120;
});
var getFullYear = uncurryThis(Date.prototype.getFullYear);

// `Date.prototype.getYear` method
// https://tc39.es/ecma262/#sec-date.prototype.getyear
$({
  target: 'Date',
  proto: true,
  forced: FORCED
}, {
  getYear: function getYear() {
    return getFullYear(this) - 1900;
  }
});

},{"../internals/export":97,"../internals/fails":98,"../internals/function-uncurry-this":110}],327:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var $Date = Date;
var thisTimeValue = uncurryThis($Date.prototype.getTime);

// `Date.now` method
// https://tc39.es/ecma262/#sec-date.now
$({
  target: 'Date',
  stat: true
}, {
  now: function now() {
    return thisTimeValue(new $Date());
  }
});

},{"../internals/export":97,"../internals/function-uncurry-this":110}],328:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var DatePrototype = Date.prototype;
var thisTimeValue = uncurryThis(DatePrototype.getTime);
var setFullYear = uncurryThis(DatePrototype.setFullYear);

// `Date.prototype.setYear` method
// https://tc39.es/ecma262/#sec-date.prototype.setyear
$({
  target: 'Date',
  proto: true
}, {
  setYear: function setYear(year) {
    // validate
    thisTimeValue(this);
    var yi = toIntegerOrInfinity(year);
    var yyyy = 0 <= yi && yi <= 99 ? yi + 1900 : yi;
    return setFullYear(this, yyyy);
  }
});

},{"../internals/export":97,"../internals/function-uncurry-this":110,"../internals/to-integer-or-infinity":253}],329:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');

// `Date.prototype.toGMTString` method
// https://tc39.es/ecma262/#sec-date.prototype.togmtstring
$({
  target: 'Date',
  proto: true
}, {
  toGMTString: Date.prototype.toUTCString
});

},{"../internals/export":97}],330:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var toISOString = require('../internals/date-to-iso-string');

// `Date.prototype.toISOString` method
// https://tc39.es/ecma262/#sec-date.prototype.toisostring
// PhantomJS / old WebKit has a broken implementations
$({
  target: 'Date',
  proto: true,
  forced: Date.prototype.toISOString !== toISOString
}, {
  toISOString: toISOString
});

},{"../internals/date-to-iso-string":65,"../internals/export":97}],331:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var fails = require('../internals/fails');
var toObject = require('../internals/to-object');
var toPrimitive = require('../internals/to-primitive');
var FORCED = fails(function () {
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({
    toISOString: function toISOString() {
      return 1;
    }
  }) !== 1;
});

// `Date.prototype.toJSON` method
// https://tc39.es/ecma262/#sec-date.prototype.tojson
$({
  target: 'Date',
  proto: true,
  arity: 1,
  forced: FORCED
}, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O, 'number');
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

},{"../internals/export":97,"../internals/fails":98,"../internals/to-object":255,"../internals/to-primitive":258}],332:[function(require,module,exports){
"use strict";

var hasOwn = require('../internals/has-own-property');
var defineBuiltIn = require('../internals/define-built-in');
var dateToPrimitive = require('../internals/date-to-primitive');
var wellKnownSymbol = require('../internals/well-known-symbol');
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var DatePrototype = Date.prototype;

// `Date.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
if (!hasOwn(DatePrototype, TO_PRIMITIVE)) {
  defineBuiltIn(DatePrototype, TO_PRIMITIVE, dateToPrimitive);
}

},{"../internals/date-to-primitive":66,"../internals/define-built-in":68,"../internals/has-own-property":123,"../internals/well-known-symbol":277}],333:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
var uncurryThis = require('../internals/function-uncurry-this');
var defineBuiltIn = require('../internals/define-built-in');
var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var nativeDateToString = uncurryThis(DatePrototype[TO_STRING]);
var thisTimeValue = uncurryThis(DatePrototype.getTime);

// `Date.prototype.toString` method
// https://tc39.es/ecma262/#sec-date.prototype.tostring
if (String(new Date(NaN)) != INVALID_DATE) {
  defineBuiltIn(DatePrototype, TO_STRING, function toString() {
    var value = thisTimeValue(this);
    // eslint-disable-next-line no-self-compare -- NaN check
    return value === value ? nativeDateToString(this) : INVALID_DATE;
  });
}

},{"../internals/define-built-in":68,"../internals/function-uncurry-this":110}],334:[function(require,module,exports){
"use strict";

/* eslint-disable no-unused-vars -- required for functions `.length` */
var $ = require('../internals/export');
var global = require('../internals/global');
var apply = require('../internals/function-apply');
var wrapErrorConstructorWithCause = require('../internals/wrap-error-constructor-with-cause');
var WEB_ASSEMBLY = 'WebAssembly';
var WebAssembly = global[WEB_ASSEMBLY];
var FORCED = Error('e', {
  cause: 7
}).cause !== 7;
var exportGlobalErrorCauseWrapper = function exportGlobalErrorCauseWrapper(ERROR_NAME, wrapper) {
  var O = {};
  O[ERROR_NAME] = wrapErrorConstructorWithCause(ERROR_NAME, wrapper, FORCED);
  $({
    global: true,
    constructor: true,
    arity: 1,
    forced: FORCED
  }, O);
};
var exportWebAssemblyErrorCauseWrapper = function exportWebAssemblyErrorCauseWrapper(ERROR_NAME, wrapper) {
  if (WebAssembly && WebAssembly[ERROR_NAME]) {
    var O = {};
    O[ERROR_NAME] = wrapErrorConstructorWithCause(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED);
    $({
      target: WEB_ASSEMBLY,
      stat: true,
      constructor: true,
      arity: 1,
      forced: FORCED
    }, O);
  }
};

// https://tc39.es/ecma262/#sec-nativeerror
// https://github.com/tc39/proposal-error-cause
exportGlobalErrorCauseWrapper('Error', function (init) {
  return function Error(message) {
    return apply(init, this, arguments);
  };
});
exportGlobalErrorCauseWrapper('EvalError', function (init) {
  return function EvalError(message) {
    return apply(init, this, arguments);
  };
});
exportGlobalErrorCauseWrapper('RangeError', function (init) {
  return function RangeError(message) {
    return apply(init, this, arguments);
  };
});
exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
  return function ReferenceError(message) {
    return apply(init, this, arguments);
  };
});
exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
  return function SyntaxError(message) {
    return apply(init, this, arguments);
  };
});
exportGlobalErrorCauseWrapper('TypeError', function (init) {
  return function TypeError(message) {
    return apply(init, this, arguments);
  };
});
exportGlobalErrorCauseWrapper('URIError', function (init) {
  return function URIError(message) {
    return apply(init, this, arguments);
  };
});
exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
  return function CompileError(message) {
    return apply(init, this, arguments);
  };
});
exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
  return function LinkError(message) {
    return apply(init, this, arguments);
  };
});
exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
  return function RuntimeError(message) {
    return apply(init, this, arguments);
  };
});

},{"../internals/export":97,"../internals/function-apply":102,"../internals/global":122,"../internals/wrap-error-constructor-with-cause":279}],335:[function(require,module,exports){
"use strict";

var defineBuiltIn = require('../internals/define-built-in');
var errorToString = require('../internals/error-to-string');
var ErrorPrototype = Error.prototype;

// `Error.prototype.toString` method fix
// https://tc39.es/ecma262/#sec-error.prototype.tostring
if (ErrorPrototype.toString !== errorToString) {
  defineBuiltIn(ErrorPrototype, 'toString', errorToString);
}

},{"../internals/define-built-in":68,"../internals/error-to-string":96}],336:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var toString = require('../internals/to-string');
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var exec = uncurryThis(/./.exec);
var numberToString = uncurryThis(1.0.toString);
var toUpperCase = uncurryThis(''.toUpperCase);
var raw = /[\w*+\-./@]/;
var hex = function hex(code, length) {
  var result = numberToString(code, 16);
  while (result.length < length) result = '0' + result;
  return result;
};

// `escape` method
// https://tc39.es/ecma262/#sec-escape-string
$({
  global: true
}, {
  escape: function escape(string) {
    var str = toString(string);
    var result = '';
    var length = str.length;
    var index = 0;
    var chr, code;
    while (index < length) {
      chr = charAt(str, index++);
      if (exec(raw, chr)) {
        result += chr;
      } else {
        code = charCodeAt(chr, 0);
        if (code < 256) {
          result += '%' + hex(code, 2);
        } else {
          result += '%u' + toUpperCase(hex(code, 4));
        }
      }
    }
    return result;
  }
});

},{"../internals/export":97,"../internals/function-uncurry-this":110,"../internals/to-string":261}],337:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
var $ = require('../internals/export');
var bind = require('../internals/function-bind');

// `Function.prototype.bind` method
// https://tc39.es/ecma262/#sec-function.prototype.bind
// eslint-disable-next-line es/no-function-prototype-bind -- detection
$({
  target: 'Function',
  proto: true,
  forced: Function.bind !== bind
}, {
  bind: bind
});

},{"../internals/export":97,"../internals/function-bind":105}],338:[function(require,module,exports){
'use strict';

var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var definePropertyModule = require('../internals/object-define-property');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var wellKnownSymbol = require('../internals/well-known-symbol');
var makeBuiltIn = require('../internals/make-built-in');
var HAS_INSTANCE = wellKnownSymbol('hasInstance');
var FunctionPrototype = Function.prototype;

// `Function.prototype[@@hasInstance]` method
// https://tc39.es/ecma262/#sec-function.prototype-@@hasinstance
if (!(HAS_INSTANCE in FunctionPrototype)) {
  definePropertyModule.f(FunctionPrototype, HAS_INSTANCE, {
    value: makeBuiltIn(function (O) {
      if (!isCallable(this) || !isObject(O)) return false;
      var P = this.prototype;
      if (!isObject(P)) return O instanceof this;
      // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
      while (O = getPrototypeOf(O)) if (P === O) return true;
      return false;
    }, HAS_INSTANCE)
  });
}

},{"../internals/is-callable":138,"../internals/is-object":144,"../internals/make-built-in":159,"../internals/object-define-property":179,"../internals/object-get-prototype-of":184,"../internals/well-known-symbol":277}],339:[function(require,module,exports){
"use strict";

var DESCRIPTORS = require('../internals/descriptors');
var FUNCTION_NAME_EXISTS = require('../internals/function-name').EXISTS;
var uncurryThis = require('../internals/function-uncurry-this');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var FunctionPrototype = Function.prototype;
var functionToString = uncurryThis(FunctionPrototype.toString);
var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
var regExpExec = uncurryThis(nameRE.exec);
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
  defineBuiltInAccessor(FunctionPrototype, NAME, {
    configurable: true,
    get: function get() {
      try {
        return regExpExec(nameRE, functionToString(this))[1];
      } catch (error) {
        return '';
      }
    }
  });
}

},{"../internals/define-built-in-accessor":67,"../internals/descriptors":72,"../internals/function-name":107,"../internals/function-uncurry-this":110}],340:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var global = require('../internals/global');

// `globalThis` object
// https://tc39.es/ecma262/#sec-globalthis
$({
  global: true,
  forced: global.globalThis !== global
}, {
  globalThis: global
});

},{"../internals/export":97,"../internals/global":122}],341:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var apply = require('../internals/function-apply');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');
var isSymbol = require('../internals/is-symbol');
var arraySlice = require('../internals/array-slice');
var getReplacerFunction = require('../internals/get-json-replacer-function');
var NATIVE_SYMBOL = require('../internals/symbol-constructor-detection');
var $String = String;
var $stringify = getBuiltIn('JSON', 'stringify');
var exec = uncurryThis(/./.exec);
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var replace = uncurryThis(''.replace);
var numberToString = uncurryThis(1.0.toString);
var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;
var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function () {
  var symbol = getBuiltIn('Symbol')();
  // MS Edge converts symbol values to JSON as {}
  return $stringify([symbol]) != '[null]'
  // WebKit converts symbol values to JSON as null
  || $stringify({
    a: symbol
  }) != '{}'
  // V8 throws on boxed symbols
  || $stringify(Object(symbol)) != '{}';
});

// https://github.com/tc39/proposal-well-formed-stringify
var ILL_FORMED_UNICODE = fails(function () {
  return $stringify("\uDF06\uD834") !== "\"\\udf06\\ud834\"" || $stringify("\uDEAD") !== "\"\\udead\"";
});
var stringifyWithSymbolsFix = function stringifyWithSymbolsFix(it, replacer) {
  var args = arraySlice(arguments);
  var $replacer = getReplacerFunction(replacer);
  if (!isCallable($replacer) && (it === undefined || isSymbol(it))) return; // IE8 returns string on undefined
  args[1] = function (key, value) {
    // some old implementations (like WebKit) could pass numbers as keys
    if (isCallable($replacer)) value = call($replacer, this, $String(key), value);
    if (!isSymbol(value)) return value;
  };
  return apply($stringify, null, args);
};
var fixIllFormed = function fixIllFormed(match, offset, string) {
  var prev = charAt(string, offset - 1);
  var next = charAt(string, offset + 1);
  if (exec(low, match) && !exec(hi, next) || exec(hi, match) && !exec(low, prev)) {
    return "\\u" + numberToString(charCodeAt(match, 0), 16);
  }
  return match;
};
if ($stringify) {
  // `JSON.stringify` method
  // https://tc39.es/ecma262/#sec-json.stringify
  $({
    target: 'JSON',
    stat: true,
    arity: 3,
    forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE
  }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice(arguments);
      var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
    }
  });
}

},{"../internals/array-slice":36,"../internals/export":97,"../internals/fails":98,"../internals/function-apply":102,"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/get-built-in":113,"../internals/get-json-replacer-function":118,"../internals/is-callable":138,"../internals/is-symbol":148,"../internals/symbol-constructor-detection":244}],342:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var setToStringTag = require('../internals/set-to-string-tag');

// JSON[@@toStringTag] property
// https://tc39.es/ecma262/#sec-json-@@tostringtag
setToStringTag(global.JSON, 'JSON', true);

},{"../internals/global":122,"../internals/set-to-string-tag":227}],343:[function(require,module,exports){
'use strict';

var collection = require('../internals/collection');
var collectionStrong = require('../internals/collection-strong');

// `Map` constructor
// https://tc39.es/ecma262/#sec-map-objects
collection('Map', function (init) {
  return function Map() {
    return init(this, arguments.length ? arguments[0] : undefined);
  };
}, collectionStrong);

},{"../internals/collection":56,"../internals/collection-strong":54}],344:[function(require,module,exports){
"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
require('../modules/es.map.constructor');

},{"../modules/es.map.constructor":343}],345:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var log1p = require('../internals/math-log1p');

// eslint-disable-next-line es/no-math-acosh -- required for testing
var $acosh = Math.acosh;
var log = Math.log;
var sqrt = Math.sqrt;
var LN2 = Math.LN2;
var FORCED = !$acosh
// V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
|| Math.floor($acosh(Number.MAX_VALUE)) != 710
// Tor Browser bug: Math.acosh(Infinity) -> NaN
|| $acosh(Infinity) != Infinity;

// `Math.acosh` method
// https://tc39.es/ecma262/#sec-math.acosh
$({
  target: 'Math',
  stat: true,
  forced: FORCED
}, {
  acosh: function acosh(x) {
    var n = +x;
    return n < 1 ? NaN : n > 94906265.62425156 ? log(n) + LN2 : log1p(n - 1 + sqrt(n - 1) * sqrt(n + 1));
  }
});

},{"../internals/export":97,"../internals/math-log1p":164}],346:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');

// eslint-disable-next-line es/no-math-asinh -- required for testing
var $asinh = Math.asinh;
var log = Math.log;
var sqrt = Math.sqrt;
function asinh(x) {
  var n = +x;
  return !isFinite(n) || n == 0 ? n : n < 0 ? -asinh(-n) : log(n + sqrt(n * n + 1));
}
var FORCED = !($asinh && 1 / $asinh(0) > 0);

// `Math.asinh` method
// https://tc39.es/ecma262/#sec-math.asinh
// Tor Browser bug: Math.asinh(0) -> -0
$({
  target: 'Math',
  stat: true,
  forced: FORCED
}, {
  asinh: asinh
});

},{"../internals/export":97}],347:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');

// eslint-disable-next-line es/no-math-atanh -- required for testing
var $atanh = Math.atanh;
var log = Math.log;
var FORCED = !($atanh && 1 / $atanh(-0) < 0);

// `Math.atanh` method
// https://tc39.es/ecma262/#sec-math.atanh
// Tor Browser bug: Math.atanh(-0) -> 0
$({
  target: 'Math',
  stat: true,
  forced: FORCED
}, {
  atanh: function atanh(x) {
    var n = +x;
    return n == 0 ? n : log((1 + n) / (1 - n)) / 2;
  }
});

},{"../internals/export":97}],348:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var sign = require('../internals/math-sign');
var abs = Math.abs;
var pow = Math.pow;

// `Math.cbrt` method
// https://tc39.es/ecma262/#sec-math.cbrt
$({
  target: 'Math',
  stat: true
}, {
  cbrt: function cbrt(x) {
    var n = +x;
    return sign(n) * pow(abs(n), 1 / 3);
  }
});

},{"../internals/export":97,"../internals/math-sign":165}],349:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var floor = Math.floor;
var log = Math.log;
var LOG2E = Math.LOG2E;

// `Math.clz32` method
// https://tc39.es/ecma262/#sec-math.clz32
$({
  target: 'Math',
  stat: true
}, {
  clz32: function clz32(x) {
    var n = x >>> 0;
    return n ? 31 - floor(log(n + 0.5) * LOG2E) : 32;
  }
});

},{"../internals/export":97}],350:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var expm1 = require('../internals/math-expm1');

// eslint-disable-next-line es/no-math-cosh -- required for testing
var $cosh = Math.cosh;
var abs = Math.abs;
var E = Math.E;
var FORCED = !$cosh || $cosh(710) === Infinity;

// `Math.cosh` method
// https://tc39.es/ecma262/#sec-math.cosh
$({
  target: 'Math',
  stat: true,
  forced: FORCED
}, {
  cosh: function cosh(x) {
    var t = expm1(abs(x) - 1) + 1;
    return (t + 1 / (t * E * E)) * (E / 2);
  }
});

},{"../internals/export":97,"../internals/math-expm1":161}],351:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var expm1 = require('../internals/math-expm1');

// `Math.expm1` method
// https://tc39.es/ecma262/#sec-math.expm1
// eslint-disable-next-line es/no-math-expm1 -- required for testing
$({
  target: 'Math',
  stat: true,
  forced: expm1 != Math.expm1
}, {
  expm1: expm1
});

},{"../internals/export":97,"../internals/math-expm1":161}],352:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var fround = require('../internals/math-fround');

// `Math.fround` method
// https://tc39.es/ecma262/#sec-math.fround
$({
  target: 'Math',
  stat: true
}, {
  fround: fround
});

},{"../internals/export":97,"../internals/math-fround":162}],353:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');

// eslint-disable-next-line es/no-math-hypot -- required for testing
var $hypot = Math.hypot;
var abs = Math.abs;
var sqrt = Math.sqrt;

// Chrome 77 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=9546
var FORCED = !!$hypot && $hypot(Infinity, NaN) !== Infinity;

// `Math.hypot` method
// https://tc39.es/ecma262/#sec-math.hypot
$({
  target: 'Math',
  stat: true,
  arity: 2,
  forced: FORCED
}, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  hypot: function hypot(value1, value2) {
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * sqrt(sum);
  }
});

},{"../internals/export":97}],354:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var fails = require('../internals/fails');

// eslint-disable-next-line es/no-math-imul -- required for testing
var $imul = Math.imul;
var FORCED = fails(function () {
  return $imul(0xFFFFFFFF, 5) != -5 || $imul.length != 2;
});

// `Math.imul` method
// https://tc39.es/ecma262/#sec-math.imul
// some WebKit versions fails with big numbers, some has wrong arity
$({
  target: 'Math',
  stat: true,
  forced: FORCED
}, {
  imul: function imul(x, y) {
    var UINT16 = 0xFFFF;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

},{"../internals/export":97,"../internals/fails":98}],355:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var log10 = require('../internals/math-log10');

// `Math.log10` method
// https://tc39.es/ecma262/#sec-math.log10
$({
  target: 'Math',
  stat: true
}, {
  log10: log10
});

},{"../internals/export":97,"../internals/math-log10":163}],356:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var log1p = require('../internals/math-log1p');

// `Math.log1p` method
// https://tc39.es/ecma262/#sec-math.log1p
$({
  target: 'Math',
  stat: true
}, {
  log1p: log1p
});

},{"../internals/export":97,"../internals/math-log1p":164}],357:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var log = Math.log;
var LN2 = Math.LN2;

// `Math.log2` method
// https://tc39.es/ecma262/#sec-math.log2
$({
  target: 'Math',
  stat: true
}, {
  log2: function log2(x) {
    return log(x) / LN2;
  }
});

},{"../internals/export":97}],358:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var sign = require('../internals/math-sign');

// `Math.sign` method
// https://tc39.es/ecma262/#sec-math.sign
$({
  target: 'Math',
  stat: true
}, {
  sign: sign
});

},{"../internals/export":97,"../internals/math-sign":165}],359:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var fails = require('../internals/fails');
var expm1 = require('../internals/math-expm1');
var abs = Math.abs;
var exp = Math.exp;
var E = Math.E;
var FORCED = fails(function () {
  // eslint-disable-next-line es/no-math-sinh -- required for testing
  return Math.sinh(-2e-17) != -2e-17;
});

// `Math.sinh` method
// https://tc39.es/ecma262/#sec-math.sinh
// V8 near Chromium 38 has a problem with very small numbers
$({
  target: 'Math',
  stat: true,
  forced: FORCED
}, {
  sinh: function sinh(x) {
    var n = +x;
    return abs(n) < 1 ? (expm1(n) - expm1(-n)) / 2 : (exp(n - 1) - exp(-n - 1)) * (E / 2);
  }
});

},{"../internals/export":97,"../internals/fails":98,"../internals/math-expm1":161}],360:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var expm1 = require('../internals/math-expm1');
var exp = Math.exp;

// `Math.tanh` method
// https://tc39.es/ecma262/#sec-math.tanh
$({
  target: 'Math',
  stat: true
}, {
  tanh: function tanh(x) {
    var n = +x;
    var a = expm1(n);
    var b = expm1(-n);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(n) + exp(-n));
  }
});

},{"../internals/export":97,"../internals/math-expm1":161}],361:[function(require,module,exports){
"use strict";

var setToStringTag = require('../internals/set-to-string-tag');

// Math[@@toStringTag] property
// https://tc39.es/ecma262/#sec-math-@@tostringtag
setToStringTag(Math, 'Math', true);

},{"../internals/set-to-string-tag":227}],362:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var trunc = require('../internals/math-trunc');

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
$({
  target: 'Math',
  stat: true
}, {
  trunc: trunc
});

},{"../internals/export":97,"../internals/math-trunc":166}],363:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var IS_PURE = require('../internals/is-pure');
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var path = require('../internals/path');
var uncurryThis = require('../internals/function-uncurry-this');
var isForced = require('../internals/is-forced');
var hasOwn = require('../internals/has-own-property');
var inheritIfRequired = require('../internals/inherit-if-required');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var isSymbol = require('../internals/is-symbol');
var toPrimitive = require('../internals/to-primitive');
var fails = require('../internals/fails');
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var defineProperty = require('../internals/object-define-property').f;
var thisNumberValue = require('../internals/this-number-value');
var trim = require('../internals/string-trim').trim;
var NUMBER = 'Number';
var NativeNumber = global[NUMBER];
var PureNumberNamespace = path[NUMBER];
var NumberPrototype = NativeNumber.prototype;
var TypeError = global.TypeError;
var stringSlice = uncurryThis(''.slice);
var charCodeAt = uncurryThis(''.charCodeAt);

// `ToNumeric` abstract operation
// https://tc39.es/ecma262/#sec-tonumeric
var toNumeric = function toNumeric(value) {
  var primValue = toPrimitive(value, 'number');
  return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
};

// `ToNumber` abstract operation
// https://tc39.es/ecma262/#sec-tonumber
var toNumber = function toNumber(argument) {
  var it = toPrimitive(argument, 'number');
  var first, third, radix, maxCode, digits, length, index, code;
  if (isSymbol(it)) throw TypeError('Cannot convert a Symbol value to a number');
  if (typeof it == 'string' && it.length > 2) {
    it = trim(it);
    first = charCodeAt(it, 0);
    if (first === 43 || first === 45) {
      third = charCodeAt(it, 2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (charCodeAt(it, 1)) {
        case 66:
        case 98:
          radix = 2;
          maxCode = 49;
          break;
        // fast equal of /^0b[01]+$/i
        case 79:
        case 111:
          radix = 8;
          maxCode = 55;
          break;
        // fast equal of /^0o[0-7]+$/i
        default:
          return +it;
      }
      digits = stringSlice(it, 2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = charCodeAt(digits, index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      }
      return parseInt(digits, radix);
    }
  }
  return +it;
};
var FORCED = isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'));
var calledWithNew = function calledWithNew(dummy) {
  // includes check on 1..constructor(foo) case
  return isPrototypeOf(NumberPrototype, dummy) && fails(function () {
    thisNumberValue(dummy);
  });
};

// `Number` constructor
// https://tc39.es/ecma262/#sec-number-constructor
var NumberWrapper = function Number(value) {
  var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
  return calledWithNew(this) ? inheritIfRequired(Object(n), this, NumberWrapper) : n;
};
NumberWrapper.prototype = NumberPrototype;
if (FORCED && !IS_PURE) NumberPrototype.constructor = NumberWrapper;
$({
  global: true,
  constructor: true,
  wrap: true,
  forced: FORCED
}, {
  Number: NumberWrapper
});

// Use `internal/copy-constructor-properties` helper in `core-js@4`
var copyConstructorProperties = function copyConstructorProperties(target, source) {
  for (var keys = DESCRIPTORS ? getOwnPropertyNames(source) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' +
    // ESNext
    'fromString,range').split(','), j = 0, key; keys.length > j; j++) {
    if (hasOwn(source, key = keys[j]) && !hasOwn(target, key)) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};
if (IS_PURE && PureNumberNamespace) copyConstructorProperties(path[NUMBER], PureNumberNamespace);
if (FORCED || IS_PURE) copyConstructorProperties(path[NUMBER], NativeNumber);

},{"../internals/descriptors":72,"../internals/export":97,"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/global":122,"../internals/has-own-property":123,"../internals/inherit-if-required":130,"../internals/is-forced":141,"../internals/is-pure":145,"../internals/is-symbol":148,"../internals/object-define-property":179,"../internals/object-get-own-property-descriptor":180,"../internals/object-get-own-property-names":182,"../internals/object-is-prototype-of":186,"../internals/path":197,"../internals/string-trim":242,"../internals/this-number-value":248,"../internals/to-primitive":258}],364:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');

// `Number.EPSILON` constant
// https://tc39.es/ecma262/#sec-number.epsilon
$({
  target: 'Number',
  stat: true,
  nonConfigurable: true,
  nonWritable: true
}, {
  EPSILON: Math.pow(2, -52)
});

},{"../internals/export":97}],365:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var numberIsFinite = require('../internals/number-is-finite');

// `Number.isFinite` method
// https://tc39.es/ecma262/#sec-number.isfinite
$({
  target: 'Number',
  stat: true
}, {
  isFinite: numberIsFinite
});

},{"../internals/export":97,"../internals/number-is-finite":173}],366:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var isIntegralNumber = require('../internals/is-integral-number');

// `Number.isInteger` method
// https://tc39.es/ecma262/#sec-number.isinteger
$({
  target: 'Number',
  stat: true
}, {
  isInteger: isIntegralNumber
});

},{"../internals/export":97,"../internals/is-integral-number":142}],367:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');

// `Number.isNaN` method
// https://tc39.es/ecma262/#sec-number.isnan
$({
  target: 'Number',
  stat: true
}, {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare -- NaN check
    return number != number;
  }
});

},{"../internals/export":97}],368:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var isIntegralNumber = require('../internals/is-integral-number');
var abs = Math.abs;

// `Number.isSafeInteger` method
// https://tc39.es/ecma262/#sec-number.issafeinteger
$({
  target: 'Number',
  stat: true
}, {
  isSafeInteger: function isSafeInteger(number) {
    return isIntegralNumber(number) && abs(number) <= 0x1FFFFFFFFFFFFF;
  }
});

},{"../internals/export":97,"../internals/is-integral-number":142}],369:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');

// `Number.MAX_SAFE_INTEGER` constant
// https://tc39.es/ecma262/#sec-number.max_safe_integer
$({
  target: 'Number',
  stat: true,
  nonConfigurable: true,
  nonWritable: true
}, {
  MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
});

},{"../internals/export":97}],370:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');

// `Number.MIN_SAFE_INTEGER` constant
// https://tc39.es/ecma262/#sec-number.min_safe_integer
$({
  target: 'Number',
  stat: true,
  nonConfigurable: true,
  nonWritable: true
}, {
  MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
});

},{"../internals/export":97}],371:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var parseFloat = require('../internals/number-parse-float');

// `Number.parseFloat` method
// https://tc39.es/ecma262/#sec-number.parseFloat
// eslint-disable-next-line es/no-number-parsefloat -- required for testing
$({
  target: 'Number',
  stat: true,
  forced: Number.parseFloat != parseFloat
}, {
  parseFloat: parseFloat
});

},{"../internals/export":97,"../internals/number-parse-float":174}],372:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var parseInt = require('../internals/number-parse-int');

// `Number.parseInt` method
// https://tc39.es/ecma262/#sec-number.parseint
// eslint-disable-next-line es/no-number-parseint -- required for testing
$({
  target: 'Number',
  stat: true,
  forced: Number.parseInt != parseInt
}, {
  parseInt: parseInt
});

},{"../internals/export":97,"../internals/number-parse-int":175}],373:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var thisNumberValue = require('../internals/this-number-value');
var $repeat = require('../internals/string-repeat');
var log10 = require('../internals/math-log10');
var fails = require('../internals/fails');
var $RangeError = RangeError;
var $String = String;
var $isFinite = isFinite;
var abs = Math.abs;
var floor = Math.floor;
var pow = Math.pow;
var round = Math.round;
var nativeToExponential = uncurryThis(1.0.toExponential);
var repeat = uncurryThis($repeat);
var stringSlice = uncurryThis(''.slice);

// Edge 17-
var ROUNDS_PROPERLY = nativeToExponential(-6.9e-11, 4) === '-6.9000e-11'
// IE11- && Edge 14-
&& nativeToExponential(1.255, 2) === '1.25e+0'
// FF86-, V8 ~ Chrome 49-50
&& nativeToExponential(12345, 3) === '1.235e+4'
// FF86-, V8 ~ Chrome 49-50
&& nativeToExponential(25, 0) === '3e+1';

// IE8-
var throwsOnInfinityFraction = function throwsOnInfinityFraction() {
  return fails(function () {
    nativeToExponential(1, Infinity);
  }) && fails(function () {
    nativeToExponential(1, -Infinity);
  });
};

// Safari <11 && FF <50
var properNonFiniteThisCheck = function properNonFiniteThisCheck() {
  return !fails(function () {
    nativeToExponential(Infinity, Infinity);
    nativeToExponential(NaN, Infinity);
  });
};
var FORCED = !ROUNDS_PROPERLY || !throwsOnInfinityFraction() || !properNonFiniteThisCheck();

// `Number.prototype.toExponential` method
// https://tc39.es/ecma262/#sec-number.prototype.toexponential
$({
  target: 'Number',
  proto: true,
  forced: FORCED
}, {
  toExponential: function toExponential(fractionDigits) {
    var x = thisNumberValue(this);
    if (fractionDigits === undefined) return nativeToExponential(x);
    var f = toIntegerOrInfinity(fractionDigits);
    if (!$isFinite(x)) return String(x);
    // TODO: ES2018 increased the maximum number of fraction digits to 100, need to improve the implementation
    if (f < 0 || f > 20) throw $RangeError('Incorrect fraction digits');
    if (ROUNDS_PROPERLY) return nativeToExponential(x, f);
    var s = '';
    var m = '';
    var e = 0;
    var c = '';
    var d = '';
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x === 0) {
      e = 0;
      m = repeat('0', f + 1);
    } else {
      // this block is based on https://gist.github.com/SheetJSDev/1100ad56b9f856c95299ed0e068eea08
      // TODO: improve accuracy with big fraction digits
      var l = log10(x);
      e = floor(l);
      var n = 0;
      var w = pow(10, e - f);
      n = round(x / w);
      if (2 * x >= (2 * n + 1) * w) {
        n += 1;
      }
      if (n >= pow(10, f + 1)) {
        n /= 10;
        e += 1;
      }
      m = $String(n);
    }
    if (f !== 0) {
      m = stringSlice(m, 0, 1) + '.' + stringSlice(m, 1);
    }
    if (e === 0) {
      c = '+';
      d = '0';
    } else {
      c = e > 0 ? '+' : '-';
      d = $String(abs(e));
    }
    m += 'e' + c + d;
    return s + m;
  }
});

},{"../internals/export":97,"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/math-log10":163,"../internals/string-repeat":238,"../internals/this-number-value":248,"../internals/to-integer-or-infinity":253}],374:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var thisNumberValue = require('../internals/this-number-value');
var $repeat = require('../internals/string-repeat');
var fails = require('../internals/fails');
var $RangeError = RangeError;
var $String = String;
var floor = Math.floor;
var repeat = uncurryThis($repeat);
var stringSlice = uncurryThis(''.slice);
var nativeToFixed = uncurryThis(1.0.toFixed);
var pow = function pow(x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function log(x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  }
  return n;
};
var multiply = function multiply(data, n, c) {
  var index = -1;
  var c2 = c;
  while (++index < 6) {
    c2 += n * data[index];
    data[index] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function divide(data, n) {
  var index = 6;
  var c = 0;
  while (--index >= 0) {
    c += data[index];
    data[index] = floor(c / n);
    c = c % n * 1e7;
  }
};
var dataToString = function dataToString(data) {
  var index = 6;
  var s = '';
  while (--index >= 0) {
    if (s !== '' || index === 0 || data[index] !== 0) {
      var t = $String(data[index]);
      s = s === '' ? t : s + repeat('0', 7 - t.length) + t;
    }
  }
  return s;
};
var FORCED = fails(function () {
  return nativeToFixed(0.00008, 3) !== '0.000' || nativeToFixed(0.9, 0) !== '1' || nativeToFixed(1.255, 2) !== '1.25' || nativeToFixed(1000000000000000128.0, 0) !== '1000000000000000128';
}) || !fails(function () {
  // V8 ~ Android 4.3-
  nativeToFixed({});
});

// `Number.prototype.toFixed` method
// https://tc39.es/ecma262/#sec-number.prototype.tofixed
$({
  target: 'Number',
  proto: true,
  forced: FORCED
}, {
  toFixed: function toFixed(fractionDigits) {
    var number = thisNumberValue(this);
    var fractDigits = toIntegerOrInfinity(fractionDigits);
    var data = [0, 0, 0, 0, 0, 0];
    var sign = '';
    var result = '0';
    var e, z, j, k;

    // TODO: ES2018 increased the maximum number of fraction digits to 100, need to improve the implementation
    if (fractDigits < 0 || fractDigits > 20) throw $RangeError('Incorrect fraction digits');
    // eslint-disable-next-line no-self-compare -- NaN check
    if (number != number) return 'NaN';
    if (number <= -1e21 || number >= 1e21) return $String(number);
    if (number < 0) {
      sign = '-';
      number = -number;
    }
    if (number > 1e-21) {
      e = log(number * pow(2, 69, 1)) - 69;
      z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(data, 0, z);
        j = fractDigits;
        while (j >= 7) {
          multiply(data, 1e7, 0);
          j -= 7;
        }
        multiply(data, pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(data, 1 << 23);
          j -= 23;
        }
        divide(data, 1 << j);
        multiply(data, 1, 1);
        divide(data, 2);
        result = dataToString(data);
      } else {
        multiply(data, 0, z);
        multiply(data, 1 << -e, 0);
        result = dataToString(data) + repeat('0', fractDigits);
      }
    }
    if (fractDigits > 0) {
      k = result.length;
      result = sign + (k <= fractDigits ? '0.' + repeat('0', fractDigits - k) + result : stringSlice(result, 0, k - fractDigits) + '.' + stringSlice(result, k - fractDigits));
    } else {
      result = sign + result;
    }
    return result;
  }
});

},{"../internals/export":97,"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/string-repeat":238,"../internals/this-number-value":248,"../internals/to-integer-or-infinity":253}],375:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var thisNumberValue = require('../internals/this-number-value');
var nativeToPrecision = uncurryThis(1.0.toPrecision);
var FORCED = fails(function () {
  // IE7-
  return nativeToPrecision(1, undefined) !== '1';
}) || !fails(function () {
  // V8 ~ Android 4.3-
  nativeToPrecision({});
});

// `Number.prototype.toPrecision` method
// https://tc39.es/ecma262/#sec-number.prototype.toprecision
$({
  target: 'Number',
  proto: true,
  forced: FORCED
}, {
  toPrecision: function toPrecision(precision) {
    return precision === undefined ? nativeToPrecision(thisNumberValue(this)) : nativeToPrecision(thisNumberValue(this), precision);
  }
});

},{"../internals/export":97,"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/this-number-value":248}],376:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var assign = require('../internals/object-assign');

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es/no-object-assign -- required for testing
$({
  target: 'Object',
  stat: true,
  arity: 2,
  forced: Object.assign !== assign
}, {
  assign: assign
});

},{"../internals/export":97,"../internals/object-assign":176}],377:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var create = require('../internals/object-create');

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
$({
  target: 'Object',
  stat: true,
  sham: !DESCRIPTORS
}, {
  create: create
});

},{"../internals/descriptors":72,"../internals/export":97,"../internals/object-create":177}],378:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var FORCED = require('../internals/object-prototype-accessors-forced');
var aCallable = require('../internals/a-callable');
var toObject = require('../internals/to-object');
var definePropertyModule = require('../internals/object-define-property');

// `Object.prototype.__defineGetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__defineGetter__
if (DESCRIPTORS) {
  $({
    target: 'Object',
    proto: true,
    forced: FORCED
  }, {
    __defineGetter__: function __defineGetter__(P, getter) {
      definePropertyModule.f(toObject(this), P, {
        get: aCallable(getter),
        enumerable: true,
        configurable: true
      });
    }
  });
}

},{"../internals/a-callable":3,"../internals/descriptors":72,"../internals/export":97,"../internals/object-define-property":179,"../internals/object-prototype-accessors-forced":190,"../internals/to-object":255}],379:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var defineProperties = require('../internals/object-define-properties').f;

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
$({
  target: 'Object',
  stat: true,
  forced: Object.defineProperties !== defineProperties,
  sham: !DESCRIPTORS
}, {
  defineProperties: defineProperties
});

},{"../internals/descriptors":72,"../internals/export":97,"../internals/object-define-properties":178}],380:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var defineProperty = require('../internals/object-define-property').f;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
// eslint-disable-next-line es/no-object-defineproperty -- safe
$({
  target: 'Object',
  stat: true,
  forced: Object.defineProperty !== defineProperty,
  sham: !DESCRIPTORS
}, {
  defineProperty: defineProperty
});

},{"../internals/descriptors":72,"../internals/export":97,"../internals/object-define-property":179}],381:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var FORCED = require('../internals/object-prototype-accessors-forced');
var aCallable = require('../internals/a-callable');
var toObject = require('../internals/to-object');
var definePropertyModule = require('../internals/object-define-property');

// `Object.prototype.__defineSetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__defineSetter__
if (DESCRIPTORS) {
  $({
    target: 'Object',
    proto: true,
    forced: FORCED
  }, {
    __defineSetter__: function __defineSetter__(P, setter) {
      definePropertyModule.f(toObject(this), P, {
        set: aCallable(setter),
        enumerable: true,
        configurable: true
      });
    }
  });
}

},{"../internals/a-callable":3,"../internals/descriptors":72,"../internals/export":97,"../internals/object-define-property":179,"../internals/object-prototype-accessors-forced":190,"../internals/to-object":255}],382:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var $entries = require('../internals/object-to-array').entries;

// `Object.entries` method
// https://tc39.es/ecma262/#sec-object.entries
$({
  target: 'Object',
  stat: true
}, {
  entries: function entries(O) {
    return $entries(O);
  }
});

},{"../internals/export":97,"../internals/object-to-array":192}],383:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var FREEZING = require('../internals/freezing');
var fails = require('../internals/fails');
var isObject = require('../internals/is-object');
var onFreeze = require('../internals/internal-metadata').onFreeze;

// eslint-disable-next-line es/no-object-freeze -- safe
var $freeze = Object.freeze;
var FAILS_ON_PRIMITIVES = fails(function () {
  $freeze(1);
});

// `Object.freeze` method
// https://tc39.es/ecma262/#sec-object.freeze
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES,
  sham: !FREEZING
}, {
  freeze: function freeze(it) {
    return $freeze && isObject(it) ? $freeze(onFreeze(it)) : it;
  }
});

},{"../internals/export":97,"../internals/fails":98,"../internals/freezing":101,"../internals/internal-metadata":133,"../internals/is-object":144}],384:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var iterate = require('../internals/iterate');
var createProperty = require('../internals/create-property');

// `Object.fromEntries` method
// https://github.com/tc39/proposal-object-from-entries
$({
  target: 'Object',
  stat: true
}, {
  fromEntries: function fromEntries(iterable) {
    var obj = {};
    iterate(iterable, function (k, v) {
      createProperty(obj, k, v);
    }, {
      AS_ENTRIES: true
    });
    return obj;
  }
});

},{"../internals/create-property":64,"../internals/export":97,"../internals/iterate":150}],385:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var fails = require('../internals/fails');
var toIndexedObject = require('../internals/to-indexed-object');
var nativeGetOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var DESCRIPTORS = require('../internals/descriptors');
var FORCED = !DESCRIPTORS || fails(function () {
  nativeGetOwnPropertyDescriptor(1);
});

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
$({
  target: 'Object',
  stat: true,
  forced: FORCED,
  sham: !DESCRIPTORS
}, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});

},{"../internals/descriptors":72,"../internals/export":97,"../internals/fails":98,"../internals/object-get-own-property-descriptor":180,"../internals/to-indexed-object":252}],386:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var ownKeys = require('../internals/own-keys');
var toIndexedObject = require('../internals/to-indexed-object');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var createProperty = require('../internals/create-property');

// `Object.getOwnPropertyDescriptors` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
$({
  target: 'Object',
  stat: true,
  sham: !DESCRIPTORS
}, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});

},{"../internals/create-property":64,"../internals/descriptors":72,"../internals/export":97,"../internals/object-get-own-property-descriptor":180,"../internals/own-keys":195,"../internals/to-indexed-object":252}],387:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var fails = require('../internals/fails');
var getOwnPropertyNames = require('../internals/object-get-own-property-names-external').f;

// eslint-disable-next-line es/no-object-getownpropertynames -- required for testing
var FAILS_ON_PRIMITIVES = fails(function () {
  return !Object.getOwnPropertyNames(1);
});

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES
}, {
  getOwnPropertyNames: getOwnPropertyNames
});

},{"../internals/export":97,"../internals/fails":98,"../internals/object-get-own-property-names-external":181}],388:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var NATIVE_SYMBOL = require('../internals/symbol-constructor-detection');
var fails = require('../internals/fails');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var toObject = require('../internals/to-object');

// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FORCED = !NATIVE_SYMBOL || fails(function () {
  getOwnPropertySymbolsModule.f(1);
});

// `Object.getOwnPropertySymbols` method
// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
$({
  target: 'Object',
  stat: true,
  forced: FORCED
}, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    var $getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
  }
});

},{"../internals/export":97,"../internals/fails":98,"../internals/object-get-own-property-symbols":183,"../internals/symbol-constructor-detection":244,"../internals/to-object":255}],389:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var fails = require('../internals/fails');
var toObject = require('../internals/to-object');
var nativeGetPrototypeOf = require('../internals/object-get-prototype-of');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');
var FAILS_ON_PRIMITIVES = fails(function () {
  nativeGetPrototypeOf(1);
});

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES,
  sham: !CORRECT_PROTOTYPE_GETTER
}, {
  getPrototypeOf: function getPrototypeOf(it) {
    return nativeGetPrototypeOf(toObject(it));
  }
});

},{"../internals/correct-prototype-getter":59,"../internals/export":97,"../internals/fails":98,"../internals/object-get-prototype-of":184,"../internals/to-object":255}],390:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var hasOwn = require('../internals/has-own-property');

// `Object.hasOwn` method
// https://github.com/tc39/proposal-accessible-object-hasownproperty
$({
  target: 'Object',
  stat: true
}, {
  hasOwn: hasOwn
});

},{"../internals/export":97,"../internals/has-own-property":123}],391:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var $isExtensible = require('../internals/object-is-extensible');

// `Object.isExtensible` method
// https://tc39.es/ecma262/#sec-object.isextensible
// eslint-disable-next-line es/no-object-isextensible -- safe
$({
  target: 'Object',
  stat: true,
  forced: Object.isExtensible !== $isExtensible
}, {
  isExtensible: $isExtensible
});

},{"../internals/export":97,"../internals/object-is-extensible":185}],392:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var fails = require('../internals/fails');
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var ARRAY_BUFFER_NON_EXTENSIBLE = require('../internals/array-buffer-non-extensible');

// eslint-disable-next-line es/no-object-isfrozen -- safe
var $isFrozen = Object.isFrozen;
var FORCED = ARRAY_BUFFER_NON_EXTENSIBLE || fails(function () {
  $isFrozen(1);
});

// `Object.isFrozen` method
// https://tc39.es/ecma262/#sec-object.isfrozen
$({
  target: 'Object',
  stat: true,
  forced: FORCED
}, {
  isFrozen: function isFrozen(it) {
    if (!isObject(it)) return true;
    if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) == 'ArrayBuffer') return true;
    return $isFrozen ? $isFrozen(it) : false;
  }
});

},{"../internals/array-buffer-non-extensible":15,"../internals/classof-raw":52,"../internals/export":97,"../internals/fails":98,"../internals/is-object":144}],393:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var fails = require('../internals/fails');
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var ARRAY_BUFFER_NON_EXTENSIBLE = require('../internals/array-buffer-non-extensible');

// eslint-disable-next-line es/no-object-issealed -- safe
var $isSealed = Object.isSealed;
var FORCED = ARRAY_BUFFER_NON_EXTENSIBLE || fails(function () {
  $isSealed(1);
});

// `Object.isSealed` method
// https://tc39.es/ecma262/#sec-object.issealed
$({
  target: 'Object',
  stat: true,
  forced: FORCED
}, {
  isSealed: function isSealed(it) {
    if (!isObject(it)) return true;
    if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) == 'ArrayBuffer') return true;
    return $isSealed ? $isSealed(it) : false;
  }
});

},{"../internals/array-buffer-non-extensible":15,"../internals/classof-raw":52,"../internals/export":97,"../internals/fails":98,"../internals/is-object":144}],394:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var is = require('../internals/same-value');

// `Object.is` method
// https://tc39.es/ecma262/#sec-object.is
$({
  target: 'Object',
  stat: true
}, {
  is: is
});

},{"../internals/export":97,"../internals/same-value":213}],395:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var toObject = require('../internals/to-object');
var nativeKeys = require('../internals/object-keys');
var fails = require('../internals/fails');
var FAILS_ON_PRIMITIVES = fails(function () {
  nativeKeys(1);
});

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES
}, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});

},{"../internals/export":97,"../internals/fails":98,"../internals/object-keys":188,"../internals/to-object":255}],396:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var FORCED = require('../internals/object-prototype-accessors-forced');
var toObject = require('../internals/to-object');
var toPropertyKey = require('../internals/to-property-key');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;

// `Object.prototype.__lookupGetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__lookupGetter__
if (DESCRIPTORS) {
  $({
    target: 'Object',
    proto: true,
    forced: FORCED
  }, {
    __lookupGetter__: function __lookupGetter__(P) {
      var O = toObject(this);
      var key = toPropertyKey(P);
      var desc;
      do {
        if (desc = getOwnPropertyDescriptor(O, key)) return desc.get;
      } while (O = getPrototypeOf(O));
    }
  });
}

},{"../internals/descriptors":72,"../internals/export":97,"../internals/object-get-own-property-descriptor":180,"../internals/object-get-prototype-of":184,"../internals/object-prototype-accessors-forced":190,"../internals/to-object":255,"../internals/to-property-key":259}],397:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var FORCED = require('../internals/object-prototype-accessors-forced');
var toObject = require('../internals/to-object');
var toPropertyKey = require('../internals/to-property-key');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;

// `Object.prototype.__lookupSetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__lookupSetter__
if (DESCRIPTORS) {
  $({
    target: 'Object',
    proto: true,
    forced: FORCED
  }, {
    __lookupSetter__: function __lookupSetter__(P) {
      var O = toObject(this);
      var key = toPropertyKey(P);
      var desc;
      do {
        if (desc = getOwnPropertyDescriptor(O, key)) return desc.set;
      } while (O = getPrototypeOf(O));
    }
  });
}

},{"../internals/descriptors":72,"../internals/export":97,"../internals/object-get-own-property-descriptor":180,"../internals/object-get-prototype-of":184,"../internals/object-prototype-accessors-forced":190,"../internals/to-object":255,"../internals/to-property-key":259}],398:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var isObject = require('../internals/is-object');
var onFreeze = require('../internals/internal-metadata').onFreeze;
var FREEZING = require('../internals/freezing');
var fails = require('../internals/fails');

// eslint-disable-next-line es/no-object-preventextensions -- safe
var $preventExtensions = Object.preventExtensions;
var FAILS_ON_PRIMITIVES = fails(function () {
  $preventExtensions(1);
});

// `Object.preventExtensions` method
// https://tc39.es/ecma262/#sec-object.preventextensions
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES,
  sham: !FREEZING
}, {
  preventExtensions: function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(onFreeze(it)) : it;
  }
});

},{"../internals/export":97,"../internals/fails":98,"../internals/freezing":101,"../internals/internal-metadata":133,"../internals/is-object":144}],399:[function(require,module,exports){
'use strict';

var DESCRIPTORS = require('../internals/descriptors');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var isObject = require('../internals/is-object');
var toObject = require('../internals/to-object');
var requireObjectCoercible = require('../internals/require-object-coercible');

// eslint-disable-next-line es/no-object-getprototypeof -- safe
var getPrototypeOf = Object.getPrototypeOf;
// eslint-disable-next-line es/no-object-setprototypeof -- safe
var setPrototypeOf = Object.setPrototypeOf;
var ObjectPrototype = Object.prototype;
var PROTO = '__proto__';

// `Object.prototype.__proto__` accessor
// https://tc39.es/ecma262/#sec-object.prototype.__proto__
if (DESCRIPTORS && getPrototypeOf && setPrototypeOf && !(PROTO in ObjectPrototype)) try {
  defineBuiltInAccessor(ObjectPrototype, PROTO, {
    configurable: true,
    get: function __proto__() {
      return getPrototypeOf(toObject(this));
    },
    set: function __proto__(proto) {
      var O = requireObjectCoercible(this);
      if (!isObject(proto) && proto !== null || !isObject(O)) return;
      setPrototypeOf(O, proto);
    }
  });
} catch (error) {/* empty */}

},{"../internals/define-built-in-accessor":67,"../internals/descriptors":72,"../internals/is-object":144,"../internals/require-object-coercible":212,"../internals/to-object":255}],400:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var isObject = require('../internals/is-object');
var onFreeze = require('../internals/internal-metadata').onFreeze;
var FREEZING = require('../internals/freezing');
var fails = require('../internals/fails');

// eslint-disable-next-line es/no-object-seal -- safe
var $seal = Object.seal;
var FAILS_ON_PRIMITIVES = fails(function () {
  $seal(1);
});

// `Object.seal` method
// https://tc39.es/ecma262/#sec-object.seal
$({
  target: 'Object',
  stat: true,
  forced: FAILS_ON_PRIMITIVES,
  sham: !FREEZING
}, {
  seal: function seal(it) {
    return $seal && isObject(it) ? $seal(onFreeze(it)) : it;
  }
});

},{"../internals/export":97,"../internals/fails":98,"../internals/freezing":101,"../internals/internal-metadata":133,"../internals/is-object":144}],401:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var setPrototypeOf = require('../internals/object-set-prototype-of');

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
$({
  target: 'Object',
  stat: true
}, {
  setPrototypeOf: setPrototypeOf
});

},{"../internals/export":97,"../internals/object-set-prototype-of":191}],402:[function(require,module,exports){
"use strict";

var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var defineBuiltIn = require('../internals/define-built-in');
var toString = require('../internals/object-to-string');

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  defineBuiltIn(Object.prototype, 'toString', toString, {
    unsafe: true
  });
}

},{"../internals/define-built-in":68,"../internals/object-to-string":193,"../internals/to-string-tag-support":260}],403:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var $values = require('../internals/object-to-array').values;

// `Object.values` method
// https://tc39.es/ecma262/#sec-object.values
$({
  target: 'Object',
  stat: true
}, {
  values: function values(O) {
    return $values(O);
  }
});

},{"../internals/export":97,"../internals/object-to-array":192}],404:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var $parseFloat = require('../internals/number-parse-float');

// `parseFloat` method
// https://tc39.es/ecma262/#sec-parsefloat-string
$({
  global: true,
  forced: parseFloat != $parseFloat
}, {
  parseFloat: $parseFloat
});

},{"../internals/export":97,"../internals/number-parse-float":174}],405:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var $parseInt = require('../internals/number-parse-int');

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
$({
  global: true,
  forced: parseInt != $parseInt
}, {
  parseInt: $parseInt
});

},{"../internals/export":97,"../internals/number-parse-int":175}],406:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var iterate = require('../internals/iterate');
var PROMISE_STATICS_INCORRECT_ITERATION = require('../internals/promise-statics-incorrect-iteration');

// `Promise.allSettled` method
// https://tc39.es/ecma262/#sec-promise.allsettled
$({
  target: 'Promise',
  stat: true,
  forced: PROMISE_STATICS_INCORRECT_ITERATION
}, {
  allSettled: function allSettled(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = {
            status: 'fulfilled',
            value: value
          };
          --remaining || resolve(values);
        }, function (error) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = {
            status: 'rejected',
            reason: error
          };
          --remaining || resolve(values);
        });
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/a-callable":3,"../internals/export":97,"../internals/function-call":106,"../internals/iterate":150,"../internals/new-promise-capability":169,"../internals/perform":198,"../internals/promise-statics-incorrect-iteration":202}],407:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var iterate = require('../internals/iterate');
var PROMISE_STATICS_INCORRECT_ITERATION = require('../internals/promise-statics-incorrect-iteration');

// `Promise.all` method
// https://tc39.es/ecma262/#sec-promise.all
$({
  target: 'Promise',
  stat: true,
  forced: PROMISE_STATICS_INCORRECT_ITERATION
}, {
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call($promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/a-callable":3,"../internals/export":97,"../internals/function-call":106,"../internals/iterate":150,"../internals/new-promise-capability":169,"../internals/perform":198,"../internals/promise-statics-incorrect-iteration":202}],408:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var getBuiltIn = require('../internals/get-built-in');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var iterate = require('../internals/iterate');
var PROMISE_STATICS_INCORRECT_ITERATION = require('../internals/promise-statics-incorrect-iteration');
var PROMISE_ANY_ERROR = 'No one promise resolved';

// `Promise.any` method
// https://tc39.es/ecma262/#sec-promise.any
$({
  target: 'Promise',
  stat: true,
  forced: PROMISE_STATICS_INCORRECT_ITERATION
}, {
  any: function any(iterable) {
    var C = this;
    var AggregateError = getBuiltIn('AggregateError');
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var errors = [];
      var counter = 0;
      var remaining = 1;
      var alreadyResolved = false;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyRejected = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyResolved = true;
          resolve(value);
        }, function (error) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyRejected = true;
          errors[index] = error;
          --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
        });
      });
      --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/a-callable":3,"../internals/export":97,"../internals/function-call":106,"../internals/get-built-in":113,"../internals/iterate":150,"../internals/new-promise-capability":169,"../internals/perform":198,"../internals/promise-statics-incorrect-iteration":202}],409:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var IS_PURE = require('../internals/is-pure');
var FORCED_PROMISE_CONSTRUCTOR = require('../internals/promise-constructor-detection').CONSTRUCTOR;
var NativePromiseConstructor = require('../internals/promise-native-constructor');
var getBuiltIn = require('../internals/get-built-in');
var isCallable = require('../internals/is-callable');
var defineBuiltIn = require('../internals/define-built-in');
var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

// `Promise.prototype.catch` method
// https://tc39.es/ecma262/#sec-promise.prototype.catch
$({
  target: 'Promise',
  proto: true,
  forced: FORCED_PROMISE_CONSTRUCTOR,
  real: true
}, {
  'catch': function _catch(onRejected) {
    return this.then(undefined, onRejected);
  }
});

// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
if (!IS_PURE && isCallable(NativePromiseConstructor)) {
  var method = getBuiltIn('Promise').prototype['catch'];
  if (NativePromisePrototype['catch'] !== method) {
    defineBuiltIn(NativePromisePrototype, 'catch', method, {
      unsafe: true
    });
  }
}

},{"../internals/define-built-in":68,"../internals/export":97,"../internals/get-built-in":113,"../internals/is-callable":138,"../internals/is-pure":145,"../internals/promise-constructor-detection":199,"../internals/promise-native-constructor":200}],410:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var IS_PURE = require('../internals/is-pure');
var IS_NODE = require('../internals/engine-is-node');
var global = require('../internals/global');
var call = require('../internals/function-call');
var defineBuiltIn = require('../internals/define-built-in');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var setToStringTag = require('../internals/set-to-string-tag');
var setSpecies = require('../internals/set-species');
var aCallable = require('../internals/a-callable');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var anInstance = require('../internals/an-instance');
var speciesConstructor = require('../internals/species-constructor');
var task = require('../internals/task').set;
var microtask = require('../internals/microtask');
var hostReportErrors = require('../internals/host-report-errors');
var perform = require('../internals/perform');
var Queue = require('../internals/queue');
var InternalStateModule = require('../internals/internal-state');
var NativePromiseConstructor = require('../internals/promise-native-constructor');
var PromiseConstructorDetection = require('../internals/promise-constructor-detection');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var PROMISE = 'Promise';
var FORCED_PROMISE_CONSTRUCTOR = PromiseConstructorDetection.CONSTRUCTOR;
var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var setInternalState = InternalStateModule.set;
var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var PromiseConstructor = NativePromiseConstructor;
var PromisePrototype = NativePromisePrototype;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;
var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

// helpers
var isThenable = function isThenable(it) {
  var then;
  return isObject(it) && isCallable(then = it.then) ? then : false;
};
var callReaction = function callReaction(reaction, state) {
  var value = state.value;
  var ok = state.state == FULFILLED;
  var handler = ok ? reaction.ok : reaction.fail;
  var resolve = reaction.resolve;
  var reject = reaction.reject;
  var domain = reaction.domain;
  var result, then, exited;
  try {
    if (handler) {
      if (!ok) {
        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
        state.rejection = HANDLED;
      }
      if (handler === true) result = value;else {
        if (domain) domain.enter();
        result = handler(value); // can throw
        if (domain) {
          domain.exit();
          exited = true;
        }
      }
      if (result === reaction.promise) {
        reject(TypeError('Promise-chain cycle'));
      } else if (then = isThenable(result)) {
        call(then, result, resolve, reject);
      } else resolve(result);
    } else reject(value);
  } catch (error) {
    if (domain && !exited) domain.exit();
    reject(error);
  }
};
var notify = function notify(state, isReject) {
  if (state.notified) return;
  state.notified = true;
  microtask(function () {
    var reactions = state.reactions;
    var reaction;
    while (reaction = reactions.get()) {
      callReaction(reaction, state);
    }
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};
var dispatchEvent = function dispatchEvent(name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = {
    promise: promise,
    reason: reason
  };
  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = global['on' + name])) handler(event);else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};
var onUnhandled = function onUnhandled(state) {
  call(task, global, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};
var isUnhandled = function isUnhandled(state) {
  return state.rejection !== HANDLED && !state.parent;
};
var onHandleUnhandled = function onHandleUnhandled(state) {
  call(task, global, function () {
    var promise = state.facade;
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};
var bind = function bind(fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};
var internalReject = function internalReject(state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};
var internalResolve = function internalResolve(state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = {
          done: false
        };
        try {
          call(then, value, bind(internalResolve, wrapper, state), bind(internalReject, wrapper, state));
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({
      done: false
    }, error, state);
  }
};

// constructor polyfill
if (FORCED_PROMISE_CONSTRUCTOR) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromisePrototype);
    aCallable(executor);
    call(Internal, this);
    var state = getInternalPromiseState(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };
  PromisePrototype = PromiseConstructor.prototype;

  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: new Queue(),
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };

  // `Promise.prototype.then` method
  // https://tc39.es/ecma262/#sec-promise.prototype.then
  Internal.prototype = defineBuiltIn(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
    var state = getInternalPromiseState(this);
    var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
    state.parent = true;
    reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
    reaction.fail = isCallable(onRejected) && onRejected;
    reaction.domain = IS_NODE ? process.domain : undefined;
    if (state.state == PENDING) state.reactions.add(reaction);else microtask(function () {
      callReaction(reaction, state);
    });
    return reaction.promise;
  });
  OwnPromiseCapability = function OwnPromiseCapability() {
    var promise = new Internal();
    var state = getInternalPromiseState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function newPromiseCapability(C) {
    return C === PromiseConstructor || C === PromiseWrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
  };
  if (!IS_PURE && isCallable(NativePromiseConstructor) && NativePromisePrototype !== Object.prototype) {
    nativeThen = NativePromisePrototype.then;
    if (!NATIVE_PROMISE_SUBCLASSING) {
      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
      defineBuiltIn(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          call(nativeThen, that, resolve, reject);
        }).then(onFulfilled, onRejected);
        // https://github.com/zloirock/core-js/issues/640
      }, {
        unsafe: true
      });
    }

    // make `.constructor === Promise` work for native promise-based APIs
    try {
      delete NativePromisePrototype.constructor;
    } catch (error) {/* empty */}

    // make `instanceof Promise` work for native promise-based APIs
    if (setPrototypeOf) {
      setPrototypeOf(NativePromisePrototype, PromisePrototype);
    }
  }
}
$({
  global: true,
  constructor: true,
  wrap: true,
  forced: FORCED_PROMISE_CONSTRUCTOR
}, {
  Promise: PromiseConstructor
});
setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

},{"../internals/a-callable":3,"../internals/an-instance":10,"../internals/define-built-in":68,"../internals/engine-is-node":86,"../internals/export":97,"../internals/function-call":106,"../internals/global":122,"../internals/host-report-errors":125,"../internals/internal-state":134,"../internals/is-callable":138,"../internals/is-object":144,"../internals/is-pure":145,"../internals/microtask":167,"../internals/new-promise-capability":169,"../internals/object-set-prototype-of":191,"../internals/perform":198,"../internals/promise-constructor-detection":199,"../internals/promise-native-constructor":200,"../internals/queue":204,"../internals/set-species":225,"../internals/set-to-string-tag":227,"../internals/species-constructor":232,"../internals/task":247}],411:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var IS_PURE = require('../internals/is-pure');
var NativePromiseConstructor = require('../internals/promise-native-constructor');
var fails = require('../internals/fails');
var getBuiltIn = require('../internals/get-built-in');
var isCallable = require('../internals/is-callable');
var speciesConstructor = require('../internals/species-constructor');
var promiseResolve = require('../internals/promise-resolve');
var defineBuiltIn = require('../internals/define-built-in');
var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!NativePromiseConstructor && fails(function () {
  // eslint-disable-next-line unicorn/no-thenable -- required for testing
  NativePromisePrototype['finally'].call({
    then: function then() {/* empty */}
  }, function () {/* empty */});
});

// `Promise.prototype.finally` method
// https://tc39.es/ecma262/#sec-promise.prototype.finally
$({
  target: 'Promise',
  proto: true,
  real: true,
  forced: NON_GENERIC
}, {
  'finally': function _finally(onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = isCallable(onFinally);
    return this.then(isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () {
        return x;
      });
    } : onFinally, isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () {
        throw e;
      });
    } : onFinally);
  }
});

// makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
if (!IS_PURE && isCallable(NativePromiseConstructor)) {
  var method = getBuiltIn('Promise').prototype['finally'];
  if (NativePromisePrototype['finally'] !== method) {
    defineBuiltIn(NativePromisePrototype, 'finally', method, {
      unsafe: true
    });
  }
}

},{"../internals/define-built-in":68,"../internals/export":97,"../internals/fails":98,"../internals/get-built-in":113,"../internals/is-callable":138,"../internals/is-pure":145,"../internals/promise-native-constructor":200,"../internals/promise-resolve":201,"../internals/species-constructor":232}],412:[function(require,module,exports){
"use strict";

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
require('../modules/es.promise.constructor');
require('../modules/es.promise.all');
require('../modules/es.promise.catch');
require('../modules/es.promise.race');
require('../modules/es.promise.reject');
require('../modules/es.promise.resolve');

},{"../modules/es.promise.all":407,"../modules/es.promise.catch":409,"../modules/es.promise.constructor":410,"../modules/es.promise.race":413,"../modules/es.promise.reject":414,"../modules/es.promise.resolve":415}],413:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var iterate = require('../internals/iterate');
var PROMISE_STATICS_INCORRECT_ITERATION = require('../internals/promise-statics-incorrect-iteration');

// `Promise.race` method
// https://tc39.es/ecma262/#sec-promise.race
$({
  target: 'Promise',
  stat: true,
  forced: PROMISE_STATICS_INCORRECT_ITERATION
}, {
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      iterate(iterable, function (promise) {
        call($promiseResolve, C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/a-callable":3,"../internals/export":97,"../internals/function-call":106,"../internals/iterate":150,"../internals/new-promise-capability":169,"../internals/perform":198,"../internals/promise-statics-incorrect-iteration":202}],414:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var FORCED_PROMISE_CONSTRUCTOR = require('../internals/promise-constructor-detection').CONSTRUCTOR;

// `Promise.reject` method
// https://tc39.es/ecma262/#sec-promise.reject
$({
  target: 'Promise',
  stat: true,
  forced: FORCED_PROMISE_CONSTRUCTOR
}, {
  reject: function reject(r) {
    var capability = newPromiseCapabilityModule.f(this);
    call(capability.reject, undefined, r);
    return capability.promise;
  }
});

},{"../internals/export":97,"../internals/function-call":106,"../internals/new-promise-capability":169,"../internals/promise-constructor-detection":199}],415:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var IS_PURE = require('../internals/is-pure');
var NativePromiseConstructor = require('../internals/promise-native-constructor');
var FORCED_PROMISE_CONSTRUCTOR = require('../internals/promise-constructor-detection').CONSTRUCTOR;
var promiseResolve = require('../internals/promise-resolve');
var PromiseConstructorWrapper = getBuiltIn('Promise');
var CHECK_WRAPPER = IS_PURE && !FORCED_PROMISE_CONSTRUCTOR;

// `Promise.resolve` method
// https://tc39.es/ecma262/#sec-promise.resolve
$({
  target: 'Promise',
  stat: true,
  forced: IS_PURE || FORCED_PROMISE_CONSTRUCTOR
}, {
  resolve: function resolve(x) {
    return promiseResolve(CHECK_WRAPPER && this === PromiseConstructorWrapper ? NativePromiseConstructor : this, x);
  }
});

},{"../internals/export":97,"../internals/get-built-in":113,"../internals/is-pure":145,"../internals/promise-constructor-detection":199,"../internals/promise-native-constructor":200,"../internals/promise-resolve":201}],416:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var functionApply = require('../internals/function-apply');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var fails = require('../internals/fails');

// MS Edge argumentsList argument is optional
var OPTIONAL_ARGUMENTS_LIST = !fails(function () {
  // eslint-disable-next-line es/no-reflect -- required for testing
  Reflect.apply(function () {/* empty */});
});

// `Reflect.apply` method
// https://tc39.es/ecma262/#sec-reflect.apply
$({
  target: 'Reflect',
  stat: true,
  forced: OPTIONAL_ARGUMENTS_LIST
}, {
  apply: function apply(target, thisArgument, argumentsList) {
    return functionApply(aCallable(target), thisArgument, anObject(argumentsList));
  }
});

},{"../internals/a-callable":3,"../internals/an-object":11,"../internals/export":97,"../internals/fails":98,"../internals/function-apply":102}],417:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var apply = require('../internals/function-apply');
var bind = require('../internals/function-bind');
var aConstructor = require('../internals/a-constructor');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var create = require('../internals/object-create');
var fails = require('../internals/fails');
var nativeConstruct = getBuiltIn('Reflect', 'construct');
var ObjectPrototype = Object.prototype;
var push = [].push;

// `Reflect.construct` method
// https://tc39.es/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() {/* empty */}
  return !(nativeConstruct(function () {/* empty */}, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  nativeConstruct(function () {/* empty */});
});
var FORCED = NEW_TARGET_BUG || ARGS_BUG;
$({
  target: 'Reflect',
  stat: true,
  forced: FORCED,
  sham: FORCED
}, {
  construct: function construct(Target, args /* , newTarget */) {
    aConstructor(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aConstructor(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0:
          return new Target();
        case 1:
          return new Target(args[0]);
        case 2:
          return new Target(args[0], args[1]);
        case 3:
          return new Target(args[0], args[1], args[2]);
        case 4:
          return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      apply(push, $args, args);
      return new (apply(bind, Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : ObjectPrototype);
    var result = apply(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"../internals/a-constructor":4,"../internals/an-object":11,"../internals/export":97,"../internals/fails":98,"../internals/function-apply":102,"../internals/function-bind":105,"../internals/get-built-in":113,"../internals/is-object":144,"../internals/object-create":177}],418:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var anObject = require('../internals/an-object');
var toPropertyKey = require('../internals/to-property-key');
var definePropertyModule = require('../internals/object-define-property');
var fails = require('../internals/fails');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
var ERROR_INSTEAD_OF_FALSE = fails(function () {
  // eslint-disable-next-line es/no-reflect -- required for testing
  Reflect.defineProperty(definePropertyModule.f({}, 1, {
    value: 1
  }), 1, {
    value: 2
  });
});

// `Reflect.defineProperty` method
// https://tc39.es/ecma262/#sec-reflect.defineproperty
$({
  target: 'Reflect',
  stat: true,
  forced: ERROR_INSTEAD_OF_FALSE,
  sham: !DESCRIPTORS
}, {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    var key = toPropertyKey(propertyKey);
    anObject(attributes);
    try {
      definePropertyModule.f(target, key, attributes);
      return true;
    } catch (error) {
      return false;
    }
  }
});

},{"../internals/an-object":11,"../internals/descriptors":72,"../internals/export":97,"../internals/fails":98,"../internals/object-define-property":179,"../internals/to-property-key":259}],419:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var anObject = require('../internals/an-object');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;

// `Reflect.deleteProperty` method
// https://tc39.es/ecma262/#sec-reflect.deleteproperty
$({
  target: 'Reflect',
  stat: true
}, {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var descriptor = getOwnPropertyDescriptor(anObject(target), propertyKey);
    return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
  }
});

},{"../internals/an-object":11,"../internals/export":97,"../internals/object-get-own-property-descriptor":180}],420:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var anObject = require('../internals/an-object');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');

// `Reflect.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-reflect.getownpropertydescriptor
$({
  target: 'Reflect',
  stat: true,
  sham: !DESCRIPTORS
}, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return getOwnPropertyDescriptorModule.f(anObject(target), propertyKey);
  }
});

},{"../internals/an-object":11,"../internals/descriptors":72,"../internals/export":97,"../internals/object-get-own-property-descriptor":180}],421:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var anObject = require('../internals/an-object');
var objectGetPrototypeOf = require('../internals/object-get-prototype-of');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');

// `Reflect.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-reflect.getprototypeof
$({
  target: 'Reflect',
  stat: true,
  sham: !CORRECT_PROTOTYPE_GETTER
}, {
  getPrototypeOf: function getPrototypeOf(target) {
    return objectGetPrototypeOf(anObject(target));
  }
});

},{"../internals/an-object":11,"../internals/correct-prototype-getter":59,"../internals/export":97,"../internals/object-get-prototype-of":184}],422:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var call = require('../internals/function-call');
var isObject = require('../internals/is-object');
var anObject = require('../internals/an-object');
var isDataDescriptor = require('../internals/is-data-descriptor');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var getPrototypeOf = require('../internals/object-get-prototype-of');

// `Reflect.get` method
// https://tc39.es/ecma262/#sec-reflect.get
function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var descriptor, prototype;
  if (anObject(target) === receiver) return target[propertyKey];
  descriptor = getOwnPropertyDescriptorModule.f(target, propertyKey);
  if (descriptor) return isDataDescriptor(descriptor) ? descriptor.value : descriptor.get === undefined ? undefined : call(descriptor.get, receiver);
  if (isObject(prototype = getPrototypeOf(target))) return get(prototype, propertyKey, receiver);
}
$({
  target: 'Reflect',
  stat: true
}, {
  get: get
});

},{"../internals/an-object":11,"../internals/export":97,"../internals/function-call":106,"../internals/is-data-descriptor":140,"../internals/is-object":144,"../internals/object-get-own-property-descriptor":180,"../internals/object-get-prototype-of":184}],423:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');

// `Reflect.has` method
// https://tc39.es/ecma262/#sec-reflect.has
$({
  target: 'Reflect',
  stat: true
}, {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

},{"../internals/export":97}],424:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var anObject = require('../internals/an-object');
var $isExtensible = require('../internals/object-is-extensible');

// `Reflect.isExtensible` method
// https://tc39.es/ecma262/#sec-reflect.isextensible
$({
  target: 'Reflect',
  stat: true
}, {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible(target);
  }
});

},{"../internals/an-object":11,"../internals/export":97,"../internals/object-is-extensible":185}],425:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var ownKeys = require('../internals/own-keys');

// `Reflect.ownKeys` method
// https://tc39.es/ecma262/#sec-reflect.ownkeys
$({
  target: 'Reflect',
  stat: true
}, {
  ownKeys: ownKeys
});

},{"../internals/export":97,"../internals/own-keys":195}],426:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var anObject = require('../internals/an-object');
var FREEZING = require('../internals/freezing');

// `Reflect.preventExtensions` method
// https://tc39.es/ecma262/#sec-reflect.preventextensions
$({
  target: 'Reflect',
  stat: true,
  sham: !FREEZING
}, {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      var objectPreventExtensions = getBuiltIn('Object', 'preventExtensions');
      if (objectPreventExtensions) objectPreventExtensions(target);
      return true;
    } catch (error) {
      return false;
    }
  }
});

},{"../internals/an-object":11,"../internals/export":97,"../internals/freezing":101,"../internals/get-built-in":113}],427:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var anObject = require('../internals/an-object');
var aPossiblePrototype = require('../internals/a-possible-prototype');
var objectSetPrototypeOf = require('../internals/object-set-prototype-of');

// `Reflect.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-reflect.setprototypeof
if (objectSetPrototypeOf) $({
  target: 'Reflect',
  stat: true
}, {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    anObject(target);
    aPossiblePrototype(proto);
    try {
      objectSetPrototypeOf(target, proto);
      return true;
    } catch (error) {
      return false;
    }
  }
});

},{"../internals/a-possible-prototype":5,"../internals/an-object":11,"../internals/export":97,"../internals/object-set-prototype-of":191}],428:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var isDataDescriptor = require('../internals/is-data-descriptor');
var fails = require('../internals/fails');
var definePropertyModule = require('../internals/object-define-property');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

// `Reflect.set` method
// https://tc39.es/ecma262/#sec-reflect.set
function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDescriptor = getOwnPropertyDescriptorModule.f(anObject(target), propertyKey);
  var existingDescriptor, prototype, setter;
  if (!ownDescriptor) {
    if (isObject(prototype = getPrototypeOf(target))) {
      return set(prototype, propertyKey, V, receiver);
    }
    ownDescriptor = createPropertyDescriptor(0);
  }
  if (isDataDescriptor(ownDescriptor)) {
    if (ownDescriptor.writable === false || !isObject(receiver)) return false;
    if (existingDescriptor = getOwnPropertyDescriptorModule.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      definePropertyModule.f(receiver, propertyKey, existingDescriptor);
    } else definePropertyModule.f(receiver, propertyKey, createPropertyDescriptor(0, V));
  } else {
    setter = ownDescriptor.set;
    if (setter === undefined) return false;
    call(setter, receiver, V);
  }
  return true;
}

// MS Edge 17-18 Reflect.set allows setting the property to object
// with non-writable property on the prototype
var MS_EDGE_BUG = fails(function () {
  var Constructor = function Constructor() {/* empty */};
  var object = definePropertyModule.f(new Constructor(), 'a', {
    configurable: true
  });
  // eslint-disable-next-line es/no-reflect -- required for testing
  return Reflect.set(Constructor.prototype, 'a', 1, object) !== false;
});
$({
  target: 'Reflect',
  stat: true,
  forced: MS_EDGE_BUG
}, {
  set: set
});

},{"../internals/an-object":11,"../internals/create-property-descriptor":63,"../internals/export":97,"../internals/fails":98,"../internals/function-call":106,"../internals/is-data-descriptor":140,"../internals/is-object":144,"../internals/object-define-property":179,"../internals/object-get-own-property-descriptor":180,"../internals/object-get-prototype-of":184}],429:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var global = require('../internals/global');
var setToStringTag = require('../internals/set-to-string-tag');
$({
  global: true
}, {
  Reflect: {}
});

// Reflect[@@toStringTag] property
// https://tc39.es/ecma262/#sec-reflect-@@tostringtag
setToStringTag(global.Reflect, 'Reflect', true);

},{"../internals/export":97,"../internals/global":122,"../internals/set-to-string-tag":227}],430:[function(require,module,exports){
"use strict";

var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var isForced = require('../internals/is-forced');
var inheritIfRequired = require('../internals/inherit-if-required');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var isPrototypeOf = require('../internals/object-is-prototype-of');
var isRegExp = require('../internals/is-regexp');
var toString = require('../internals/to-string');
var getRegExpFlags = require('../internals/regexp-get-flags');
var stickyHelpers = require('../internals/regexp-sticky-helpers');
var proxyAccessor = require('../internals/proxy-accessor');
var defineBuiltIn = require('../internals/define-built-in');
var fails = require('../internals/fails');
var hasOwn = require('../internals/has-own-property');
var enforceInternalState = require('../internals/internal-state').enforce;
var setSpecies = require('../internals/set-species');
var wellKnownSymbol = require('../internals/well-known-symbol');
var UNSUPPORTED_DOT_ALL = require('../internals/regexp-unsupported-dot-all');
var UNSUPPORTED_NCG = require('../internals/regexp-unsupported-ncg');
var MATCH = wellKnownSymbol('match');
var NativeRegExp = global.RegExp;
var RegExpPrototype = NativeRegExp.prototype;
var SyntaxError = global.SyntaxError;
var exec = uncurryThis(RegExpPrototype.exec);
var charAt = uncurryThis(''.charAt);
var replace = uncurryThis(''.replace);
var stringIndexOf = uncurryThis(''.indexOf);
var stringSlice = uncurryThis(''.slice);
// TODO: Use only proper RegExpIdentifierName
var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
var re1 = /a/g;
var re2 = /a/g;

// "new" should create a new object, old webkit bug
var CORRECT_NEW = new NativeRegExp(re1) !== re1;
var MISSED_STICKY = stickyHelpers.MISSED_STICKY;
var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
var BASE_FORCED = DESCRIPTORS && (!CORRECT_NEW || MISSED_STICKY || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG || fails(function () {
  re2[MATCH] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
}));
var handleDotAll = function handleDotAll(string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var brackets = false;
  var chr;
  for (; index <= length; index++) {
    chr = charAt(string, index);
    if (chr === '\\') {
      result += chr + charAt(string, ++index);
      continue;
    }
    if (!brackets && chr === '.') {
      result += '[\\s\\S]';
    } else {
      if (chr === '[') {
        brackets = true;
      } else if (chr === ']') {
        brackets = false;
      }
      result += chr;
    }
  }
  return result;
};
var handleNCG = function handleNCG(string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var named = [];
  var names = {};
  var brackets = false;
  var ncg = false;
  var groupid = 0;
  var groupname = '';
  var chr;
  for (; index <= length; index++) {
    chr = charAt(string, index);
    if (chr === '\\') {
      chr = chr + charAt(string, ++index);
    } else if (chr === ']') {
      brackets = false;
    } else if (!brackets) switch (true) {
      case chr === '[':
        brackets = true;
        break;
      case chr === '(':
        if (exec(IS_NCG, stringSlice(string, index + 1))) {
          index += 2;
          ncg = true;
        }
        result += chr;
        groupid++;
        continue;
      case chr === '>' && ncg:
        if (groupname === '' || hasOwn(names, groupname)) {
          throw new SyntaxError('Invalid capture group name');
        }
        names[groupname] = true;
        named[named.length] = [groupname, groupid];
        ncg = false;
        groupname = '';
        continue;
    }
    if (ncg) groupname += chr;else result += chr;
  }
  return [result, named];
};

// `RegExp` constructor
// https://tc39.es/ecma262/#sec-regexp-constructor
if (isForced('RegExp', BASE_FORCED)) {
  var RegExpWrapper = function RegExp(pattern, flags) {
    var thisIsRegExp = isPrototypeOf(RegExpPrototype, this);
    var patternIsRegExp = isRegExp(pattern);
    var flagsAreUndefined = flags === undefined;
    var groups = [];
    var rawPattern = pattern;
    var rawFlags, dotAll, sticky, handled, result, state;
    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
      return pattern;
    }
    if (patternIsRegExp || isPrototypeOf(RegExpPrototype, pattern)) {
      pattern = pattern.source;
      if (flagsAreUndefined) flags = getRegExpFlags(rawPattern);
    }
    pattern = pattern === undefined ? '' : toString(pattern);
    flags = flags === undefined ? '' : toString(flags);
    rawPattern = pattern;
    if (UNSUPPORTED_DOT_ALL && 'dotAll' in re1) {
      dotAll = !!flags && stringIndexOf(flags, 's') > -1;
      if (dotAll) flags = replace(flags, /s/g, '');
    }
    rawFlags = flags;
    if (MISSED_STICKY && 'sticky' in re1) {
      sticky = !!flags && stringIndexOf(flags, 'y') > -1;
      if (sticky && UNSUPPORTED_Y) flags = replace(flags, /y/g, '');
    }
    if (UNSUPPORTED_NCG) {
      handled = handleNCG(pattern);
      pattern = handled[0];
      groups = handled[1];
    }
    result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype, RegExpWrapper);
    if (dotAll || sticky || groups.length) {
      state = enforceInternalState(result);
      if (dotAll) {
        state.dotAll = true;
        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
      }
      if (sticky) state.sticky = true;
      if (groups.length) state.groups = groups;
    }
    if (pattern !== rawPattern) try {
      // fails in old engines, but we have no alternatives for unsupported regex syntax
      createNonEnumerableProperty(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
    } catch (error) {/* empty */}
    return result;
  };
  for (var keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index;) {
    proxyAccessor(RegExpWrapper, NativeRegExp, keys[index++]);
  }
  RegExpPrototype.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype;
  defineBuiltIn(global, 'RegExp', RegExpWrapper, {
    constructor: true
  });
}

// https://tc39.es/ecma262/#sec-get-regexp-@@species
setSpecies('RegExp');

},{"../internals/create-non-enumerable-property":62,"../internals/define-built-in":68,"../internals/descriptors":72,"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/global":122,"../internals/has-own-property":123,"../internals/inherit-if-required":130,"../internals/internal-state":134,"../internals/is-forced":141,"../internals/is-regexp":147,"../internals/object-get-own-property-names":182,"../internals/object-is-prototype-of":186,"../internals/proxy-accessor":203,"../internals/regexp-get-flags":208,"../internals/regexp-sticky-helpers":209,"../internals/regexp-unsupported-dot-all":210,"../internals/regexp-unsupported-ncg":211,"../internals/set-species":225,"../internals/to-string":261,"../internals/well-known-symbol":277}],431:[function(require,module,exports){
"use strict";

var DESCRIPTORS = require('../internals/descriptors');
var UNSUPPORTED_DOT_ALL = require('../internals/regexp-unsupported-dot-all');
var classof = require('../internals/classof-raw');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var getInternalState = require('../internals/internal-state').get;
var RegExpPrototype = RegExp.prototype;
var $TypeError = TypeError;

// `RegExp.prototype.dotAll` getter
// https://tc39.es/ecma262/#sec-get-regexp.prototype.dotall
if (DESCRIPTORS && UNSUPPORTED_DOT_ALL) {
  defineBuiltInAccessor(RegExpPrototype, 'dotAll', {
    configurable: true,
    get: function dotAll() {
      if (this === RegExpPrototype) return undefined;
      // We can't use InternalStateModule.getterFor because
      // we don't add metadata for regexps created by a literal.
      if (classof(this) === 'RegExp') {
        return !!getInternalState(this).dotAll;
      }
      throw $TypeError('Incompatible receiver, RegExp required');
    }
  });
}

},{"../internals/classof-raw":52,"../internals/define-built-in-accessor":67,"../internals/descriptors":72,"../internals/internal-state":134,"../internals/regexp-unsupported-dot-all":210}],432:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var exec = require('../internals/regexp-exec');

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({
  target: 'RegExp',
  proto: true,
  forced: /./.exec !== exec
}, {
  exec: exec
});

},{"../internals/export":97,"../internals/regexp-exec":206}],433:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var DESCRIPTORS = require('../internals/descriptors');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var regExpFlags = require('../internals/regexp-flags');
var fails = require('../internals/fails');

// babel-minify and Closure Compiler transpiles RegExp('.', 'd') -> /./d and it causes SyntaxError
var RegExp = global.RegExp;
var RegExpPrototype = RegExp.prototype;
var FORCED = DESCRIPTORS && fails(function () {
  var INDICES_SUPPORT = true;
  try {
    RegExp('.', 'd');
  } catch (error) {
    INDICES_SUPPORT = false;
  }
  var O = {};
  // modern V8 bug
  var calls = '';
  var expected = INDICES_SUPPORT ? 'dgimsy' : 'gimsy';
  var addGetter = function addGetter(key, chr) {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty(O, key, {
      get: function get() {
        calls += chr;
        return true;
      }
    });
  };
  var pairs = {
    dotAll: 's',
    global: 'g',
    ignoreCase: 'i',
    multiline: 'm',
    sticky: 'y'
  };
  if (INDICES_SUPPORT) pairs.hasIndices = 'd';
  for (var key in pairs) addGetter(key, pairs[key]);

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var result = Object.getOwnPropertyDescriptor(RegExpPrototype, 'flags').get.call(O);
  return result !== expected || calls !== expected;
});

// `RegExp.prototype.flags` getter
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
if (FORCED) defineBuiltInAccessor(RegExpPrototype, 'flags', {
  configurable: true,
  get: regExpFlags
});

},{"../internals/define-built-in-accessor":67,"../internals/descriptors":72,"../internals/fails":98,"../internals/global":122,"../internals/regexp-flags":207}],434:[function(require,module,exports){
"use strict";

var DESCRIPTORS = require('../internals/descriptors');
var MISSED_STICKY = require('../internals/regexp-sticky-helpers').MISSED_STICKY;
var classof = require('../internals/classof-raw');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var getInternalState = require('../internals/internal-state').get;
var RegExpPrototype = RegExp.prototype;
var $TypeError = TypeError;

// `RegExp.prototype.sticky` getter
// https://tc39.es/ecma262/#sec-get-regexp.prototype.sticky
if (DESCRIPTORS && MISSED_STICKY) {
  defineBuiltInAccessor(RegExpPrototype, 'sticky', {
    configurable: true,
    get: function sticky() {
      if (this === RegExpPrototype) return;
      // We can't use InternalStateModule.getterFor because
      // we don't add metadata for regexps created by a literal.
      if (classof(this) === 'RegExp') {
        return !!getInternalState(this).sticky;
      }
      throw $TypeError('Incompatible receiver, RegExp required');
    }
  });
}

},{"../internals/classof-raw":52,"../internals/define-built-in-accessor":67,"../internals/descriptors":72,"../internals/internal-state":134,"../internals/regexp-sticky-helpers":209}],435:[function(require,module,exports){
'use strict';

// TODO: Remove from `core-js@4` since it's moved to entry points
require('../modules/es.regexp.exec');
var $ = require('../internals/export');
var call = require('../internals/function-call');
var isCallable = require('../internals/is-callable');
var anObject = require('../internals/an-object');
var toString = require('../internals/to-string');
var DELEGATES_TO_EXEC = function () {
  var execCalled = false;
  var re = /[ac]/;
  re.exec = function () {
    execCalled = true;
    return /./.exec.apply(this, arguments);
  };
  return re.test('abc') === true && execCalled;
}();
var nativeTest = /./.test;

// `RegExp.prototype.test` method
// https://tc39.es/ecma262/#sec-regexp.prototype.test
$({
  target: 'RegExp',
  proto: true,
  forced: !DELEGATES_TO_EXEC
}, {
  test: function test(S) {
    var R = anObject(this);
    var string = toString(S);
    var exec = R.exec;
    if (!isCallable(exec)) return call(nativeTest, R, string);
    var result = call(exec, R, string);
    if (result === null) return false;
    anObject(result);
    return true;
  }
});

},{"../internals/an-object":11,"../internals/export":97,"../internals/function-call":106,"../internals/is-callable":138,"../internals/to-string":261,"../modules/es.regexp.exec":432}],436:[function(require,module,exports){
'use strict';

var PROPER_FUNCTION_NAME = require('../internals/function-name').PROPER;
var defineBuiltIn = require('../internals/define-built-in');
var anObject = require('../internals/an-object');
var $toString = require('../internals/to-string');
var fails = require('../internals/fails');
var getRegExpFlags = require('../internals/regexp-get-flags');
var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];
var NOT_GENERIC = fails(function () {
  return nativeToString.call({
    source: 'a',
    flags: 'b'
  }) != '/a/b';
});
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = PROPER_FUNCTION_NAME && nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  defineBuiltIn(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var pattern = $toString(R.source);
    var flags = $toString(getRegExpFlags(R));
    return '/' + pattern + '/' + flags;
  }, {
    unsafe: true
  });
}

},{"../internals/an-object":11,"../internals/define-built-in":68,"../internals/fails":98,"../internals/function-name":107,"../internals/regexp-get-flags":208,"../internals/to-string":261}],437:[function(require,module,exports){
'use strict';

var collection = require('../internals/collection');
var collectionStrong = require('../internals/collection-strong');

// `Set` constructor
// https://tc39.es/ecma262/#sec-set-objects
collection('Set', function (init) {
  return function Set() {
    return init(this, arguments.length ? arguments[0] : undefined);
  };
}, collectionStrong);

},{"../internals/collection":56,"../internals/collection-strong":54}],438:[function(require,module,exports){
"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
require('../modules/es.set.constructor');

},{"../modules/es.set.constructor":437}],439:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.anchor` method
// https://tc39.es/ecma262/#sec-string.prototype.anchor
$({
  target: 'String',
  proto: true,
  forced: forcedStringHTMLMethod('anchor')
}, {
  anchor: function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  }
});

},{"../internals/create-html":60,"../internals/export":97,"../internals/string-html-forced":233}],440:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toString = require('../internals/to-string');
var fails = require('../internals/fails');
var charAt = uncurryThis(''.charAt);
var FORCED = fails(function () {
  // eslint-disable-next-line es/no-array-string-prototype-at -- safe
  return '𠮷'.at(-2) !== "\uD842";
});

// `String.prototype.at` method
// https://github.com/tc39/proposal-relative-indexing-method
$({
  target: 'String',
  proto: true,
  forced: FORCED
}, {
  at: function at(index) {
    var S = toString(requireObjectCoercible(this));
    var len = S.length;
    var relativeIndex = toIntegerOrInfinity(index);
    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
    return k < 0 || k >= len ? undefined : charAt(S, k);
  }
});

},{"../internals/export":97,"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/require-object-coercible":212,"../internals/to-integer-or-infinity":253,"../internals/to-string":261}],441:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.big` method
// https://tc39.es/ecma262/#sec-string.prototype.big
$({
  target: 'String',
  proto: true,
  forced: forcedStringHTMLMethod('big')
}, {
  big: function big() {
    return createHTML(this, 'big', '', '');
  }
});

},{"../internals/create-html":60,"../internals/export":97,"../internals/string-html-forced":233}],442:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.blink` method
// https://tc39.es/ecma262/#sec-string.prototype.blink
$({
  target: 'String',
  proto: true,
  forced: forcedStringHTMLMethod('blink')
}, {
  blink: function blink() {
    return createHTML(this, 'blink', '', '');
  }
});

},{"../internals/create-html":60,"../internals/export":97,"../internals/string-html-forced":233}],443:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.bold` method
// https://tc39.es/ecma262/#sec-string.prototype.bold
$({
  target: 'String',
  proto: true,
  forced: forcedStringHTMLMethod('bold')
}, {
  bold: function bold() {
    return createHTML(this, 'b', '', '');
  }
});

},{"../internals/create-html":60,"../internals/export":97,"../internals/string-html-forced":233}],444:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var codeAt = require('../internals/string-multibyte').codeAt;

// `String.prototype.codePointAt` method
// https://tc39.es/ecma262/#sec-string.prototype.codepointat
$({
  target: 'String',
  proto: true
}, {
  codePointAt: function codePointAt(pos) {
    return codeAt(this, pos);
  }
});

},{"../internals/export":97,"../internals/string-multibyte":234}],445:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this-clause');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var notARegExp = require('../internals/not-a-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var correctIsRegExpLogic = require('../internals/correct-is-regexp-logic');
var IS_PURE = require('../internals/is-pure');

// eslint-disable-next-line es/no-string-prototype-endswith -- safe
var nativeEndsWith = uncurryThis(''.endsWith);
var slice = uncurryThis(''.slice);
var min = Math.min;
var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('endsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
  var descriptor = getOwnPropertyDescriptor(String.prototype, 'endsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.endsWith` method
// https://tc39.es/ecma262/#sec-string.prototype.endswith
$({
  target: 'String',
  proto: true,
  forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC
}, {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = toString(requireObjectCoercible(this));
    notARegExp(searchString);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = that.length;
    var end = endPosition === undefined ? len : min(toLength(endPosition), len);
    var search = toString(searchString);
    return nativeEndsWith ? nativeEndsWith(that, search, end) : slice(that, end - search.length, end) === search;
  }
});

},{"../internals/correct-is-regexp-logic":58,"../internals/export":97,"../internals/function-uncurry-this-clause":109,"../internals/is-pure":145,"../internals/not-a-regexp":172,"../internals/object-get-own-property-descriptor":180,"../internals/require-object-coercible":212,"../internals/to-length":254,"../internals/to-string":261}],446:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.fixed` method
// https://tc39.es/ecma262/#sec-string.prototype.fixed
$({
  target: 'String',
  proto: true,
  forced: forcedStringHTMLMethod('fixed')
}, {
  fixed: function fixed() {
    return createHTML(this, 'tt', '', '');
  }
});

},{"../internals/create-html":60,"../internals/export":97,"../internals/string-html-forced":233}],447:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.fontcolor` method
// https://tc39.es/ecma262/#sec-string.prototype.fontcolor
$({
  target: 'String',
  proto: true,
  forced: forcedStringHTMLMethod('fontcolor')
}, {
  fontcolor: function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  }
});

},{"../internals/create-html":60,"../internals/export":97,"../internals/string-html-forced":233}],448:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.fontsize` method
// https://tc39.es/ecma262/#sec-string.prototype.fontsize
$({
  target: 'String',
  proto: true,
  forced: forcedStringHTMLMethod('fontsize')
}, {
  fontsize: function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  }
});

},{"../internals/create-html":60,"../internals/export":97,"../internals/string-html-forced":233}],449:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var $RangeError = RangeError;
var fromCharCode = String.fromCharCode;
// eslint-disable-next-line es/no-string-fromcodepoint -- required for testing
var $fromCodePoint = String.fromCodePoint;
var join = uncurryThis([].join);

// length should be 1, old FF problem
var INCORRECT_LENGTH = !!$fromCodePoint && $fromCodePoint.length != 1;

// `String.fromCodePoint` method
// https://tc39.es/ecma262/#sec-string.fromcodepoint
$({
  target: 'String',
  stat: true,
  arity: 1,
  forced: INCORRECT_LENGTH
}, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  fromCodePoint: function fromCodePoint(x) {
    var elements = [];
    var length = arguments.length;
    var i = 0;
    var code;
    while (length > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw $RangeError(code + ' is not a valid code point');
      elements[i] = code < 0x10000 ? fromCharCode(code) : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00);
    }
    return join(elements, '');
  }
});

},{"../internals/export":97,"../internals/function-uncurry-this":110,"../internals/to-absolute-index":249}],450:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var notARegExp = require('../internals/not-a-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toString = require('../internals/to-string');
var correctIsRegExpLogic = require('../internals/correct-is-regexp-logic');
var stringIndexOf = uncurryThis(''.indexOf);

// `String.prototype.includes` method
// https://tc39.es/ecma262/#sec-string.prototype.includes
$({
  target: 'String',
  proto: true,
  forced: !correctIsRegExpLogic('includes')
}, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~stringIndexOf(toString(requireObjectCoercible(this)), toString(notARegExp(searchString)), arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/correct-is-regexp-logic":58,"../internals/export":97,"../internals/function-uncurry-this":110,"../internals/not-a-regexp":172,"../internals/require-object-coercible":212,"../internals/to-string":261}],451:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.italics` method
// https://tc39.es/ecma262/#sec-string.prototype.italics
$({
  target: 'String',
  proto: true,
  forced: forcedStringHTMLMethod('italics')
}, {
  italics: function italics() {
    return createHTML(this, 'i', '', '');
  }
});

},{"../internals/create-html":60,"../internals/export":97,"../internals/string-html-forced":233}],452:[function(require,module,exports){
'use strict';

var charAt = require('../internals/string-multibyte').charAt;
var toString = require('../internals/to-string');
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/iterator-define');
var createIterResultObject = require('../internals/create-iter-result-object');
var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return createIterResultObject(undefined, true);
  point = charAt(string, index);
  state.index += point.length;
  return createIterResultObject(point, false);
});

},{"../internals/create-iter-result-object":61,"../internals/internal-state":134,"../internals/iterator-define":154,"../internals/string-multibyte":234,"../internals/to-string":261}],453:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.link` method
// https://tc39.es/ecma262/#sec-string.prototype.link
$({
  target: 'String',
  proto: true,
  forced: forcedStringHTMLMethod('link')
}, {
  link: function link(url) {
    return createHTML(this, 'a', 'href', url);
  }
});

},{"../internals/create-html":60,"../internals/export":97,"../internals/string-html-forced":233}],454:[function(require,module,exports){
'use strict';

/* eslint-disable es/no-string-prototype-matchall -- safe */
var $ = require('../internals/export');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this-clause');
var createIteratorConstructor = require('../internals/iterator-create-constructor');
var createIterResultObject = require('../internals/create-iter-result-object');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var anObject = require('../internals/an-object');
var isNullOrUndefined = require('../internals/is-null-or-undefined');
var classof = require('../internals/classof-raw');
var isRegExp = require('../internals/is-regexp');
var getRegExpFlags = require('../internals/regexp-get-flags');
var getMethod = require('../internals/get-method');
var defineBuiltIn = require('../internals/define-built-in');
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var speciesConstructor = require('../internals/species-constructor');
var advanceStringIndex = require('../internals/advance-string-index');
var regExpExec = require('../internals/regexp-exec-abstract');
var InternalStateModule = require('../internals/internal-state');
var IS_PURE = require('../internals/is-pure');
var MATCH_ALL = wellKnownSymbol('matchAll');
var REGEXP_STRING = 'RegExp String';
var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(REGEXP_STRING_ITERATOR);
var RegExpPrototype = RegExp.prototype;
var $TypeError = TypeError;
var stringIndexOf = uncurryThis(''.indexOf);
var nativeMatchAll = uncurryThis(''.matchAll);
var WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails(function () {
  nativeMatchAll('a', /./);
});
var $RegExpStringIterator = createIteratorConstructor(function RegExpStringIterator(regexp, string, $global, fullUnicode) {
  setInternalState(this, {
    type: REGEXP_STRING_ITERATOR,
    regexp: regexp,
    string: string,
    global: $global,
    unicode: fullUnicode,
    done: false
  });
}, REGEXP_STRING, function next() {
  var state = getInternalState(this);
  if (state.done) return createIterResultObject(undefined, true);
  var R = state.regexp;
  var S = state.string;
  var match = regExpExec(R, S);
  if (match === null) {
    state.done = true;
    return createIterResultObject(undefined, true);
  }
  if (state.global) {
    if (toString(match[0]) === '') R.lastIndex = advanceStringIndex(S, toLength(R.lastIndex), state.unicode);
    return createIterResultObject(match, false);
  }
  state.done = true;
  return createIterResultObject(match, false);
});
var $matchAll = function $matchAll(string) {
  var R = anObject(this);
  var S = toString(string);
  var C = speciesConstructor(R, RegExp);
  var flags = toString(getRegExpFlags(R));
  var matcher, $global, fullUnicode;
  matcher = new C(C === RegExp ? R.source : R, flags);
  $global = !!~stringIndexOf(flags, 'g');
  fullUnicode = !!~stringIndexOf(flags, 'u');
  matcher.lastIndex = toLength(R.lastIndex);
  return new $RegExpStringIterator(matcher, S, $global, fullUnicode);
};

// `String.prototype.matchAll` method
// https://tc39.es/ecma262/#sec-string.prototype.matchall
$({
  target: 'String',
  proto: true,
  forced: WORKS_WITH_NON_GLOBAL_REGEX
}, {
  matchAll: function matchAll(regexp) {
    var O = requireObjectCoercible(this);
    var flags, S, matcher, rx;
    if (!isNullOrUndefined(regexp)) {
      if (isRegExp(regexp)) {
        flags = toString(requireObjectCoercible(getRegExpFlags(regexp)));
        if (!~stringIndexOf(flags, 'g')) throw $TypeError('`.matchAll` does not allow non-global regexes');
      }
      if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll(O, regexp);
      matcher = getMethod(regexp, MATCH_ALL);
      if (matcher === undefined && IS_PURE && classof(regexp) == 'RegExp') matcher = $matchAll;
      if (matcher) return call(matcher, regexp, O);
    } else if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll(O, regexp);
    S = toString(O);
    rx = new RegExp(regexp, 'g');
    return IS_PURE ? call($matchAll, rx, S) : rx[MATCH_ALL](S);
  }
});
IS_PURE || MATCH_ALL in RegExpPrototype || defineBuiltIn(RegExpPrototype, MATCH_ALL, $matchAll);

},{"../internals/advance-string-index":9,"../internals/an-object":11,"../internals/classof-raw":52,"../internals/create-iter-result-object":61,"../internals/define-built-in":68,"../internals/export":97,"../internals/fails":98,"../internals/function-call":106,"../internals/function-uncurry-this-clause":109,"../internals/get-method":119,"../internals/internal-state":134,"../internals/is-null-or-undefined":143,"../internals/is-pure":145,"../internals/is-regexp":147,"../internals/iterator-create-constructor":152,"../internals/regexp-exec-abstract":205,"../internals/regexp-get-flags":208,"../internals/require-object-coercible":212,"../internals/species-constructor":232,"../internals/to-length":254,"../internals/to-string":261,"../internals/well-known-symbol":277}],455:[function(require,module,exports){
'use strict';

var call = require('../internals/function-call');
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var anObject = require('../internals/an-object');
var isNullOrUndefined = require('../internals/is-null-or-undefined');
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');
var getMethod = require('../internals/get-method');
var advanceStringIndex = require('../internals/advance-string-index');
var regExpExec = require('../internals/regexp-exec-abstract');

// @@match logic
fixRegExpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
  return [
  // `String.prototype.match` method
  // https://tc39.es/ecma262/#sec-string.prototype.match
  function match(regexp) {
    var O = requireObjectCoercible(this);
    var matcher = isNullOrUndefined(regexp) ? undefined : getMethod(regexp, MATCH);
    return matcher ? call(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString(O));
  },
  // `RegExp.prototype[@@match]` method
  // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
  function (string) {
    var rx = anObject(this);
    var S = toString(string);
    var res = maybeCallNative(nativeMatch, rx, S);
    if (res.done) return res.value;
    if (!rx.global) return regExpExec(rx, S);
    var fullUnicode = rx.unicode;
    rx.lastIndex = 0;
    var A = [];
    var n = 0;
    var result;
    while ((result = regExpExec(rx, S)) !== null) {
      var matchStr = toString(result[0]);
      A[n] = matchStr;
      if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      n++;
    }
    return n === 0 ? null : A;
  }];
});

},{"../internals/advance-string-index":9,"../internals/an-object":11,"../internals/fix-regexp-well-known-symbol-logic":99,"../internals/function-call":106,"../internals/get-method":119,"../internals/is-null-or-undefined":143,"../internals/regexp-exec-abstract":205,"../internals/require-object-coercible":212,"../internals/to-length":254,"../internals/to-string":261}],456:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $padEnd = require('../internals/string-pad').end;
var WEBKIT_BUG = require('../internals/string-pad-webkit-bug');

// `String.prototype.padEnd` method
// https://tc39.es/ecma262/#sec-string.prototype.padend
$({
  target: 'String',
  proto: true,
  forced: WEBKIT_BUG
}, {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":97,"../internals/string-pad":236,"../internals/string-pad-webkit-bug":235}],457:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $padStart = require('../internals/string-pad').start;
var WEBKIT_BUG = require('../internals/string-pad-webkit-bug');

// `String.prototype.padStart` method
// https://tc39.es/ecma262/#sec-string.prototype.padstart
$({
  target: 'String',
  proto: true,
  forced: WEBKIT_BUG
}, {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":97,"../internals/string-pad":236,"../internals/string-pad-webkit-bug":235}],458:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var toIndexedObject = require('../internals/to-indexed-object');
var toObject = require('../internals/to-object');
var toString = require('../internals/to-string');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var push = uncurryThis([].push);
var join = uncurryThis([].join);

// `String.raw` method
// https://tc39.es/ecma262/#sec-string.raw
$({
  target: 'String',
  stat: true
}, {
  raw: function raw(template) {
    var rawTemplate = toIndexedObject(toObject(template).raw);
    var literalSegments = lengthOfArrayLike(rawTemplate);
    if (!literalSegments) return '';
    var argumentsLength = arguments.length;
    var elements = [];
    var i = 0;
    while (true) {
      push(elements, toString(rawTemplate[i++]));
      if (i === literalSegments) return join(elements, '');
      if (i < argumentsLength) push(elements, toString(arguments[i]));
    }
  }
});

},{"../internals/export":97,"../internals/function-uncurry-this":110,"../internals/length-of-array-like":158,"../internals/to-indexed-object":252,"../internals/to-object":255,"../internals/to-string":261}],459:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var repeat = require('../internals/string-repeat');

// `String.prototype.repeat` method
// https://tc39.es/ecma262/#sec-string.prototype.repeat
$({
  target: 'String',
  proto: true
}, {
  repeat: repeat
});

},{"../internals/export":97,"../internals/string-repeat":238}],460:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var requireObjectCoercible = require('../internals/require-object-coercible');
var isCallable = require('../internals/is-callable');
var isNullOrUndefined = require('../internals/is-null-or-undefined');
var isRegExp = require('../internals/is-regexp');
var toString = require('../internals/to-string');
var getMethod = require('../internals/get-method');
var getRegExpFlags = require('../internals/regexp-get-flags');
var getSubstitution = require('../internals/get-substitution');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');
var REPLACE = wellKnownSymbol('replace');
var $TypeError = TypeError;
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
var max = Math.max;
var stringIndexOf = function stringIndexOf(string, searchValue, fromIndex) {
  if (fromIndex > string.length) return -1;
  if (searchValue === '') return fromIndex;
  return indexOf(string, searchValue, fromIndex);
};

// `String.prototype.replaceAll` method
// https://tc39.es/ecma262/#sec-string.prototype.replaceall
$({
  target: 'String',
  proto: true
}, {
  replaceAll: function replaceAll(searchValue, replaceValue) {
    var O = requireObjectCoercible(this);
    var IS_REG_EXP, flags, replacer, string, searchString, functionalReplace, searchLength, advanceBy, replacement;
    var position = 0;
    var endOfLastMatch = 0;
    var result = '';
    if (!isNullOrUndefined(searchValue)) {
      IS_REG_EXP = isRegExp(searchValue);
      if (IS_REG_EXP) {
        flags = toString(requireObjectCoercible(getRegExpFlags(searchValue)));
        if (!~indexOf(flags, 'g')) throw $TypeError('`.replaceAll` does not allow non-global regexes');
      }
      replacer = getMethod(searchValue, REPLACE);
      if (replacer) {
        return call(replacer, searchValue, O, replaceValue);
      } else if (IS_PURE && IS_REG_EXP) {
        return replace(toString(O), searchValue, replaceValue);
      }
    }
    string = toString(O);
    searchString = toString(searchValue);
    functionalReplace = isCallable(replaceValue);
    if (!functionalReplace) replaceValue = toString(replaceValue);
    searchLength = searchString.length;
    advanceBy = max(1, searchLength);
    position = stringIndexOf(string, searchString, 0);
    while (position !== -1) {
      replacement = functionalReplace ? toString(replaceValue(searchString, position, string)) : getSubstitution(searchString, string, position, [], undefined, replaceValue);
      result += stringSlice(string, endOfLastMatch, position) + replacement;
      endOfLastMatch = position + searchLength;
      position = stringIndexOf(string, searchString, position + advanceBy);
    }
    if (endOfLastMatch < string.length) {
      result += stringSlice(string, endOfLastMatch);
    }
    return result;
  }
});

},{"../internals/export":97,"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/get-method":119,"../internals/get-substitution":121,"../internals/is-callable":138,"../internals/is-null-or-undefined":143,"../internals/is-pure":145,"../internals/is-regexp":147,"../internals/regexp-get-flags":208,"../internals/require-object-coercible":212,"../internals/to-string":261,"../internals/well-known-symbol":277}],461:[function(require,module,exports){
'use strict';

var apply = require('../internals/function-apply');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var fails = require('../internals/fails');
var anObject = require('../internals/an-object');
var isCallable = require('../internals/is-callable');
var isNullOrUndefined = require('../internals/is-null-or-undefined');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');
var advanceStringIndex = require('../internals/advance-string-index');
var getMethod = require('../internals/get-method');
var getSubstitution = require('../internals/get-substitution');
var regExpExec = require('../internals/regexp-exec-abstract');
var wellKnownSymbol = require('../internals/well-known-symbol');
var REPLACE = wellKnownSymbol('replace');
var max = Math.max;
var min = Math.min;
var concat = uncurryThis([].concat);
var push = uncurryThis([].push);
var stringIndexOf = uncurryThis(''.indexOf);
var stringSlice = uncurryThis(''.slice);
var maybeToString = function maybeToString(it) {
  return it === undefined ? it : String(it);
};

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
}();

// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
}();
var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = {
      a: '7'
    };
    return result;
  };
  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
  return ''.replace(re, '$<a>') !== '7';
});

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';
  return [
  // `String.prototype.replace` method
  // https://tc39.es/ecma262/#sec-string.prototype.replace
  function replace(searchValue, replaceValue) {
    var O = requireObjectCoercible(this);
    var replacer = isNullOrUndefined(searchValue) ? undefined : getMethod(searchValue, REPLACE);
    return replacer ? call(replacer, searchValue, O, replaceValue) : call(nativeReplace, toString(O), searchValue, replaceValue);
  },
  // `RegExp.prototype[@@replace]` method
  // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
  function (string, replaceValue) {
    var rx = anObject(this);
    var S = toString(string);
    if (typeof replaceValue == 'string' && stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 && stringIndexOf(replaceValue, '$<') === -1) {
      var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
      if (res.done) return res.value;
    }
    var functionalReplace = isCallable(replaceValue);
    if (!functionalReplace) replaceValue = toString(replaceValue);
    var global = rx.global;
    if (global) {
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
    }
    var results = [];
    while (true) {
      var result = regExpExec(rx, S);
      if (result === null) break;
      push(results, result);
      if (!global) break;
      var matchStr = toString(result[0]);
      if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
    }
    var accumulatedResult = '';
    var nextSourcePosition = 0;
    for (var i = 0; i < results.length; i++) {
      result = results[i];
      var matched = toString(result[0]);
      var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
      var captures = [];
      // NOTE: This is equivalent to
      //   captures = result.slice(1).map(maybeToString)
      // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
      // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
      // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
      for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
      var namedCaptures = result.groups;
      if (functionalReplace) {
        var replacerArgs = concat([matched], captures, position, S);
        if (namedCaptures !== undefined) push(replacerArgs, namedCaptures);
        var replacement = toString(apply(replaceValue, undefined, replacerArgs));
      } else {
        replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
      }
      if (position >= nextSourcePosition) {
        accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
        nextSourcePosition = position + matched.length;
      }
    }
    return accumulatedResult + stringSlice(S, nextSourcePosition);
  }];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

},{"../internals/advance-string-index":9,"../internals/an-object":11,"../internals/fails":98,"../internals/fix-regexp-well-known-symbol-logic":99,"../internals/function-apply":102,"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/get-method":119,"../internals/get-substitution":121,"../internals/is-callable":138,"../internals/is-null-or-undefined":143,"../internals/regexp-exec-abstract":205,"../internals/require-object-coercible":212,"../internals/to-integer-or-infinity":253,"../internals/to-length":254,"../internals/to-string":261,"../internals/well-known-symbol":277}],462:[function(require,module,exports){
'use strict';

var call = require('../internals/function-call');
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var anObject = require('../internals/an-object');
var isNullOrUndefined = require('../internals/is-null-or-undefined');
var requireObjectCoercible = require('../internals/require-object-coercible');
var sameValue = require('../internals/same-value');
var toString = require('../internals/to-string');
var getMethod = require('../internals/get-method');
var regExpExec = require('../internals/regexp-exec-abstract');

// @@search logic
fixRegExpWellKnownSymbolLogic('search', function (SEARCH, nativeSearch, maybeCallNative) {
  return [
  // `String.prototype.search` method
  // https://tc39.es/ecma262/#sec-string.prototype.search
  function search(regexp) {
    var O = requireObjectCoercible(this);
    var searcher = isNullOrUndefined(regexp) ? undefined : getMethod(regexp, SEARCH);
    return searcher ? call(searcher, regexp, O) : new RegExp(regexp)[SEARCH](toString(O));
  },
  // `RegExp.prototype[@@search]` method
  // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
  function (string) {
    var rx = anObject(this);
    var S = toString(string);
    var res = maybeCallNative(nativeSearch, rx, S);
    if (res.done) return res.value;
    var previousLastIndex = rx.lastIndex;
    if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
    var result = regExpExec(rx, S);
    if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
    return result === null ? -1 : result.index;
  }];
});

},{"../internals/an-object":11,"../internals/fix-regexp-well-known-symbol-logic":99,"../internals/function-call":106,"../internals/get-method":119,"../internals/is-null-or-undefined":143,"../internals/regexp-exec-abstract":205,"../internals/require-object-coercible":212,"../internals/same-value":213,"../internals/to-string":261}],463:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.small` method
// https://tc39.es/ecma262/#sec-string.prototype.small
$({
  target: 'String',
  proto: true,
  forced: forcedStringHTMLMethod('small')
}, {
  small: function small() {
    return createHTML(this, 'small', '', '');
  }
});

},{"../internals/create-html":60,"../internals/export":97,"../internals/string-html-forced":233}],464:[function(require,module,exports){
'use strict';

var apply = require('../internals/function-apply');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var anObject = require('../internals/an-object');
var isNullOrUndefined = require('../internals/is-null-or-undefined');
var isRegExp = require('../internals/is-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var speciesConstructor = require('../internals/species-constructor');
var advanceStringIndex = require('../internals/advance-string-index');
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var getMethod = require('../internals/get-method');
var arraySlice = require('../internals/array-slice-simple');
var callRegExpExec = require('../internals/regexp-exec-abstract');
var regexpExec = require('../internals/regexp-exec');
var stickyHelpers = require('../internals/regexp-sticky-helpers');
var fails = require('../internals/fails');
var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
var MAX_UINT32 = 0xFFFFFFFF;
var min = Math.min;
var $push = [].push;
var exec = uncurryThis(/./.exec);
var push = uncurryThis($push);
var stringSlice = uncurryThis(''.slice);

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () {
    return originalExec.apply(this, arguments);
  };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

// @@split logic
fixRegExpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if ('abbc'.split(/(b)*/)[1] == 'c' ||
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  'test'.split(/(?:)/, -1).length != 4 || 'ab'.split(/(?:ab)*/).length != 2 || '.'.split(/(.?)(.?)/).length != 4 ||
  // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
  '.'.split(/()()/).length > 1 || ''.split(/.?/).length) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function internalSplit(separator, limit) {
      var string = toString(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) {
        return call(nativeSplit, string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = call(regexpExec, separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          push(output, stringSlice(string, lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) apply($push, output, arraySlice(match, 1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }

      if (lastLastIndex === string.length) {
        if (lastLength || !exec(separatorCopy, '')) push(output, '');
      } else push(output, stringSlice(string, lastLastIndex));
      return output.length > lim ? arraySlice(output, 0, lim) : output;
    };
    // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function internalSplit(separator, limit) {
      return separator === undefined && limit === 0 ? [] : call(nativeSplit, this, separator, limit);
    };
  } else internalSplit = nativeSplit;
  return [
  // `String.prototype.split` method
  // https://tc39.es/ecma262/#sec-string.prototype.split
  function split(separator, limit) {
    var O = requireObjectCoercible(this);
    var splitter = isNullOrUndefined(separator) ? undefined : getMethod(separator, SPLIT);
    return splitter ? call(splitter, separator, O, limit) : call(internalSplit, toString(O), separator, limit);
  },
  // `RegExp.prototype[@@split]` method
  // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
  //
  // NOTE: This cannot be properly polyfilled in engines that don't support
  // the 'y' flag.
  function (string, limit) {
    var rx = anObject(this);
    var S = toString(string);
    var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);
    if (res.done) return res.value;
    var C = speciesConstructor(rx, RegExp);
    var unicodeMatching = rx.unicode;
    var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (UNSUPPORTED_Y ? 'g' : 'y');

    // ^(? + rx + ) is needed, in combination with some S slicing, to
    // simulate the 'y' flag.
    var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
    var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
    if (lim === 0) return [];
    if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
    var p = 0;
    var q = 0;
    var A = [];
    while (q < S.length) {
      splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
      var z = callRegExpExec(splitter, UNSUPPORTED_Y ? stringSlice(S, q) : S);
      var e;
      if (z === null || (e = min(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p) {
        q = advanceStringIndex(S, q, unicodeMatching);
      } else {
        push(A, stringSlice(S, p, q));
        if (A.length === lim) return A;
        for (var i = 1; i <= z.length - 1; i++) {
          push(A, z[i]);
          if (A.length === lim) return A;
        }
        q = p = e;
      }
    }
    push(A, stringSlice(S, p));
    return A;
  }];
}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

},{"../internals/advance-string-index":9,"../internals/an-object":11,"../internals/array-slice-simple":35,"../internals/fails":98,"../internals/fix-regexp-well-known-symbol-logic":99,"../internals/function-apply":102,"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/get-method":119,"../internals/is-null-or-undefined":143,"../internals/is-regexp":147,"../internals/regexp-exec":206,"../internals/regexp-exec-abstract":205,"../internals/regexp-sticky-helpers":209,"../internals/require-object-coercible":212,"../internals/species-constructor":232,"../internals/to-length":254,"../internals/to-string":261}],465:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this-clause');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var notARegExp = require('../internals/not-a-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var correctIsRegExpLogic = require('../internals/correct-is-regexp-logic');
var IS_PURE = require('../internals/is-pure');

// eslint-disable-next-line es/no-string-prototype-startswith -- safe
var nativeStartsWith = uncurryThis(''.startsWith);
var stringSlice = uncurryThis(''.slice);
var min = Math.min;
var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
  var descriptor = getOwnPropertyDescriptor(String.prototype, 'startsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.startsWith` method
// https://tc39.es/ecma262/#sec-string.prototype.startswith
$({
  target: 'String',
  proto: true,
  forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC
}, {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = toString(requireObjectCoercible(this));
    notARegExp(searchString);
    var index = toLength(min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = toString(searchString);
    return nativeStartsWith ? nativeStartsWith(that, search, index) : stringSlice(that, index, index + search.length) === search;
  }
});

},{"../internals/correct-is-regexp-logic":58,"../internals/export":97,"../internals/function-uncurry-this-clause":109,"../internals/is-pure":145,"../internals/not-a-regexp":172,"../internals/object-get-own-property-descriptor":180,"../internals/require-object-coercible":212,"../internals/to-length":254,"../internals/to-string":261}],466:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.strike` method
// https://tc39.es/ecma262/#sec-string.prototype.strike
$({
  target: 'String',
  proto: true,
  forced: forcedStringHTMLMethod('strike')
}, {
  strike: function strike() {
    return createHTML(this, 'strike', '', '');
  }
});

},{"../internals/create-html":60,"../internals/export":97,"../internals/string-html-forced":233}],467:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.sub` method
// https://tc39.es/ecma262/#sec-string.prototype.sub
$({
  target: 'String',
  proto: true,
  forced: forcedStringHTMLMethod('sub')
}, {
  sub: function sub() {
    return createHTML(this, 'sub', '', '');
  }
});

},{"../internals/create-html":60,"../internals/export":97,"../internals/string-html-forced":233}],468:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toString = require('../internals/to-string');
var stringSlice = uncurryThis(''.slice);
var max = Math.max;
var min = Math.min;

// eslint-disable-next-line unicorn/prefer-string-slice -- required for testing
var FORCED = !''.substr || 'ab'.substr(-1) !== 'b';

// `String.prototype.substr` method
// https://tc39.es/ecma262/#sec-string.prototype.substr
$({
  target: 'String',
  proto: true,
  forced: FORCED
}, {
  substr: function substr(start, length) {
    var that = toString(requireObjectCoercible(this));
    var size = that.length;
    var intStart = toIntegerOrInfinity(start);
    var intLength, intEnd;
    if (intStart === Infinity) intStart = 0;
    if (intStart < 0) intStart = max(size + intStart, 0);
    intLength = length === undefined ? size : toIntegerOrInfinity(length);
    if (intLength <= 0 || intLength === Infinity) return '';
    intEnd = min(intStart + intLength, size);
    return intStart >= intEnd ? '' : stringSlice(that, intStart, intEnd);
  }
});

},{"../internals/export":97,"../internals/function-uncurry-this":110,"../internals/require-object-coercible":212,"../internals/to-integer-or-infinity":253,"../internals/to-string":261}],469:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.sup` method
// https://tc39.es/ecma262/#sec-string.prototype.sup
$({
  target: 'String',
  proto: true,
  forced: forcedStringHTMLMethod('sup')
}, {
  sup: function sup() {
    return createHTML(this, 'sup', '', '');
  }
});

},{"../internals/create-html":60,"../internals/export":97,"../internals/string-html-forced":233}],470:[function(require,module,exports){
"use strict";

// TODO: Remove this line from `core-js@4`
require('../modules/es.string.trim-right');
var $ = require('../internals/export');
var trimEnd = require('../internals/string-trim-end');

// `String.prototype.trimEnd` method
// https://tc39.es/ecma262/#sec-string.prototype.trimend
// eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
$({
  target: 'String',
  proto: true,
  name: 'trimEnd',
  forced: ''.trimEnd !== trimEnd
}, {
  trimEnd: trimEnd
});

},{"../internals/export":97,"../internals/string-trim-end":239,"../modules/es.string.trim-right":472}],471:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var trimStart = require('../internals/string-trim-start');

// `String.prototype.trimLeft` method
// https://tc39.es/ecma262/#sec-string.prototype.trimleft
// eslint-disable-next-line es/no-string-prototype-trimleft-trimright -- safe
$({
  target: 'String',
  proto: true,
  name: 'trimStart',
  forced: ''.trimLeft !== trimStart
}, {
  trimLeft: trimStart
});

},{"../internals/export":97,"../internals/string-trim-start":241}],472:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var trimEnd = require('../internals/string-trim-end');

// `String.prototype.trimRight` method
// https://tc39.es/ecma262/#sec-string.prototype.trimend
// eslint-disable-next-line es/no-string-prototype-trimleft-trimright -- safe
$({
  target: 'String',
  proto: true,
  name: 'trimEnd',
  forced: ''.trimRight !== trimEnd
}, {
  trimRight: trimEnd
});

},{"../internals/export":97,"../internals/string-trim-end":239}],473:[function(require,module,exports){
"use strict";

// TODO: Remove this line from `core-js@4`
require('../modules/es.string.trim-left');
var $ = require('../internals/export');
var trimStart = require('../internals/string-trim-start');

// `String.prototype.trimStart` method
// https://tc39.es/ecma262/#sec-string.prototype.trimstart
// eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
$({
  target: 'String',
  proto: true,
  name: 'trimStart',
  forced: ''.trimStart !== trimStart
}, {
  trimStart: trimStart
});

},{"../internals/export":97,"../internals/string-trim-start":241,"../modules/es.string.trim-left":471}],474:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $trim = require('../internals/string-trim').trim;
var forcedStringTrimMethod = require('../internals/string-trim-forced');

// `String.prototype.trim` method
// https://tc39.es/ecma262/#sec-string.prototype.trim
$({
  target: 'String',
  proto: true,
  forced: forcedStringTrimMethod('trim')
}, {
  trim: function trim() {
    return $trim(this);
  }
});

},{"../internals/export":97,"../internals/string-trim":242,"../internals/string-trim-forced":240}],475:[function(require,module,exports){
"use strict";

var defineWellKnownSymbol = require('../internals/well-known-symbol-define');

// `Symbol.asyncIterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');

},{"../internals/well-known-symbol-define":275}],476:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var global = require('../internals/global');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var IS_PURE = require('../internals/is-pure');
var DESCRIPTORS = require('../internals/descriptors');
var NATIVE_SYMBOL = require('../internals/symbol-constructor-detection');
var fails = require('../internals/fails');
var hasOwn = require('../internals/has-own-property');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var anObject = require('../internals/an-object');
var toIndexedObject = require('../internals/to-indexed-object');
var toPropertyKey = require('../internals/to-property-key');
var $toString = require('../internals/to-string');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var nativeObjectCreate = require('../internals/object-create');
var objectKeys = require('../internals/object-keys');
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertyNamesExternal = require('../internals/object-get-own-property-names-external');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');
var definePropertiesModule = require('../internals/object-define-properties');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var defineBuiltIn = require('../internals/define-built-in');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var shared = require('../internals/shared');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');
var uid = require('../internals/uid');
var wellKnownSymbol = require('../internals/well-known-symbol');
var wrappedWellKnownSymbolModule = require('../internals/well-known-symbol-wrapped');
var defineWellKnownSymbol = require('../internals/well-known-symbol-define');
var defineSymbolToPrimitive = require('../internals/symbol-define-to-primitive');
var setToStringTag = require('../internals/set-to-string-tag');
var InternalStateModule = require('../internals/internal-state');
var $forEach = require('../internals/array-iteration').forEach;
var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
var TypeError = global.TypeError;
var QObject = global.QObject;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var push = uncurryThis([].push);
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var WellKnownSymbolsStore = shared('wks');

// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function get() {
      return nativeDefineProperty(this, 'a', {
        value: 7
      }).a;
    }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;
var wrap = function wrap(tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};
var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPropertyKey(P);
  anObject(Attributes);
  if (hasOwn(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!hasOwn(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (hasOwn(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, {
        enumerable: createPropertyDescriptor(0, false)
      });
    }
    return setSymbolDescriptor(O, key, Attributes);
  }
  return nativeDefineProperty(O, key, Attributes);
};
var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || call($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};
var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};
var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPropertyKey(V);
  var enumerable = call(nativePropertyIsEnumerable, this, P);
  if (this === ObjectPrototype && hasOwn(AllSymbols, P) && !hasOwn(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !hasOwn(this, P) || !hasOwn(AllSymbols, P) || hasOwn(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype && hasOwn(AllSymbols, key) && !hasOwn(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && hasOwn(AllSymbols, key) && !(hasOwn(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};
var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!hasOwn(AllSymbols, key) && !hasOwn(hiddenKeys, key)) push(result, key);
  });
  return result;
};
var $getOwnPropertySymbols = function $getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (hasOwn(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn(ObjectPrototype, key))) {
      push(result, AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function _Symbol() {
    if (isPrototypeOf(SymbolPrototype, this)) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
    var tag = uid(description);
    var setter = function setter(value) {
      if (this === ObjectPrototype) call(setter, ObjectPrototypeSymbols, value);
      if (hasOwn(this, HIDDEN) && hasOwn(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, {
      configurable: true,
      set: setter
    });
    return wrap(tag, description);
  };
  SymbolPrototype = $Symbol[PROTOTYPE];
  defineBuiltIn(SymbolPrototype, 'toString', function toString() {
    return getInternalState(this).tag;
  });
  defineBuiltIn($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });
  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  definePropertiesModule.f = $defineProperties;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;
  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };
  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    defineBuiltInAccessor(SymbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      defineBuiltIn(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, {
        unsafe: true
      });
    }
  }
}
$({
  global: true,
  constructor: true,
  wrap: true,
  forced: !NATIVE_SYMBOL,
  sham: !NATIVE_SYMBOL
}, {
  Symbol: $Symbol
});
$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});
$({
  target: SYMBOL,
  stat: true,
  forced: !NATIVE_SYMBOL
}, {
  useSetter: function useSetter() {
    USE_SETTER = true;
  },
  useSimple: function useSimple() {
    USE_SETTER = false;
  }
});
$({
  target: 'Object',
  stat: true,
  forced: !NATIVE_SYMBOL,
  sham: !DESCRIPTORS
}, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});
$({
  target: 'Object',
  stat: true,
  forced: !NATIVE_SYMBOL
}, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
defineSymbolToPrimitive();

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);
hiddenKeys[HIDDEN] = true;

},{"../internals/an-object":11,"../internals/array-iteration":29,"../internals/create-property-descriptor":63,"../internals/define-built-in":68,"../internals/define-built-in-accessor":67,"../internals/descriptors":72,"../internals/export":97,"../internals/fails":98,"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/global":122,"../internals/has-own-property":123,"../internals/hidden-keys":124,"../internals/internal-state":134,"../internals/is-pure":145,"../internals/object-create":177,"../internals/object-define-properties":178,"../internals/object-define-property":179,"../internals/object-get-own-property-descriptor":180,"../internals/object-get-own-property-names":182,"../internals/object-get-own-property-names-external":181,"../internals/object-get-own-property-symbols":183,"../internals/object-is-prototype-of":186,"../internals/object-keys":188,"../internals/object-property-is-enumerable":189,"../internals/set-to-string-tag":227,"../internals/shared":231,"../internals/shared-key":229,"../internals/symbol-constructor-detection":244,"../internals/symbol-define-to-primitive":245,"../internals/to-indexed-object":252,"../internals/to-property-key":259,"../internals/to-string":261,"../internals/uid":269,"../internals/well-known-symbol":277,"../internals/well-known-symbol-define":275,"../internals/well-known-symbol-wrapped":276}],477:[function(require,module,exports){
// `Symbol.prototype.description` getter
// https://tc39.es/ecma262/#sec-symbol.prototype.description
'use strict';

var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var hasOwn = require('../internals/has-own-property');
var isCallable = require('../internals/is-callable');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var toString = require('../internals/to-string');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var NativeSymbol = global.Symbol;
var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;
if (DESCRIPTORS && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) ||
// Safari 12 bug
NativeSymbol().description !== undefined)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function _Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString(arguments[0]);
    var result = isPrototypeOf(SymbolPrototype, this) ? new NativeSymbol(description)
    // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
    : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  SymbolWrapper.prototype = SymbolPrototype;
  SymbolPrototype.constructor = SymbolWrapper;
  var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
  var thisSymbolValue = uncurryThis(SymbolPrototype.valueOf);
  var symbolDescriptiveString = uncurryThis(SymbolPrototype.toString);
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  var replace = uncurryThis(''.replace);
  var stringSlice = uncurryThis(''.slice);
  defineBuiltInAccessor(SymbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = thisSymbolValue(this);
      if (hasOwn(EmptyStringDescriptionStore, symbol)) return '';
      var string = symbolDescriptiveString(symbol);
      var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace(string, regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });
  $({
    global: true,
    constructor: true,
    forced: true
  }, {
    Symbol: SymbolWrapper
  });
}

},{"../internals/copy-constructor-properties":57,"../internals/define-built-in-accessor":67,"../internals/descriptors":72,"../internals/export":97,"../internals/function-uncurry-this":110,"../internals/global":122,"../internals/has-own-property":123,"../internals/is-callable":138,"../internals/object-is-prototype-of":186,"../internals/to-string":261}],478:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var hasOwn = require('../internals/has-own-property');
var toString = require('../internals/to-string');
var shared = require('../internals/shared');
var NATIVE_SYMBOL_REGISTRY = require('../internals/symbol-registry-detection');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.for` method
// https://tc39.es/ecma262/#sec-symbol.for
$({
  target: 'Symbol',
  stat: true,
  forced: !NATIVE_SYMBOL_REGISTRY
}, {
  'for': function _for(key) {
    var string = toString(key);
    if (hasOwn(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = getBuiltIn('Symbol')(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  }
});

},{"../internals/export":97,"../internals/get-built-in":113,"../internals/has-own-property":123,"../internals/shared":231,"../internals/symbol-registry-detection":246,"../internals/to-string":261}],479:[function(require,module,exports){
"use strict";

var defineWellKnownSymbol = require('../internals/well-known-symbol-define');

// `Symbol.hasInstance` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol('hasInstance');

},{"../internals/well-known-symbol-define":275}],480:[function(require,module,exports){
"use strict";

var defineWellKnownSymbol = require('../internals/well-known-symbol-define');

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol('isConcatSpreadable');

},{"../internals/well-known-symbol-define":275}],481:[function(require,module,exports){
"use strict";

var defineWellKnownSymbol = require('../internals/well-known-symbol-define');

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');

},{"../internals/well-known-symbol-define":275}],482:[function(require,module,exports){
"use strict";

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
require('../modules/es.symbol.constructor');
require('../modules/es.symbol.for');
require('../modules/es.symbol.key-for');
require('../modules/es.json.stringify');
require('../modules/es.object.get-own-property-symbols');

},{"../modules/es.json.stringify":341,"../modules/es.object.get-own-property-symbols":388,"../modules/es.symbol.constructor":476,"../modules/es.symbol.for":478,"../modules/es.symbol.key-for":483}],483:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var hasOwn = require('../internals/has-own-property');
var isSymbol = require('../internals/is-symbol');
var tryToString = require('../internals/try-to-string');
var shared = require('../internals/shared');
var NATIVE_SYMBOL_REGISTRY = require('../internals/symbol-registry-detection');
var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.keyFor` method
// https://tc39.es/ecma262/#sec-symbol.keyfor
$({
  target: 'Symbol',
  stat: true,
  forced: !NATIVE_SYMBOL_REGISTRY
}, {
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(tryToString(sym) + ' is not a symbol');
    if (hasOwn(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  }
});

},{"../internals/export":97,"../internals/has-own-property":123,"../internals/is-symbol":148,"../internals/shared":231,"../internals/symbol-registry-detection":246,"../internals/try-to-string":263}],484:[function(require,module,exports){
"use strict";

var defineWellKnownSymbol = require('../internals/well-known-symbol-define');

// `Symbol.matchAll` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.matchall
defineWellKnownSymbol('matchAll');

},{"../internals/well-known-symbol-define":275}],485:[function(require,module,exports){
"use strict";

var defineWellKnownSymbol = require('../internals/well-known-symbol-define');

// `Symbol.match` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.match
defineWellKnownSymbol('match');

},{"../internals/well-known-symbol-define":275}],486:[function(require,module,exports){
"use strict";

var defineWellKnownSymbol = require('../internals/well-known-symbol-define');

// `Symbol.replace` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.replace
defineWellKnownSymbol('replace');

},{"../internals/well-known-symbol-define":275}],487:[function(require,module,exports){
"use strict";

var defineWellKnownSymbol = require('../internals/well-known-symbol-define');

// `Symbol.search` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.search
defineWellKnownSymbol('search');

},{"../internals/well-known-symbol-define":275}],488:[function(require,module,exports){
"use strict";

var defineWellKnownSymbol = require('../internals/well-known-symbol-define');

// `Symbol.species` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.species
defineWellKnownSymbol('species');

},{"../internals/well-known-symbol-define":275}],489:[function(require,module,exports){
"use strict";

var defineWellKnownSymbol = require('../internals/well-known-symbol-define');

// `Symbol.split` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.split
defineWellKnownSymbol('split');

},{"../internals/well-known-symbol-define":275}],490:[function(require,module,exports){
"use strict";

var defineWellKnownSymbol = require('../internals/well-known-symbol-define');
var defineSymbolToPrimitive = require('../internals/symbol-define-to-primitive');

// `Symbol.toPrimitive` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol('toPrimitive');

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
defineSymbolToPrimitive();

},{"../internals/symbol-define-to-primitive":245,"../internals/well-known-symbol-define":275}],491:[function(require,module,exports){
"use strict";

var getBuiltIn = require('../internals/get-built-in');
var defineWellKnownSymbol = require('../internals/well-known-symbol-define');
var setToStringTag = require('../internals/set-to-string-tag');

// `Symbol.toStringTag` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag(getBuiltIn('Symbol'), 'Symbol');

},{"../internals/get-built-in":113,"../internals/set-to-string-tag":227,"../internals/well-known-symbol-define":275}],492:[function(require,module,exports){
"use strict";

var defineWellKnownSymbol = require('../internals/well-known-symbol-define');

// `Symbol.unscopables` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol('unscopables');

},{"../internals/well-known-symbol-define":275}],493:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.at` method
// https://github.com/tc39/proposal-relative-indexing-method
exportTypedArrayMethod('at', function at(index) {
  var O = aTypedArray(this);
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
  return k < 0 || k >= len ? undefined : O[k];
});

},{"../internals/array-buffer-view-core":17,"../internals/length-of-array-like":158,"../internals/to-integer-or-infinity":253}],494:[function(require,module,exports){
'use strict';

var uncurryThis = require('../internals/function-uncurry-this');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $ArrayCopyWithin = require('../internals/array-copy-within');
var u$ArrayCopyWithin = uncurryThis($ArrayCopyWithin);
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.copyWithin` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
exportTypedArrayMethod('copyWithin', function copyWithin(target, start /* , end */) {
  return u$ArrayCopyWithin(aTypedArray(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-copy-within":19,"../internals/function-uncurry-this":110}],495:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $every = require('../internals/array-iteration').every;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.every` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
exportTypedArrayMethod('every', function every(callbackfn /* , thisArg */) {
  return $every(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-iteration":29}],496:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $fill = require('../internals/array-fill');
var toBigInt = require('../internals/to-big-int');
var classof = require('../internals/classof');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var slice = uncurryThis(''.slice);

// V8 ~ Chrome < 59, Safari < 14.1, FF < 55, Edge <=18
var CONVERSION_BUG = fails(function () {
  var count = 0;
  // eslint-disable-next-line es/no-typed-arrays -- safe
  new Int8Array(2).fill({
    valueOf: function valueOf() {
      return count++;
    }
  });
  return count !== 1;
});

// `%TypedArray%.prototype.fill` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
exportTypedArrayMethod('fill', function fill(value /* , start, end */) {
  var length = arguments.length;
  aTypedArray(this);
  var actualValue = slice(classof(this), 0, 3) === 'Big' ? toBigInt(value) : +value;
  return call($fill, this, actualValue, length > 1 ? arguments[1] : undefined, length > 2 ? arguments[2] : undefined);
}, CONVERSION_BUG);

},{"../internals/array-buffer-view-core":17,"../internals/array-fill":20,"../internals/classof":53,"../internals/fails":98,"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/to-big-int":250}],497:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $filter = require('../internals/array-iteration').filter;
var fromSpeciesAndList = require('../internals/typed-array-from-species-and-list');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.filter` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
exportTypedArrayMethod('filter', function filter(callbackfn /* , thisArg */) {
  var list = $filter(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  return fromSpeciesAndList(this, list);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-iteration":29,"../internals/typed-array-from-species-and-list":266}],498:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $findIndex = require('../internals/array-iteration').findIndex;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
exportTypedArrayMethod('findIndex', function findIndex(predicate /* , thisArg */) {
  return $findIndex(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-iteration":29}],499:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $findLastIndex = require('../internals/array-iteration-from-last').findLastIndex;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLastIndex` method
// https://github.com/tc39/proposal-array-find-from-last
exportTypedArrayMethod('findLastIndex', function findLastIndex(predicate /* , thisArg */) {
  return $findLastIndex(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-iteration-from-last":28}],500:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $findLast = require('../internals/array-iteration-from-last').findLast;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLast` method
// https://github.com/tc39/proposal-array-find-from-last
exportTypedArrayMethod('findLast', function findLast(predicate /* , thisArg */) {
  return $findLast(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-iteration-from-last":28}],501:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $find = require('../internals/array-iteration').find;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.find` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
exportTypedArrayMethod('find', function find(predicate /* , thisArg */) {
  return $find(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-iteration":29}],502:[function(require,module,exports){
"use strict";

var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Float32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Float32', function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":264}],503:[function(require,module,exports){
"use strict";

var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Float64Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Float64', function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":264}],504:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $forEach = require('../internals/array-iteration').forEach;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.forEach` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
exportTypedArrayMethod('forEach', function forEach(callbackfn /* , thisArg */) {
  $forEach(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-iteration":29}],505:[function(require,module,exports){
'use strict';

var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-array-constructors-require-wrappers');
var exportTypedArrayStaticMethod = require('../internals/array-buffer-view-core').exportTypedArrayStaticMethod;
var typedArrayFrom = require('../internals/typed-array-from');

// `%TypedArray%.from` method
// https://tc39.es/ecma262/#sec-%typedarray%.from
exportTypedArrayStaticMethod('from', typedArrayFrom, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS);

},{"../internals/array-buffer-view-core":17,"../internals/typed-array-constructors-require-wrappers":265,"../internals/typed-array-from":267}],506:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $includes = require('../internals/array-includes').includes;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.includes` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
exportTypedArrayMethod('includes', function includes(searchElement /* , fromIndex */) {
  return $includes(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-includes":27}],507:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $indexOf = require('../internals/array-includes').indexOf;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
exportTypedArrayMethod('indexOf', function indexOf(searchElement /* , fromIndex */) {
  return $indexOf(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-includes":27}],508:[function(require,module,exports){
"use strict";

var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Int16Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Int16', function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":264}],509:[function(require,module,exports){
"use strict";

var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Int32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Int32', function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":264}],510:[function(require,module,exports){
"use strict";

var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Int8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Int8', function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":264}],511:[function(require,module,exports){
'use strict';

var global = require('../internals/global');
var fails = require('../internals/fails');
var uncurryThis = require('../internals/function-uncurry-this');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var ArrayIterators = require('../modules/es.array.iterator');
var wellKnownSymbol = require('../internals/well-known-symbol');
var ITERATOR = wellKnownSymbol('iterator');
var Uint8Array = global.Uint8Array;
var arrayValues = uncurryThis(ArrayIterators.values);
var arrayKeys = uncurryThis(ArrayIterators.keys);
var arrayEntries = uncurryThis(ArrayIterators.entries);
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var TypedArrayPrototype = Uint8Array && Uint8Array.prototype;
var GENERIC = !fails(function () {
  TypedArrayPrototype[ITERATOR].call([1]);
});
var ITERATOR_IS_VALUES = !!TypedArrayPrototype && TypedArrayPrototype.values && TypedArrayPrototype[ITERATOR] === TypedArrayPrototype.values && TypedArrayPrototype.values.name === 'values';
var typedArrayValues = function values() {
  return arrayValues(aTypedArray(this));
};

// `%TypedArray%.prototype.entries` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
exportTypedArrayMethod('entries', function entries() {
  return arrayEntries(aTypedArray(this));
}, GENERIC);
// `%TypedArray%.prototype.keys` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
exportTypedArrayMethod('keys', function keys() {
  return arrayKeys(aTypedArray(this));
}, GENERIC);
// `%TypedArray%.prototype.values` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
exportTypedArrayMethod('values', typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, {
  name: 'values'
});
// `%TypedArray%.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
exportTypedArrayMethod(ITERATOR, typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, {
  name: 'values'
});

},{"../internals/array-buffer-view-core":17,"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/global":122,"../internals/well-known-symbol":277,"../modules/es.array.iterator":303}],512:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var uncurryThis = require('../internals/function-uncurry-this');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $join = uncurryThis([].join);

// `%TypedArray%.prototype.join` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
exportTypedArrayMethod('join', function join(separator) {
  return $join(aTypedArray(this), separator);
});

},{"../internals/array-buffer-view-core":17,"../internals/function-uncurry-this":110}],513:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var apply = require('../internals/function-apply');
var $lastIndexOf = require('../internals/array-last-index-of');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.lastIndexOf` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
exportTypedArrayMethod('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
  var length = arguments.length;
  return apply($lastIndexOf, aTypedArray(this), length > 1 ? [searchElement, arguments[1]] : [searchElement]);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-last-index-of":30,"../internals/function-apply":102}],514:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $map = require('../internals/array-iteration').map;
var typedArraySpeciesConstructor = require('../internals/typed-array-species-constructor');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.map` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
exportTypedArrayMethod('map', function map(mapfn /* , thisArg */) {
  return $map(aTypedArray(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
    return new (typedArraySpeciesConstructor(O))(length);
  });
});

},{"../internals/array-buffer-view-core":17,"../internals/array-iteration":29,"../internals/typed-array-species-constructor":268}],515:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-array-constructors-require-wrappers');
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayStaticMethod = ArrayBufferViewCore.exportTypedArrayStaticMethod;

// `%TypedArray%.of` method
// https://tc39.es/ecma262/#sec-%typedarray%.of
exportTypedArrayStaticMethod('of', function of( /* ...items */
) {
  var index = 0;
  var length = arguments.length;
  var result = new (aTypedArrayConstructor(this))(length);
  while (length > index) result[index] = arguments[index++];
  return result;
}, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS);

},{"../internals/array-buffer-view-core":17,"../internals/typed-array-constructors-require-wrappers":265}],516:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $reduceRight = require('../internals/array-reduce').right;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduceRight` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
exportTypedArrayMethod('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
  var length = arguments.length;
  return $reduceRight(aTypedArray(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-reduce":33}],517:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $reduce = require('../internals/array-reduce').left;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduce` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
exportTypedArrayMethod('reduce', function reduce(callbackfn /* , initialValue */) {
  var length = arguments.length;
  return $reduce(aTypedArray(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-reduce":33}],518:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var floor = Math.floor;

// `%TypedArray%.prototype.reverse` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
exportTypedArrayMethod('reverse', function reverse() {
  var that = this;
  var length = aTypedArray(that).length;
  var middle = floor(length / 2);
  var index = 0;
  var value;
  while (index < middle) {
    value = that[index];
    that[index++] = that[--length];
    that[length] = value;
  }
  return that;
});

},{"../internals/array-buffer-view-core":17}],519:[function(require,module,exports){
'use strict';

var global = require('../internals/global');
var call = require('../internals/function-call');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var toOffset = require('../internals/to-offset');
var toIndexedObject = require('../internals/to-object');
var fails = require('../internals/fails');
var RangeError = global.RangeError;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS = !fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  var array = new Uint8ClampedArray(2);
  call($set, array, {
    length: 1,
    0: 3
  }, 1);
  return array[1] !== 3;
});

// https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS && ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS && fails(function () {
  var array = new Int8Array(2);
  array.set(1);
  array.set('2', 1);
  return array[0] !== 0 || array[1] !== 2;
});

// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod('set', function set(arrayLike /* , offset */) {
  aTypedArray(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var src = toIndexedObject(arrayLike);
  if (WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS) return call($set, this, src, offset);
  var length = this.length;
  var len = lengthOfArrayLike(src);
  var index = 0;
  if (len + offset > length) throw RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, !WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);

},{"../internals/array-buffer-view-core":17,"../internals/fails":98,"../internals/function-call":106,"../internals/global":122,"../internals/length-of-array-like":158,"../internals/to-object":255,"../internals/to-offset":256}],520:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var typedArraySpeciesConstructor = require('../internals/typed-array-species-constructor');
var fails = require('../internals/fails');
var arraySlice = require('../internals/array-slice');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var FORCED = fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  new Int8Array(1).slice();
});

// `%TypedArray%.prototype.slice` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
exportTypedArrayMethod('slice', function slice(start, end) {
  var list = arraySlice(aTypedArray(this), start, end);
  var C = typedArraySpeciesConstructor(this);
  var index = 0;
  var length = list.length;
  var result = new C(length);
  while (length > index) result[index] = list[index++];
  return result;
}, FORCED);

},{"../internals/array-buffer-view-core":17,"../internals/array-slice":36,"../internals/fails":98,"../internals/typed-array-species-constructor":268}],521:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $some = require('../internals/array-iteration').some;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.some` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
exportTypedArrayMethod('some', function some(callbackfn /* , thisArg */) {
  return $some(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":17,"../internals/array-iteration":29}],522:[function(require,module,exports){
'use strict';

var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this-clause');
var fails = require('../internals/fails');
var aCallable = require('../internals/a-callable');
var internalSort = require('../internals/array-sort');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var FF = require('../internals/engine-ff-version');
var IE_OR_EDGE = require('../internals/engine-is-ie-or-edge');
var V8 = require('../internals/engine-v8-version');
var WEBKIT = require('../internals/engine-webkit-version');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var Uint16Array = global.Uint16Array;
var nativeSort = Uint16Array && uncurryThis(Uint16Array.prototype.sort);

// WebKit
var ACCEPT_INCORRECT_ARGUMENTS = !!nativeSort && !(fails(function () {
  nativeSort(new Uint16Array(2), null);
}) && fails(function () {
  nativeSort(new Uint16Array(2), {});
}));
var STABLE_SORT = !!nativeSort && !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (V8) return V8 < 74;
  if (FF) return FF < 67;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 602;
  var array = new Uint16Array(516);
  var expected = Array(516);
  var index, mod;
  for (index = 0; index < 516; index++) {
    mod = index % 4;
    array[index] = 515 - index;
    expected[index] = index - 2 * mod + 3;
  }
  nativeSort(array, function (a, b) {
    return (a / 4 | 0) - (b / 4 | 0);
  });
  for (index = 0; index < 516; index++) {
    if (array[index] !== expected[index]) return true;
  }
});
var getSortCompare = function getSortCompare(comparefn) {
  return function (x, y) {
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (y !== y) return -1;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (x !== x) return 1;
    if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
    return x > y;
  };
};

// `%TypedArray%.prototype.sort` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod('sort', function sort(comparefn) {
  if (comparefn !== undefined) aCallable(comparefn);
  if (STABLE_SORT) return nativeSort(this, comparefn);
  return internalSort(aTypedArray(this), getSortCompare(comparefn));
}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);

},{"../internals/a-callable":3,"../internals/array-buffer-view-core":17,"../internals/array-sort":37,"../internals/engine-ff-version":79,"../internals/engine-is-ie-or-edge":83,"../internals/engine-v8-version":89,"../internals/engine-webkit-version":90,"../internals/fails":98,"../internals/function-uncurry-this-clause":109,"../internals/global":122}],523:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var toLength = require('../internals/to-length');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var typedArraySpeciesConstructor = require('../internals/typed-array-species-constructor');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.subarray` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
exportTypedArrayMethod('subarray', function subarray(begin, end) {
  var O = aTypedArray(this);
  var length = O.length;
  var beginIndex = toAbsoluteIndex(begin, length);
  var C = typedArraySpeciesConstructor(O);
  return new C(O.buffer, O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT, toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex));
});

},{"../internals/array-buffer-view-core":17,"../internals/to-absolute-index":249,"../internals/to-length":254,"../internals/typed-array-species-constructor":268}],524:[function(require,module,exports){
'use strict';

var global = require('../internals/global');
var apply = require('../internals/function-apply');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var fails = require('../internals/fails');
var arraySlice = require('../internals/array-slice');
var Int8Array = global.Int8Array;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $toLocaleString = [].toLocaleString;

// iOS Safari 6.x fails here
var TO_LOCALE_STRING_BUG = !!Int8Array && fails(function () {
  $toLocaleString.call(new Int8Array(1));
});
var FORCED = fails(function () {
  return [1, 2].toLocaleString() != new Int8Array([1, 2]).toLocaleString();
}) || !fails(function () {
  Int8Array.prototype.toLocaleString.call([1, 2]);
});

// `%TypedArray%.prototype.toLocaleString` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
exportTypedArrayMethod('toLocaleString', function toLocaleString() {
  return apply($toLocaleString, TO_LOCALE_STRING_BUG ? arraySlice(aTypedArray(this)) : aTypedArray(this), arraySlice(arguments));
}, FORCED);

},{"../internals/array-buffer-view-core":17,"../internals/array-slice":36,"../internals/fails":98,"../internals/function-apply":102,"../internals/global":122}],525:[function(require,module,exports){
'use strict';

var arrayToReversed = require('../internals/array-to-reversed');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;

// `%TypedArray%.prototype.toReversed` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
exportTypedArrayMethod('toReversed', function toReversed() {
  return arrayToReversed(aTypedArray(this), getTypedArrayConstructor(this));
});

},{"../internals/array-buffer-view-core":17,"../internals/array-to-reversed":40}],526:[function(require,module,exports){
'use strict';

var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var uncurryThis = require('../internals/function-uncurry-this');
var aCallable = require('../internals/a-callable');
var arrayFromConstructorAndList = require('../internals/array-from-constructor-and-list');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var sort = uncurryThis(ArrayBufferViewCore.TypedArrayPrototype.sort);

// `%TypedArray%.prototype.toSorted` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSorted
exportTypedArrayMethod('toSorted', function toSorted(compareFn) {
  if (compareFn !== undefined) aCallable(compareFn);
  var O = aTypedArray(this);
  var A = arrayFromConstructorAndList(getTypedArrayConstructor(O), O);
  return sort(A, compareFn);
});

},{"../internals/a-callable":3,"../internals/array-buffer-view-core":17,"../internals/array-from-constructor-and-list":23,"../internals/function-uncurry-this":110}],527:[function(require,module,exports){
'use strict';

var exportTypedArrayMethod = require('../internals/array-buffer-view-core').exportTypedArrayMethod;
var fails = require('../internals/fails');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var Uint8Array = global.Uint8Array;
var Uint8ArrayPrototype = Uint8Array && Uint8Array.prototype || {};
var arrayToString = [].toString;
var join = uncurryThis([].join);
if (fails(function () {
  arrayToString.call({});
})) {
  arrayToString = function toString() {
    return join(this);
  };
}
var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

// `%TypedArray%.prototype.toString` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
exportTypedArrayMethod('toString', arrayToString, IS_NOT_ARRAY_METHOD);

},{"../internals/array-buffer-view-core":17,"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/global":122}],528:[function(require,module,exports){
"use strict";

var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint16Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint16', function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":264}],529:[function(require,module,exports){
"use strict";

var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint32', function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":264}],530:[function(require,module,exports){
"use strict";

var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint8', function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":264}],531:[function(require,module,exports){
"use strict";

var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint8ClampedArray` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint8', function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

},{"../internals/typed-array-constructor":264}],532:[function(require,module,exports){
'use strict';

var arrayWith = require('../internals/array-with');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var isBigIntArray = require('../internals/is-big-int-array');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toBigInt = require('../internals/to-big-int');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var PROPER_ORDER = !!function () {
  try {
    // eslint-disable-next-line no-throw-literal, es/no-typed-arrays, es/no-array-prototype-with -- required for testing
    new Int8Array(1)['with'](2, {
      valueOf: function valueOf() {
        throw 8;
      }
    });
  } catch (error) {
    // some early implementations, like WebKit, does not follow the final semantic
    // https://github.com/tc39/proposal-change-array-by-copy/pull/86
    return error === 8;
  }
}();

// `%TypedArray%.prototype.with` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
exportTypedArrayMethod('with', {
  'with': function _with(index, value) {
    var O = aTypedArray(this);
    var relativeIndex = toIntegerOrInfinity(index);
    var actualValue = isBigIntArray(O) ? toBigInt(value) : +value;
    return arrayWith(O, getTypedArrayConstructor(O), relativeIndex, actualValue);
  }
}['with'], !PROPER_ORDER);

},{"../internals/array-buffer-view-core":17,"../internals/array-with":41,"../internals/is-big-int-array":137,"../internals/to-big-int":250,"../internals/to-integer-or-infinity":253}],533:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var toString = require('../internals/to-string');
var fromCharCode = String.fromCharCode;
var charAt = uncurryThis(''.charAt);
var exec = uncurryThis(/./.exec);
var stringSlice = uncurryThis(''.slice);
var hex2 = /^[\da-f]{2}$/i;
var hex4 = /^[\da-f]{4}$/i;

// `unescape` method
// https://tc39.es/ecma262/#sec-unescape-string
$({
  global: true
}, {
  unescape: function unescape(string) {
    var str = toString(string);
    var result = '';
    var length = str.length;
    var index = 0;
    var chr, part;
    while (index < length) {
      chr = charAt(str, index++);
      if (chr === '%') {
        if (charAt(str, index) === 'u') {
          part = stringSlice(str, index + 1, index + 5);
          if (exec(hex4, part)) {
            result += fromCharCode(parseInt(part, 16));
            index += 5;
            continue;
          }
        } else {
          part = stringSlice(str, index, index + 2);
          if (exec(hex2, part)) {
            result += fromCharCode(parseInt(part, 16));
            index += 2;
            continue;
          }
        }
      }
      result += chr;
    }
    return result;
  }
});

},{"../internals/export":97,"../internals/function-uncurry-this":110,"../internals/to-string":261}],534:[function(require,module,exports){
'use strict';

var FREEZING = require('../internals/freezing');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var defineBuiltIns = require('../internals/define-built-ins');
var InternalMetadataModule = require('../internals/internal-metadata');
var collection = require('../internals/collection');
var collectionWeak = require('../internals/collection-weak');
var isObject = require('../internals/is-object');
var enforceInternalState = require('../internals/internal-state').enforce;
var fails = require('../internals/fails');
var NATIVE_WEAK_MAP = require('../internals/weak-map-basic-detection');
var $Object = Object;
// eslint-disable-next-line es/no-array-isarray -- safe
var isArray = Array.isArray;
// eslint-disable-next-line es/no-object-isextensible -- safe
var isExtensible = $Object.isExtensible;
// eslint-disable-next-line es/no-object-isfrozen -- safe
var isFrozen = $Object.isFrozen;
// eslint-disable-next-line es/no-object-issealed -- safe
var isSealed = $Object.isSealed;
// eslint-disable-next-line es/no-object-freeze -- safe
var freeze = $Object.freeze;
// eslint-disable-next-line es/no-object-seal -- safe
var seal = $Object.seal;
var FROZEN = {};
var SEALED = {};
var IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global;
var InternalWeakMap;
var wrapper = function wrapper(init) {
  return function WeakMap() {
    return init(this, arguments.length ? arguments[0] : undefined);
  };
};

// `WeakMap` constructor
// https://tc39.es/ecma262/#sec-weakmap-constructor
var $WeakMap = collection('WeakMap', wrapper, collectionWeak);
var WeakMapPrototype = $WeakMap.prototype;
var nativeSet = uncurryThis(WeakMapPrototype.set);

// Chakra Edge bug: adding frozen arrays to WeakMap unfreeze them
var hasMSEdgeFreezingBug = function hasMSEdgeFreezingBug() {
  return FREEZING && fails(function () {
    var frozenArray = freeze([]);
    nativeSet(new $WeakMap(), frozenArray, 1);
    return !isFrozen(frozenArray);
  });
};

// IE11 WeakMap frozen keys fix
// We can't use feature detection because it crash some old IE builds
// https://github.com/zloirock/core-js/issues/485
if (NATIVE_WEAK_MAP) if (IS_IE11) {
  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
  InternalMetadataModule.enable();
  var nativeDelete = uncurryThis(WeakMapPrototype['delete']);
  var nativeHas = uncurryThis(WeakMapPrototype.has);
  var nativeGet = uncurryThis(WeakMapPrototype.get);
  defineBuiltIns(WeakMapPrototype, {
    'delete': function _delete(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeDelete(this, key) || state.frozen['delete'](key);
      }
      return nativeDelete(this, key);
    },
    has: function has(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas(this, key) || state.frozen.has(key);
      }
      return nativeHas(this, key);
    },
    get: function get(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas(this, key) ? nativeGet(this, key) : state.frozen.get(key);
      }
      return nativeGet(this, key);
    },
    set: function set(key, value) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        nativeHas(this, key) ? nativeSet(this, key, value) : state.frozen.set(key, value);
      } else nativeSet(this, key, value);
      return this;
    }
  });
  // Chakra Edge frozen keys fix
} else if (hasMSEdgeFreezingBug()) {
  defineBuiltIns(WeakMapPrototype, {
    set: function set(key, value) {
      var arrayIntegrityLevel;
      if (isArray(key)) {
        if (isFrozen(key)) arrayIntegrityLevel = FROZEN;else if (isSealed(key)) arrayIntegrityLevel = SEALED;
      }
      nativeSet(this, key, value);
      if (arrayIntegrityLevel == FROZEN) freeze(key);
      if (arrayIntegrityLevel == SEALED) seal(key);
      return this;
    }
  });
}

},{"../internals/collection":56,"../internals/collection-weak":55,"../internals/define-built-ins":69,"../internals/fails":98,"../internals/freezing":101,"../internals/function-uncurry-this":110,"../internals/global":122,"../internals/internal-metadata":133,"../internals/internal-state":134,"../internals/is-object":144,"../internals/weak-map-basic-detection":274}],535:[function(require,module,exports){
"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
require('../modules/es.weak-map.constructor');

},{"../modules/es.weak-map.constructor":534}],536:[function(require,module,exports){
'use strict';

var collection = require('../internals/collection');
var collectionWeak = require('../internals/collection-weak');

// `WeakSet` constructor
// https://tc39.es/ecma262/#sec-weakset-constructor
collection('WeakSet', function (init) {
  return function WeakSet() {
    return init(this, arguments.length ? arguments[0] : undefined);
  };
}, collectionWeak);

},{"../internals/collection":56,"../internals/collection-weak":55}],537:[function(require,module,exports){
"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
require('../modules/es.weak-set.constructor');

},{"../modules/es.weak-set.constructor":536}],538:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.aggregate-error');

},{"../modules/es.aggregate-error":282}],539:[function(require,module,exports){
'use strict';

var DESCRIPTORS = require('../internals/descriptors');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var isDetached = require('../internals/array-buffer-is-detached');
var ArrayBufferPrototype = ArrayBuffer.prototype;
if (DESCRIPTORS && !('detached' in ArrayBufferPrototype)) {
  defineBuiltInAccessor(ArrayBufferPrototype, 'detached', {
    configurable: true,
    get: function detached() {
      return isDetached(this);
    }
  });
}

},{"../internals/array-buffer-is-detached":14,"../internals/define-built-in-accessor":67,"../internals/descriptors":72}],540:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $transfer = require('../internals/array-buffer-transfer');

// `ArrayBuffer.prototype.transferToFixedLength` method
// https://tc39.es/proposal-arraybuffer-transfer/#sec-arraybuffer.prototype.transfertofixedlength
if ($transfer) $({
  target: 'ArrayBuffer',
  proto: true
}, {
  transferToFixedLength: function transferToFixedLength() {
    return $transfer(this, arguments.length ? arguments[0] : undefined, false);
  }
});

},{"../internals/array-buffer-transfer":16,"../internals/export":97}],541:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $transfer = require('../internals/array-buffer-transfer');

// `ArrayBuffer.prototype.transfer` method
// https://tc39.es/proposal-arraybuffer-transfer/#sec-arraybuffer.prototype.transfer
if ($transfer) $({
  target: 'ArrayBuffer',
  proto: true
}, {
  transfer: function transfer() {
    return $transfer(this, arguments.length ? arguments[0] : undefined, true);
  }
});

},{"../internals/array-buffer-transfer":16,"../internals/export":97}],542:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.array.at');

},{"../modules/es.array.at":286}],543:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.array.find-last-index');

},{"../modules/es.array.find-last-index":293}],544:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.array.find-last');

},{"../modules/es.array.find-last":294}],545:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var fromAsync = require('../internals/array-from-async');

// `Array.fromAsync` method
// https://github.com/tc39/proposal-array-from-async
$({
  target: 'Array',
  stat: true
}, {
  fromAsync: fromAsync
});

},{"../internals/array-from-async":22,"../internals/export":97}],546:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
var $ = require('../internals/export');
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var addToUnscopables = require('../internals/add-to-unscopables');
var $groupToMap = require('../internals/array-group-to-map');
var IS_PURE = require('../internals/is-pure');

// `Array.prototype.groupByToMap` method
// https://github.com/tc39/proposal-array-grouping
// https://bugs.webkit.org/show_bug.cgi?id=236541
$({
  target: 'Array',
  proto: true,
  name: 'groupToMap',
  forced: IS_PURE || !arrayMethodIsStrict('groupByToMap')
}, {
  groupByToMap: $groupToMap
});
addToUnscopables('groupByToMap');

},{"../internals/add-to-unscopables":8,"../internals/array-group-to-map":25,"../internals/array-method-is-strict":32,"../internals/export":97,"../internals/is-pure":145}],547:[function(require,module,exports){
'use strict';

// TODO: Remove from `core-js@4`
var $ = require('../internals/export');
var $group = require('../internals/array-group');
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.groupBy` method
// https://github.com/tc39/proposal-array-grouping
// https://bugs.webkit.org/show_bug.cgi?id=236541
$({
  target: 'Array',
  proto: true,
  forced: !arrayMethodIsStrict('groupBy')
}, {
  groupBy: function groupBy(callbackfn /* , thisArg */) {
    var thisArg = arguments.length > 1 ? arguments[1] : undefined;
    return $group(this, callbackfn, thisArg);
  }
});
addToUnscopables('groupBy');

},{"../internals/add-to-unscopables":8,"../internals/array-group":26,"../internals/array-method-is-strict":32,"../internals/export":97}],548:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var addToUnscopables = require('../internals/add-to-unscopables');
var $groupToMap = require('../internals/array-group-to-map');
var IS_PURE = require('../internals/is-pure');

// `Array.prototype.groupToMap` method
// https://github.com/tc39/proposal-array-grouping
$({
  target: 'Array',
  proto: true,
  forced: IS_PURE
}, {
  groupToMap: $groupToMap
});
addToUnscopables('groupToMap');

},{"../internals/add-to-unscopables":8,"../internals/array-group-to-map":25,"../internals/export":97,"../internals/is-pure":145}],549:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $group = require('../internals/array-group');
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.group` method
// https://github.com/tc39/proposal-array-grouping
$({
  target: 'Array',
  proto: true
}, {
  group: function group(callbackfn /* , thisArg */) {
    var thisArg = arguments.length > 1 ? arguments[1] : undefined;
    return $group(this, callbackfn, thisArg);
  }
});
addToUnscopables('group');

},{"../internals/add-to-unscopables":8,"../internals/array-group":26,"../internals/export":97}],550:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.array.to-reversed');

},{"../modules/es.array.to-reversed":317}],551:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.array.to-sorted');

},{"../modules/es.array.to-sorted":318}],552:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.array.to-spliced');

},{"../modules/es.array.to-spliced":319}],553:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.array.with');

},{"../modules/es.array.with":323}],554:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var anInstance = require('../internals/an-instance');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var hasOwn = require('../internals/has-own-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var AsyncIteratorPrototype = require('../internals/async-iterator-prototype');
var IS_PURE = require('../internals/is-pure');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var AsyncIteratorConstructor = function AsyncIterator() {
  anInstance(this, AsyncIteratorPrototype);
};
AsyncIteratorConstructor.prototype = AsyncIteratorPrototype;
if (!hasOwn(AsyncIteratorPrototype, TO_STRING_TAG)) {
  createNonEnumerableProperty(AsyncIteratorPrototype, TO_STRING_TAG, 'AsyncIterator');
}
if (IS_PURE || !hasOwn(AsyncIteratorPrototype, 'constructor') || AsyncIteratorPrototype.constructor === Object) {
  createNonEnumerableProperty(AsyncIteratorPrototype, 'constructor', AsyncIteratorConstructor);
}

// `AsyncIterator` constructor
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  global: true,
  constructor: true,
  forced: IS_PURE
}, {
  AsyncIterator: AsyncIteratorConstructor
});

},{"../internals/an-instance":10,"../internals/async-iterator-prototype":47,"../internals/create-non-enumerable-property":62,"../internals/export":97,"../internals/has-own-property":123,"../internals/is-pure":145,"../internals/well-known-symbol":277}],555:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var getIteratorDirect = require('../internals/get-iterator-direct');
var notANaN = require('../internals/not-a-nan');
var toPositiveInteger = require('../internals/to-positive-integer');
var createAsyncIteratorProxy = require('../internals/async-iterator-create-proxy');
var createIterResultObject = require('../internals/create-iter-result-object');
var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise) {
  var state = this;
  return new Promise(function (resolve, reject) {
    var doneAndReject = function doneAndReject(error) {
      state.done = true;
      reject(error);
    };
    var loop = function loop() {
      try {
        Promise.resolve(anObject(call(state.next, state.iterator))).then(function (step) {
          try {
            if (anObject(step).done) {
              state.done = true;
              resolve(createIterResultObject(undefined, true));
            } else if (state.remaining) {
              state.remaining--;
              loop();
            } else resolve(createIterResultObject(step.value, false));
          } catch (err) {
            doneAndReject(err);
          }
        }, doneAndReject);
      } catch (error) {
        doneAndReject(error);
      }
    };
    loop();
  });
});

// `AsyncIterator.prototype.drop` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  target: 'AsyncIterator',
  proto: true,
  real: true
}, {
  drop: function drop(limit) {
    return new AsyncIteratorProxy(getIteratorDirect(this), {
      remaining: toPositiveInteger(notANaN(+limit))
    });
  }
});

},{"../internals/an-object":11,"../internals/async-iterator-create-proxy":44,"../internals/create-iter-result-object":61,"../internals/export":97,"../internals/function-call":106,"../internals/get-iterator-direct":114,"../internals/not-a-nan":171,"../internals/to-positive-integer":257}],556:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $every = require('../internals/async-iterator-iteration').every;

// `AsyncIterator.prototype.every` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  target: 'AsyncIterator',
  proto: true,
  real: true
}, {
  every: function every(predicate) {
    return $every(this, predicate);
  }
});

},{"../internals/async-iterator-iteration":45,"../internals/export":97}],557:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var getIteratorDirect = require('../internals/get-iterator-direct');
var createAsyncIteratorProxy = require('../internals/async-iterator-create-proxy');
var createIterResultObject = require('../internals/create-iter-result-object');
var closeAsyncIteration = require('../internals/async-iterator-close');
var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise) {
  var state = this;
  var iterator = state.iterator;
  var predicate = state.predicate;
  return new Promise(function (resolve, reject) {
    var doneAndReject = function doneAndReject(error) {
      state.done = true;
      reject(error);
    };
    var ifAbruptCloseAsyncIterator = function ifAbruptCloseAsyncIterator(error) {
      closeAsyncIteration(iterator, doneAndReject, error, doneAndReject);
    };
    var loop = function loop() {
      try {
        Promise.resolve(anObject(call(state.next, iterator))).then(function (step) {
          try {
            if (anObject(step).done) {
              state.done = true;
              resolve(createIterResultObject(undefined, true));
            } else {
              var value = step.value;
              try {
                var result = predicate(value, state.counter++);
                var handler = function handler(selected) {
                  selected ? resolve(createIterResultObject(value, false)) : loop();
                };
                if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator);else handler(result);
              } catch (error3) {
                ifAbruptCloseAsyncIterator(error3);
              }
            }
          } catch (error2) {
            doneAndReject(error2);
          }
        }, doneAndReject);
      } catch (error) {
        doneAndReject(error);
      }
    };
    loop();
  });
});

// `AsyncIterator.prototype.filter` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  target: 'AsyncIterator',
  proto: true,
  real: true
}, {
  filter: function filter(predicate) {
    return new AsyncIteratorProxy(getIteratorDirect(this), {
      predicate: aCallable(predicate)
    });
  }
});

},{"../internals/a-callable":3,"../internals/an-object":11,"../internals/async-iterator-close":43,"../internals/async-iterator-create-proxy":44,"../internals/create-iter-result-object":61,"../internals/export":97,"../internals/function-call":106,"../internals/get-iterator-direct":114,"../internals/is-object":144}],558:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $find = require('../internals/async-iterator-iteration').find;

// `AsyncIterator.prototype.find` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  target: 'AsyncIterator',
  proto: true,
  real: true
}, {
  find: function find(predicate) {
    return $find(this, predicate);
  }
});

},{"../internals/async-iterator-iteration":45,"../internals/export":97}],559:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var getIteratorDirect = require('../internals/get-iterator-direct');
var createAsyncIteratorProxy = require('../internals/async-iterator-create-proxy');
var createIterResultObject = require('../internals/create-iter-result-object');
var getAsyncIteratorFlattenable = require('../internals/get-async-iterator-flattenable');
var closeAsyncIteration = require('../internals/async-iterator-close');
var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise) {
  var state = this;
  var iterator = state.iterator;
  var mapper = state.mapper;
  return new Promise(function (resolve, reject) {
    var doneAndReject = function doneAndReject(error) {
      state.done = true;
      reject(error);
    };
    var ifAbruptCloseAsyncIterator = function ifAbruptCloseAsyncIterator(error) {
      closeAsyncIteration(iterator, doneAndReject, error, doneAndReject);
    };
    var outerLoop = function outerLoop() {
      try {
        Promise.resolve(anObject(call(state.next, iterator))).then(function (step) {
          try {
            if (anObject(step).done) {
              state.done = true;
              resolve(createIterResultObject(undefined, true));
            } else {
              var value = step.value;
              try {
                var result = mapper(value, state.counter++);
                var handler = function handler(mapped) {
                  try {
                    state.inner = getAsyncIteratorFlattenable(mapped);
                    innerLoop();
                  } catch (error4) {
                    ifAbruptCloseAsyncIterator(error4);
                  }
                };
                if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator);else handler(result);
              } catch (error3) {
                ifAbruptCloseAsyncIterator(error3);
              }
            }
          } catch (error2) {
            doneAndReject(error2);
          }
        }, doneAndReject);
      } catch (error) {
        doneAndReject(error);
      }
    };
    var innerLoop = function innerLoop() {
      var inner = state.inner;
      if (inner) {
        try {
          Promise.resolve(anObject(call(inner.next, inner.iterator))).then(function (result) {
            try {
              if (anObject(result).done) {
                state.inner = null;
                outerLoop();
              } else resolve(createIterResultObject(result.value, false));
            } catch (error1) {
              ifAbruptCloseAsyncIterator(error1);
            }
          }, ifAbruptCloseAsyncIterator);
        } catch (error) {
          ifAbruptCloseAsyncIterator(error);
        }
      } else outerLoop();
    };
    innerLoop();
  });
});

// `AsyncIterator.prototype.flaMap` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  target: 'AsyncIterator',
  proto: true,
  real: true
}, {
  flatMap: function flatMap(mapper) {
    return new AsyncIteratorProxy(getIteratorDirect(this), {
      mapper: aCallable(mapper),
      inner: null
    });
  }
});

},{"../internals/a-callable":3,"../internals/an-object":11,"../internals/async-iterator-close":43,"../internals/async-iterator-create-proxy":44,"../internals/create-iter-result-object":61,"../internals/export":97,"../internals/function-call":106,"../internals/get-async-iterator-flattenable":111,"../internals/get-iterator-direct":114,"../internals/is-object":144}],560:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $forEach = require('../internals/async-iterator-iteration').forEach;

// `AsyncIterator.prototype.forEach` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  target: 'AsyncIterator',
  proto: true,
  real: true
}, {
  forEach: function forEach(fn) {
    return $forEach(this, fn);
  }
});

},{"../internals/async-iterator-iteration":45,"../internals/export":97}],561:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var toObject = require('../internals/to-object');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var getAsyncIteratorFlattenable = require('../internals/get-async-iterator-flattenable');
var AsyncIteratorPrototype = require('../internals/async-iterator-prototype');
var WrapAsyncIterator = require('../internals/async-iterator-wrap');

// `AsyncIterator.from` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  target: 'AsyncIterator',
  stat: true
}, {
  from: function from(O) {
    var iteratorRecord = getAsyncIteratorFlattenable(typeof O == 'string' ? toObject(O) : O);
    return isPrototypeOf(AsyncIteratorPrototype, iteratorRecord.iterator) ? iteratorRecord.iterator : new WrapAsyncIterator(iteratorRecord);
  }
});

},{"../internals/async-iterator-prototype":47,"../internals/async-iterator-wrap":48,"../internals/export":97,"../internals/get-async-iterator-flattenable":111,"../internals/object-is-prototype-of":186,"../internals/to-object":255}],562:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var map = require('../internals/async-iterator-map');

// `AsyncIterator.prototype.map` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  target: 'AsyncIterator',
  proto: true,
  real: true
}, {
  map: map
});

},{"../internals/async-iterator-map":46,"../internals/export":97}],563:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var getBuiltIn = require('../internals/get-built-in');
var getIteratorDirect = require('../internals/get-iterator-direct');
var closeAsyncIteration = require('../internals/async-iterator-close');
var Promise = getBuiltIn('Promise');
var $TypeError = TypeError;

// `AsyncIterator.prototype.reduce` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  target: 'AsyncIterator',
  proto: true,
  real: true
}, {
  reduce: function reduce(reducer /* , initialValue */) {
    var record = getIteratorDirect(this);
    var iterator = record.iterator;
    var next = record.next;
    var noInitial = arguments.length < 2;
    var accumulator = noInitial ? undefined : arguments[1];
    var counter = 0;
    aCallable(reducer);
    return new Promise(function (resolve, reject) {
      var ifAbruptCloseAsyncIterator = function ifAbruptCloseAsyncIterator(error) {
        closeAsyncIteration(iterator, reject, error, reject);
      };
      var loop = function loop() {
        try {
          Promise.resolve(anObject(call(next, iterator))).then(function (step) {
            try {
              if (anObject(step).done) {
                noInitial ? reject($TypeError('Reduce of empty iterator with no initial value')) : resolve(accumulator);
              } else {
                var value = step.value;
                if (noInitial) {
                  noInitial = false;
                  accumulator = value;
                  loop();
                } else try {
                  var result = reducer(accumulator, value, counter);
                  var handler = function handler($result) {
                    accumulator = $result;
                    loop();
                  };
                  if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator);else handler(result);
                } catch (error3) {
                  ifAbruptCloseAsyncIterator(error3);
                }
              }
              counter++;
            } catch (error2) {
              reject(error2);
            }
          }, reject);
        } catch (error) {
          reject(error);
        }
      };
      loop();
    });
  }
});

},{"../internals/a-callable":3,"../internals/an-object":11,"../internals/async-iterator-close":43,"../internals/export":97,"../internals/function-call":106,"../internals/get-built-in":113,"../internals/get-iterator-direct":114,"../internals/is-object":144}],564:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $some = require('../internals/async-iterator-iteration').some;

// `AsyncIterator.prototype.some` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  target: 'AsyncIterator',
  proto: true,
  real: true
}, {
  some: function some(predicate) {
    return $some(this, predicate);
  }
});

},{"../internals/async-iterator-iteration":45,"../internals/export":97}],565:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var getIteratorDirect = require('../internals/get-iterator-direct');
var notANaN = require('../internals/not-a-nan');
var toPositiveInteger = require('../internals/to-positive-integer');
var createAsyncIteratorProxy = require('../internals/async-iterator-create-proxy');
var createIterResultObject = require('../internals/create-iter-result-object');
var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise) {
  var state = this;
  var iterator = state.iterator;
  var returnMethod;
  if (!state.remaining--) {
    var resultDone = createIterResultObject(undefined, true);
    state.done = true;
    returnMethod = iterator['return'];
    if (returnMethod !== undefined) {
      return Promise.resolve(call(returnMethod, iterator, undefined)).then(function () {
        return resultDone;
      });
    }
    return resultDone;
  }
  return Promise.resolve(call(state.next, iterator)).then(function (step) {
    if (anObject(step).done) {
      state.done = true;
      return createIterResultObject(undefined, true);
    }
    return createIterResultObject(step.value, false);
  }).then(null, function (error) {
    state.done = true;
    throw error;
  });
});

// `AsyncIterator.prototype.take` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  target: 'AsyncIterator',
  proto: true,
  real: true
}, {
  take: function take(limit) {
    return new AsyncIteratorProxy(getIteratorDirect(this), {
      remaining: toPositiveInteger(notANaN(+limit))
    });
  }
});

},{"../internals/an-object":11,"../internals/async-iterator-create-proxy":44,"../internals/create-iter-result-object":61,"../internals/export":97,"../internals/function-call":106,"../internals/get-iterator-direct":114,"../internals/not-a-nan":171,"../internals/to-positive-integer":257}],566:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var $toArray = require('../internals/async-iterator-iteration').toArray;

// `AsyncIterator.prototype.toArray` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  target: 'AsyncIterator',
  proto: true,
  real: true
}, {
  toArray: function toArray() {
    return $toArray(this, undefined, []);
  }
});

},{"../internals/async-iterator-iteration":45,"../internals/export":97}],567:[function(require,module,exports){
'use strict';

// https://github.com/tc39/proposal-explicit-resource-management
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var getBuiltIn = require('../internals/get-built-in');
var aCallable = require('../internals/a-callable');
var anInstance = require('../internals/an-instance');
var defineBuiltIn = require('../internals/define-built-in');
var defineBuiltIns = require('../internals/define-built-ins');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var wellKnownSymbol = require('../internals/well-known-symbol');
var InternalStateModule = require('../internals/internal-state');
var addDisposableResource = require('../internals/add-disposable-resource');
var SuppressedError = getBuiltIn('SuppressedError');
var $ReferenceError = ReferenceError;
var DISPOSE = wellKnownSymbol('dispose');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var DISPOSABLE_STACK = 'DisposableStack';
var setInternalState = InternalStateModule.set;
var getDisposableStackInternalState = InternalStateModule.getterFor(DISPOSABLE_STACK);
var HINT = 'sync-dispose';
var DISPOSED = 'disposed';
var PENDING = 'pending';
var ALREADY_DISPOSED = DISPOSABLE_STACK + ' already disposed';
var $DisposableStack = function DisposableStack() {
  setInternalState(anInstance(this, DisposableStackPrototype), {
    type: DISPOSABLE_STACK,
    state: PENDING,
    stack: []
  });
  if (!DESCRIPTORS) this.disposed = false;
};
var DisposableStackPrototype = $DisposableStack.prototype;
defineBuiltIns(DisposableStackPrototype, {
  dispose: function dispose() {
    var internalState = getDisposableStackInternalState(this);
    if (internalState.state == DISPOSED) return;
    internalState.state = DISPOSED;
    if (!DESCRIPTORS) this.disposed = true;
    var stack = internalState.stack;
    var i = stack.length;
    var thrown = false;
    var suppressed;
    while (i) {
      var disposeMethod = stack[--i];
      stack[i] = null;
      try {
        disposeMethod();
      } catch (errorResult) {
        if (thrown) {
          suppressed = new SuppressedError(errorResult, suppressed);
        } else {
          thrown = true;
          suppressed = errorResult;
        }
      }
    }
    internalState.stack = null;
    if (thrown) throw suppressed;
  },
  use: function use(value) {
    var internalState = getDisposableStackInternalState(this);
    if (internalState.state == DISPOSED) throw $ReferenceError(ALREADY_DISPOSED);
    addDisposableResource(internalState, value, HINT);
    return value;
  },
  adopt: function adopt(value, onDispose) {
    var internalState = getDisposableStackInternalState(this);
    if (internalState.state == DISPOSED) throw $ReferenceError(ALREADY_DISPOSED);
    aCallable(onDispose);
    addDisposableResource(internalState, undefined, HINT, function () {
      onDispose(value);
    });
    return value;
  },
  defer: function defer(onDispose) {
    var internalState = getDisposableStackInternalState(this);
    if (internalState.state == DISPOSED) throw $ReferenceError(ALREADY_DISPOSED);
    aCallable(onDispose);
    addDisposableResource(internalState, undefined, HINT, onDispose);
  },
  move: function move() {
    var internalState = getDisposableStackInternalState(this);
    if (internalState.state == DISPOSED) throw $ReferenceError(ALREADY_DISPOSED);
    var newDisposableStack = new $DisposableStack();
    getDisposableStackInternalState(newDisposableStack).stack = internalState.stack;
    internalState.stack = [];
    return newDisposableStack;
  }
});
if (DESCRIPTORS) defineBuiltInAccessor(DisposableStackPrototype, 'disposed', {
  configurable: true,
  get: function disposed() {
    return getDisposableStackInternalState(this).state == DISPOSED;
  }
});
defineBuiltIn(DisposableStackPrototype, DISPOSE, DisposableStackPrototype.dispose, {
  name: 'dispose'
});
defineBuiltIn(DisposableStackPrototype, TO_STRING_TAG, DISPOSABLE_STACK, {
  nonWritable: true
});
$({
  global: true,
  constructor: true
}, {
  DisposableStack: $DisposableStack
});

},{"../internals/a-callable":3,"../internals/add-disposable-resource":7,"../internals/an-instance":10,"../internals/define-built-in":68,"../internals/define-built-in-accessor":67,"../internals/define-built-ins":69,"../internals/descriptors":72,"../internals/export":97,"../internals/get-built-in":113,"../internals/internal-state":134,"../internals/well-known-symbol":277}],568:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.global-this');

},{"../modules/es.global-this":340}],569:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var global = require('../internals/global');
var anInstance = require('../internals/an-instance');
var isCallable = require('../internals/is-callable');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var fails = require('../internals/fails');
var hasOwn = require('../internals/has-own-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype;
var IS_PURE = require('../internals/is-pure');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var NativeIterator = global.Iterator;

// FF56- have non-standard global helper `Iterator`
var FORCED = IS_PURE || !isCallable(NativeIterator) || NativeIterator.prototype !== IteratorPrototype
// FF44- non-standard `Iterator` passes previous tests
|| !fails(function () {
  NativeIterator({});
});
var IteratorConstructor = function Iterator() {
  anInstance(this, IteratorPrototype);
};
if (!hasOwn(IteratorPrototype, TO_STRING_TAG)) {
  createNonEnumerableProperty(IteratorPrototype, TO_STRING_TAG, 'Iterator');
}
if (FORCED || !hasOwn(IteratorPrototype, 'constructor') || IteratorPrototype.constructor === Object) {
  createNonEnumerableProperty(IteratorPrototype, 'constructor', IteratorConstructor);
}
IteratorConstructor.prototype = IteratorPrototype;

// `Iterator` constructor
// https://github.com/tc39/proposal-iterator-helpers
$({
  global: true,
  constructor: true,
  forced: FORCED
}, {
  Iterator: IteratorConstructor
});

},{"../internals/an-instance":10,"../internals/create-non-enumerable-property":62,"../internals/export":97,"../internals/fails":98,"../internals/global":122,"../internals/has-own-property":123,"../internals/is-callable":138,"../internals/is-pure":145,"../internals/iterators-core":156,"../internals/well-known-symbol":277}],570:[function(require,module,exports){
'use strict';

// https://github.com/tc39/proposal-explicit-resource-management
var call = require('../internals/function-call');
var defineBuiltIn = require('../internals/define-built-in');
var getMethod = require('../internals/get-method');
var hasOwn = require('../internals/has-own-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype;
var DISPOSE = wellKnownSymbol('dispose');
if (!hasOwn(IteratorPrototype, DISPOSE)) {
  defineBuiltIn(IteratorPrototype, DISPOSE, function () {
    var $return = getMethod(this, 'return');
    if ($return) call($return, this);
  });
}

},{"../internals/define-built-in":68,"../internals/function-call":106,"../internals/get-method":119,"../internals/has-own-property":123,"../internals/iterators-core":156,"../internals/well-known-symbol":277}],571:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var getIteratorDirect = require('../internals/get-iterator-direct');
var notANaN = require('../internals/not-a-nan');
var toPositiveInteger = require('../internals/to-positive-integer');
var createIteratorProxy = require('../internals/iterator-create-proxy');
var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var next = this.next;
  var result, done;
  while (this.remaining) {
    this.remaining--;
    result = anObject(call(next, iterator));
    done = this.done = !!result.done;
    if (done) return;
  }
  result = anObject(call(next, iterator));
  done = this.done = !!result.done;
  if (!done) return result.value;
});

// `Iterator.prototype.drop` method
// https://github.com/tc39/proposal-iterator-helpers
$({
  target: 'Iterator',
  proto: true,
  real: true
}, {
  drop: function drop(limit) {
    return new IteratorProxy(getIteratorDirect(this), {
      remaining: toPositiveInteger(notANaN(+limit))
    });
  }
});

},{"../internals/an-object":11,"../internals/export":97,"../internals/function-call":106,"../internals/get-iterator-direct":114,"../internals/iterator-create-proxy":153,"../internals/not-a-nan":171,"../internals/to-positive-integer":257}],572:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var iterate = require('../internals/iterate');
var aCallable = require('../internals/a-callable');
var getIteratorDirect = require('../internals/get-iterator-direct');

// `Iterator.prototype.every` method
// https://github.com/tc39/proposal-iterator-helpers
$({
  target: 'Iterator',
  proto: true,
  real: true
}, {
  every: function every(predicate) {
    var record = getIteratorDirect(this);
    var counter = 0;
    aCallable(predicate);
    return !iterate(record, function (value, stop) {
      if (!predicate(value, counter++)) return stop();
    }, {
      IS_RECORD: true,
      INTERRUPTED: true
    }).stopped;
  }
});

},{"../internals/a-callable":3,"../internals/export":97,"../internals/get-iterator-direct":114,"../internals/iterate":150}],573:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var getIteratorDirect = require('../internals/get-iterator-direct');
var createIteratorProxy = require('../internals/iterator-create-proxy');
var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');
var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var predicate = this.predicate;
  var next = this.next;
  var result, done, value;
  while (true) {
    result = anObject(call(next, iterator));
    done = this.done = !!result.done;
    if (done) return;
    value = result.value;
    if (callWithSafeIterationClosing(iterator, predicate, [value, this.counter++], true)) return value;
  }
});

// `Iterator.prototype.filter` method
// https://github.com/tc39/proposal-iterator-helpers
$({
  target: 'Iterator',
  proto: true,
  real: true
}, {
  filter: function filter(predicate) {
    return new IteratorProxy(getIteratorDirect(this), {
      predicate: aCallable(predicate)
    });
  }
});

},{"../internals/a-callable":3,"../internals/an-object":11,"../internals/call-with-safe-iteration-closing":50,"../internals/export":97,"../internals/function-call":106,"../internals/get-iterator-direct":114,"../internals/iterator-create-proxy":153}],574:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var iterate = require('../internals/iterate');
var aCallable = require('../internals/a-callable');
var getIteratorDirect = require('../internals/get-iterator-direct');

// `Iterator.prototype.find` method
// https://github.com/tc39/proposal-iterator-helpers
$({
  target: 'Iterator',
  proto: true,
  real: true
}, {
  find: function find(predicate) {
    var record = getIteratorDirect(this);
    var counter = 0;
    aCallable(predicate);
    return iterate(record, function (value, stop) {
      if (predicate(value, counter++)) return stop(value);
    }, {
      IS_RECORD: true,
      INTERRUPTED: true
    }).result;
  }
});

},{"../internals/a-callable":3,"../internals/export":97,"../internals/get-iterator-direct":114,"../internals/iterate":150}],575:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var getIteratorDirect = require('../internals/get-iterator-direct');
var getIteratorFlattenable = require('../internals/get-iterator-flattenable');
var createIteratorProxy = require('../internals/iterator-create-proxy');
var iteratorClose = require('../internals/iterator-close');
var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var mapper = this.mapper;
  var result, inner;
  while (true) {
    if (inner = this.inner) try {
      result = anObject(call(inner.next, inner.iterator));
      if (!result.done) return result.value;
      this.inner = null;
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    result = anObject(call(this.next, iterator));
    if (this.done = !!result.done) return;
    try {
      this.inner = getIteratorFlattenable(mapper(result.value, this.counter++));
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
  }
});

// `Iterator.prototype.flatMap` method
// https://github.com/tc39/proposal-iterator-helpers
$({
  target: 'Iterator',
  proto: true,
  real: true
}, {
  flatMap: function flatMap(mapper) {
    return new IteratorProxy(getIteratorDirect(this), {
      mapper: aCallable(mapper),
      inner: null
    });
  }
});

},{"../internals/a-callable":3,"../internals/an-object":11,"../internals/export":97,"../internals/function-call":106,"../internals/get-iterator-direct":114,"../internals/get-iterator-flattenable":115,"../internals/iterator-close":151,"../internals/iterator-create-proxy":153}],576:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var iterate = require('../internals/iterate');
var aCallable = require('../internals/a-callable');
var getIteratorDirect = require('../internals/get-iterator-direct');

// `Iterator.prototype.forEach` method
// https://github.com/tc39/proposal-iterator-helpers
$({
  target: 'Iterator',
  proto: true,
  real: true
}, {
  forEach: function forEach(fn) {
    var record = getIteratorDirect(this);
    var counter = 0;
    aCallable(fn);
    iterate(record, function (value) {
      fn(value, counter++);
    }, {
      IS_RECORD: true
    });
  }
});

},{"../internals/a-callable":3,"../internals/export":97,"../internals/get-iterator-direct":114,"../internals/iterate":150}],577:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var call = require('../internals/function-call');
var toObject = require('../internals/to-object');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype;
var createIteratorProxy = require('../internals/iterator-create-proxy');
var getIteratorFlattenable = require('../internals/get-iterator-flattenable');
var IteratorProxy = createIteratorProxy(function () {
  return call(this.next, this.iterator);
}, true);

// `Iterator.from` method
// https://github.com/tc39/proposal-iterator-helpers
$({
  target: 'Iterator',
  stat: true
}, {
  from: function from(O) {
    var iteratorRecord = getIteratorFlattenable(typeof O == 'string' ? toObject(O) : O);
    return isPrototypeOf(IteratorPrototype, iteratorRecord.iterator) ? iteratorRecord.iterator : new IteratorProxy(iteratorRecord);
  }
});

},{"../internals/export":97,"../internals/function-call":106,"../internals/get-iterator-flattenable":115,"../internals/iterator-create-proxy":153,"../internals/iterators-core":156,"../internals/object-is-prototype-of":186,"../internals/to-object":255}],578:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var map = require('../internals/iterator-map');

// `Iterator.prototype.map` method
// https://github.com/tc39/proposal-iterator-helpers
$({
  target: 'Iterator',
  proto: true,
  real: true
}, {
  map: map
});

},{"../internals/export":97,"../internals/iterator-map":155}],579:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var iterate = require('../internals/iterate');
var aCallable = require('../internals/a-callable');
var getIteratorDirect = require('../internals/get-iterator-direct');
var $TypeError = TypeError;

// `Iterator.prototype.reduce` method
// https://github.com/tc39/proposal-iterator-helpers
$({
  target: 'Iterator',
  proto: true,
  real: true
}, {
  reduce: function reduce(reducer /* , initialValue */) {
    var record = getIteratorDirect(this);
    aCallable(reducer);
    var noInitial = arguments.length < 2;
    var accumulator = noInitial ? undefined : arguments[1];
    var counter = 0;
    iterate(record, function (value) {
      if (noInitial) {
        noInitial = false;
        accumulator = value;
      } else {
        accumulator = reducer(accumulator, value, counter);
      }
      counter++;
    }, {
      IS_RECORD: true
    });
    if (noInitial) throw $TypeError('Reduce of empty iterator with no initial value');
    return accumulator;
  }
});

},{"../internals/a-callable":3,"../internals/export":97,"../internals/get-iterator-direct":114,"../internals/iterate":150}],580:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var iterate = require('../internals/iterate');
var aCallable = require('../internals/a-callable');
var getIteratorDirect = require('../internals/get-iterator-direct');

// `Iterator.prototype.some` method
// https://github.com/tc39/proposal-iterator-helpers
$({
  target: 'Iterator',
  proto: true,
  real: true
}, {
  some: function some(predicate) {
    var record = getIteratorDirect(this);
    var counter = 0;
    aCallable(predicate);
    return iterate(record, function (value, stop) {
      if (predicate(value, counter++)) return stop();
    }, {
      IS_RECORD: true,
      INTERRUPTED: true
    }).stopped;
  }
});

},{"../internals/a-callable":3,"../internals/export":97,"../internals/get-iterator-direct":114,"../internals/iterate":150}],581:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var getIteratorDirect = require('../internals/get-iterator-direct');
var notANaN = require('../internals/not-a-nan');
var toPositiveInteger = require('../internals/to-positive-integer');
var createIteratorProxy = require('../internals/iterator-create-proxy');
var iteratorClose = require('../internals/iterator-close');
var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  if (!this.remaining--) {
    this.done = true;
    return iteratorClose(iterator, 'normal', undefined);
  }
  var result = anObject(call(this.next, iterator));
  var done = this.done = !!result.done;
  if (!done) return result.value;
});

// `Iterator.prototype.take` method
// https://github.com/tc39/proposal-iterator-helpers
$({
  target: 'Iterator',
  proto: true,
  real: true
}, {
  take: function take(limit) {
    return new IteratorProxy(getIteratorDirect(this), {
      remaining: toPositiveInteger(notANaN(+limit))
    });
  }
});

},{"../internals/an-object":11,"../internals/export":97,"../internals/function-call":106,"../internals/get-iterator-direct":114,"../internals/iterator-close":151,"../internals/iterator-create-proxy":153,"../internals/not-a-nan":171,"../internals/to-positive-integer":257}],582:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var iterate = require('../internals/iterate');
var getIteratorDirect = require('../internals/get-iterator-direct');
var push = [].push;

// `Iterator.prototype.toArray` method
// https://github.com/tc39/proposal-iterator-helpers
$({
  target: 'Iterator',
  proto: true,
  real: true
}, {
  toArray: function toArray() {
    var result = [];
    iterate(getIteratorDirect(this), push, {
      that: result,
      IS_RECORD: true
    });
    return result;
  }
});

},{"../internals/export":97,"../internals/get-iterator-direct":114,"../internals/iterate":150}],583:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var AsyncFromSyncIterator = require('../internals/async-from-sync-iterator');
var WrapAsyncIterator = require('../internals/async-iterator-wrap');
var getIteratorDirect = require('../internals/get-iterator-direct');

// `Iterator.prototype.toAsync` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({
  target: 'Iterator',
  proto: true,
  real: true
}, {
  toAsync: function toAsync() {
    return new WrapAsyncIterator(getIteratorDirect(new AsyncFromSyncIterator(getIteratorDirect(this))));
  }
});

},{"../internals/async-from-sync-iterator":42,"../internals/async-iterator-wrap":48,"../internals/export":97,"../internals/get-iterator-direct":114}],584:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var NATIVE_RAW_JSON = require('../internals/native-raw-json');
var isRawJSON = require('../internals/is-raw-json');

// `JSON.parse` method
// https://tc39.es/proposal-json-parse-with-source/#sec-json.israwjson
// https://github.com/tc39/proposal-json-parse-with-source
$({
  target: 'JSON',
  stat: true,
  forced: !NATIVE_RAW_JSON
}, {
  isRawJSON: isRawJSON
});

},{"../internals/export":97,"../internals/is-raw-json":146,"../internals/native-raw-json":168}],585:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var uncurryThis = require('../internals/function-uncurry-this');
var call = require('../internals/function-call');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var isArray = require('../internals/is-array');
var hasOwn = require('../internals/has-own-property');
var toString = require('../internals/to-string');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var createProperty = require('../internals/create-property');
var fails = require('../internals/fails');
var parseJSONString = require('../internals/parse-json-string');
var NATIVE_SYMBOL = require('../internals/symbol-constructor-detection');
var JSON = global.JSON;
var Number = global.Number;
var SyntaxError = global.SyntaxError;
var nativeParse = JSON && JSON.parse;
var enumerableOwnProperties = getBuiltIn('Object', 'keys');
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var at = uncurryThis(''.charAt);
var slice = uncurryThis(''.slice);
var exec = uncurryThis(/./.exec);
var push = uncurryThis([].push);
var IS_DIGIT = /^\d$/;
var IS_NON_ZERO_DIGIT = /^[1-9]$/;
var IS_NUMBER_START = /^(-|\d)$/;
var IS_WHITESPACE = /^[\t\n\r ]$/;
var PRIMITIVE = 0;
var OBJECT = 1;
var $parse = function $parse(source, reviver) {
  source = toString(source);
  var context = new Context(source, 0, '');
  var root = context.parse();
  var value = root.value;
  var endIndex = context.skip(IS_WHITESPACE, root.end);
  if (endIndex < source.length) {
    throw SyntaxError('Unexpected extra character: "' + at(source, endIndex) + '" after the parsed data at: ' + endIndex);
  }
  return isCallable(reviver) ? internalize({
    '': value
  }, '', reviver, root) : value;
};
var internalize = function internalize(holder, name, reviver, node) {
  var val = holder[name];
  var unmodified = node && val === node.value;
  var context = unmodified && typeof node.source == 'string' ? {
    source: node.source
  } : {};
  var elementRecordsLen, keys, len, i, P;
  if (isObject(val)) {
    var nodeIsArray = isArray(val);
    var nodes = unmodified ? node.nodes : nodeIsArray ? [] : {};
    if (nodeIsArray) {
      elementRecordsLen = nodes.length;
      len = lengthOfArrayLike(val);
      for (i = 0; i < len; i++) {
        internalizeProperty(val, i, internalize(val, '' + i, reviver, i < elementRecordsLen ? nodes[i] : undefined));
      }
    } else {
      keys = enumerableOwnProperties(val);
      len = lengthOfArrayLike(keys);
      for (i = 0; i < len; i++) {
        P = keys[i];
        internalizeProperty(val, P, internalize(val, P, reviver, hasOwn(nodes, P) ? nodes[P] : undefined));
      }
    }
  }
  return call(reviver, holder, name, val, context);
};
var internalizeProperty = function internalizeProperty(object, key, value) {
  if (DESCRIPTORS) {
    var descriptor = getOwnPropertyDescriptor(object, key);
    if (descriptor && !descriptor.configurable) return;
  }
  if (value === undefined) delete object[key];else createProperty(object, key, value);
};
var Node = function Node(value, end, source, nodes) {
  this.value = value;
  this.end = end;
  this.source = source;
  this.nodes = nodes;
};
var Context = function Context(source, index) {
  this.source = source;
  this.index = index;
};

// https://www.json.org/json-en.html
Context.prototype = {
  fork: function fork(nextIndex) {
    return new Context(this.source, nextIndex);
  },
  parse: function parse() {
    var source = this.source;
    var i = this.skip(IS_WHITESPACE, this.index);
    var fork = this.fork(i);
    var chr = at(source, i);
    var result;
    if (exec(IS_NUMBER_START, chr)) result = fork.number();else switch (chr) {
      case '{':
        result = fork.object();
        break;
      case '[':
        result = fork.array();
        break;
      case '"':
        result = fork.string();
        break;
      case 't':
        result = fork.keyword(true);
        break;
      case 'f':
        result = fork.keyword(false);
        break;
      case 'n':
        result = fork.keyword(null);
        break;
      default:
        throw SyntaxError('Unexpected character: "' + chr + '" at: ' + i);
    }
    return result;
  },
  node: function node(type, value, start, end, nodes) {
    return new Node(value, end, type ? null : slice(this.source, start, end), nodes);
  },
  object: function object() {
    var source = this.source;
    var i = this.index + 1;
    var expectKeypair = false;
    var object = {};
    var nodes = {};
    while (i < source.length) {
      i = this.until(['"', '}'], i);
      if (at(source, i) == '}' && !expectKeypair) {
        i++;
        break;
      }
      // Parsing the key
      var result = this.fork(i).string();
      var key = result.value;
      i = result.end;
      i = this.until([':'], i) + 1;
      // Parsing value
      i = this.skip(IS_WHITESPACE, i);
      result = this.fork(i).parse();
      createProperty(nodes, key, result);
      createProperty(object, key, result.value);
      i = this.until([',', '}'], result.end);
      var chr = at(source, i);
      if (chr == ',') {
        expectKeypair = true;
        i++;
      } else if (chr == '}') {
        i++;
        break;
      }
    }
    return this.node(OBJECT, object, this.index, i, nodes);
  },
  array: function array() {
    var source = this.source;
    var i = this.index + 1;
    var expectElement = false;
    var array = [];
    var nodes = [];
    while (i < source.length) {
      i = this.skip(IS_WHITESPACE, i);
      if (at(source, i) == ']' && !expectElement) {
        i++;
        break;
      }
      var result = this.fork(i).parse();
      push(nodes, result);
      push(array, result.value);
      i = this.until([',', ']'], result.end);
      if (at(source, i) == ',') {
        expectElement = true;
        i++;
      } else if (at(source, i) == ']') {
        i++;
        break;
      }
    }
    return this.node(OBJECT, array, this.index, i, nodes);
  },
  string: function string() {
    var index = this.index;
    var parsed = parseJSONString(this.source, this.index + 1);
    return this.node(PRIMITIVE, parsed.value, index, parsed.end);
  },
  number: function number() {
    var source = this.source;
    var startIndex = this.index;
    var i = startIndex;
    if (at(source, i) == '-') i++;
    if (at(source, i) == '0') i++;else if (exec(IS_NON_ZERO_DIGIT, at(source, i))) i = this.skip(IS_DIGIT, ++i);else throw SyntaxError('Failed to parse number at: ' + i);
    if (at(source, i) == '.') i = this.skip(IS_DIGIT, ++i);
    if (at(source, i) == 'e' || at(source, i) == 'E') {
      i++;
      if (at(source, i) == '+' || at(source, i) == '-') i++;
      var exponentStartIndex = i;
      i = this.skip(IS_DIGIT, i);
      if (exponentStartIndex == i) throw SyntaxError("Failed to parse number's exponent value at: " + i);
    }
    return this.node(PRIMITIVE, Number(slice(source, startIndex, i)), startIndex, i);
  },
  keyword: function keyword(value) {
    var keyword = '' + value;
    var index = this.index;
    var endIndex = index + keyword.length;
    if (slice(this.source, index, endIndex) != keyword) throw SyntaxError('Failed to parse value at: ' + index);
    return this.node(PRIMITIVE, value, index, endIndex);
  },
  skip: function skip(regex, i) {
    var source = this.source;
    for (; i < source.length; i++) if (!exec(regex, at(source, i))) break;
    return i;
  },
  until: function until(array, i) {
    i = this.skip(IS_WHITESPACE, i);
    var chr = at(this.source, i);
    for (var j = 0; j < array.length; j++) if (array[j] == chr) return i;
    throw SyntaxError('Unexpected character: "' + chr + '" at: ' + i);
  }
};
var NO_SOURCE_SUPPORT = fails(function () {
  var unsafeInt = '9007199254740993';
  var source;
  nativeParse(unsafeInt, function (key, value, context) {
    source = context.source;
  });
  return source !== unsafeInt;
});
var PROPER_BASE_PARSE = NATIVE_SYMBOL && !fails(function () {
  // Safari 9 bug
  return 1 / nativeParse('-0 \t') !== -Infinity;
});

// `JSON.parse` method
// https://tc39.es/ecma262/#sec-json.parse
// https://github.com/tc39/proposal-json-parse-with-source
$({
  target: 'JSON',
  stat: true,
  forced: NO_SOURCE_SUPPORT
}, {
  parse: function parse(text, reviver) {
    return PROPER_BASE_PARSE && !isCallable(reviver) ? nativeParse(text) : $parse(text, reviver);
  }
});

},{"../internals/create-property":64,"../internals/descriptors":72,"../internals/export":97,"../internals/fails":98,"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/get-built-in":113,"../internals/global":122,"../internals/has-own-property":123,"../internals/is-array":136,"../internals/is-callable":138,"../internals/is-object":144,"../internals/length-of-array-like":158,"../internals/parse-json-string":196,"../internals/symbol-constructor-detection":244,"../internals/to-string":261}],586:[function(require,module,exports){
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var $ = require('../internals/export');
var FREEZING = require('../internals/freezing');
var NATIVE_RAW_JSON = require('../internals/native-raw-json');
var getBuiltIn = require('../internals/get-built-in');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var isCallable = require('../internals/is-callable');
var isRawJSON = require('../internals/is-raw-json');
var toString = require('../internals/to-string');
var createProperty = require('../internals/create-property');
var parseJSONString = require('../internals/parse-json-string');
var getReplacerFunction = require('../internals/get-json-replacer-function');
var uid = require('../internals/uid');
var setInternalState = require('../internals/internal-state').set;
var $String = String;
var $SyntaxError = SyntaxError;
var parse = getBuiltIn('JSON', 'parse');
var $stringify = getBuiltIn('JSON', 'stringify');
var create = getBuiltIn('Object', 'create');
var freeze = getBuiltIn('Object', 'freeze');
var at = uncurryThis(''.charAt);
var slice = uncurryThis(''.slice);
var exec = uncurryThis(/./.exec);
var push = uncurryThis([].push);
var MARK = uid();
var MARK_LENGTH = MARK.length;
var ERROR_MESSAGE = 'Unacceptable as raw JSON';
var IS_WHITESPACE = /^[\t\n\r ]$/;

// `JSON.parse` method
// https://tc39.es/proposal-json-parse-with-source/#sec-json.israwjson
// https://github.com/tc39/proposal-json-parse-with-source
$({
  target: 'JSON',
  stat: true,
  forced: !NATIVE_RAW_JSON
}, {
  rawJSON: function rawJSON(text) {
    var jsonString = toString(text);
    if (jsonString == '' || exec(IS_WHITESPACE, at(jsonString, 0)) || exec(IS_WHITESPACE, at(jsonString, jsonString.length - 1))) {
      throw $SyntaxError(ERROR_MESSAGE);
    }
    var parsed = parse(jsonString);
    if (_typeof(parsed) == 'object' && parsed !== null) throw $SyntaxError(ERROR_MESSAGE);
    var obj = create(null);
    setInternalState(obj, {
      type: 'RawJSON'
    });
    createProperty(obj, 'rawJSON', jsonString);
    return FREEZING ? freeze(obj) : obj;
  }
});

// `JSON.stringify` method
// https://tc39.es/ecma262/#sec-json.stringify
// https://github.com/tc39/proposal-json-parse-with-source
if ($stringify) $({
  target: 'JSON',
  stat: true,
  arity: 3,
  forced: !NATIVE_RAW_JSON
}, {
  stringify: function stringify(text, replacer, space) {
    var replacerFunction = getReplacerFunction(replacer);
    var rawStrings = [];
    var json = $stringify(text, function (key, value) {
      // some old implementations (like WebKit) could pass numbers as keys
      var v = isCallable(replacerFunction) ? call(replacerFunction, this, $String(key), value) : value;
      return isRawJSON(v) ? MARK + (push(rawStrings, v.rawJSON) - 1) : v;
    }, space);
    if (typeof json != 'string') return json;
    var result = '';
    var length = json.length;
    for (var i = 0; i < length; i++) {
      var chr = at(json, i);
      if (chr == '"') {
        var end = parseJSONString(json, ++i).end - 1;
        var string = slice(json, i, end);
        result += slice(string, 0, MARK_LENGTH) == MARK ? rawStrings[slice(string, MARK_LENGTH)] : '"' + string + '"';
        i = end;
      } else result += chr;
    }
    return result;
  }
});

},{"../internals/create-property":64,"../internals/export":97,"../internals/freezing":101,"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/get-built-in":113,"../internals/get-json-replacer-function":118,"../internals/internal-state":134,"../internals/is-callable":138,"../internals/is-raw-json":146,"../internals/native-raw-json":168,"../internals/parse-json-string":196,"../internals/to-string":261,"../internals/uid":269}],587:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.object.has-own');

},{"../modules/es.object.has-own":390}],588:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.promise.all-settled.js');

},{"../modules/es.promise.all-settled.js":406}],589:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.promise.any');

},{"../modules/es.promise.any":408}],590:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var difference = require('../internals/set-difference');
var setMethodAcceptSetLike = require('../internals/set-method-accept-set-like');

// `Set.prototype.difference` method
// https://github.com/tc39/proposal-set-methods
$({
  target: 'Set',
  proto: true,
  real: true,
  forced: !setMethodAcceptSetLike('difference')
}, {
  difference: difference
});

},{"../internals/export":97,"../internals/set-difference":216,"../internals/set-method-accept-set-like":223}],591:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var intersection = require('../internals/set-intersection');
var setMethodAcceptSetLike = require('../internals/set-method-accept-set-like');

// `Set.prototype.intersection` method
// https://github.com/tc39/proposal-set-methods
$({
  target: 'Set',
  proto: true,
  real: true,
  forced: !setMethodAcceptSetLike('intersection')
}, {
  intersection: intersection
});

},{"../internals/export":97,"../internals/set-intersection":218,"../internals/set-method-accept-set-like":223}],592:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var isDisjointFrom = require('../internals/set-is-disjoint-from');
var setMethodAcceptSetLike = require('../internals/set-method-accept-set-like');

// `Set.prototype.isDisjointFrom` method
// https://github.com/tc39/proposal-set-methods
$({
  target: 'Set',
  proto: true,
  real: true,
  forced: !setMethodAcceptSetLike('isDisjointFrom')
}, {
  isDisjointFrom: isDisjointFrom
});

},{"../internals/export":97,"../internals/set-is-disjoint-from":219,"../internals/set-method-accept-set-like":223}],593:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var isSubsetOf = require('../internals/set-is-subset-of');
var setMethodAcceptSetLike = require('../internals/set-method-accept-set-like');

// `Set.prototype.isSubsetOf` method
// https://github.com/tc39/proposal-set-methods
$({
  target: 'Set',
  proto: true,
  real: true,
  forced: !setMethodAcceptSetLike('isSubsetOf')
}, {
  isSubsetOf: isSubsetOf
});

},{"../internals/export":97,"../internals/set-is-subset-of":220,"../internals/set-method-accept-set-like":223}],594:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var isSupersetOf = require('../internals/set-is-superset-of');
var setMethodAcceptSetLike = require('../internals/set-method-accept-set-like');

// `Set.prototype.isSupersetOf` method
// https://github.com/tc39/proposal-set-methods
$({
  target: 'Set',
  proto: true,
  real: true,
  forced: !setMethodAcceptSetLike('isSupersetOf')
}, {
  isSupersetOf: isSupersetOf
});

},{"../internals/export":97,"../internals/set-is-superset-of":221,"../internals/set-method-accept-set-like":223}],595:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var symmetricDifference = require('../internals/set-symmetric-difference');
var setMethodAcceptSetLike = require('../internals/set-method-accept-set-like');

// `Set.prototype.symmetricDifference` method
// https://github.com/tc39/proposal-set-methods
$({
  target: 'Set',
  proto: true,
  real: true,
  forced: !setMethodAcceptSetLike('symmetricDifference')
}, {
  symmetricDifference: symmetricDifference
});

},{"../internals/export":97,"../internals/set-method-accept-set-like":223,"../internals/set-symmetric-difference":226}],596:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var union = require('../internals/set-union');
var setMethodAcceptSetLike = require('../internals/set-method-accept-set-like');

// `Set.prototype.union` method
// https://github.com/tc39/proposal-set-methods
$({
  target: 'Set',
  proto: true,
  real: true,
  forced: !setMethodAcceptSetLike('union')
}, {
  union: union
});

},{"../internals/export":97,"../internals/set-method-accept-set-like":223,"../internals/set-union":228}],597:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toString = require('../internals/to-string');
var charCodeAt = uncurryThis(''.charCodeAt);

// `String.prototype.isWellFormed` method
// https://github.com/tc39/proposal-is-usv-string
$({
  target: 'String',
  proto: true
}, {
  isWellFormed: function isWellFormed() {
    var S = toString(requireObjectCoercible(this));
    var length = S.length;
    for (var i = 0; i < length; i++) {
      var charCode = charCodeAt(S, i);
      // single UTF-16 code unit
      if ((charCode & 0xF800) != 0xD800) continue;
      // unpaired surrogate
      if (charCode >= 0xDC00 || ++i >= length || (charCodeAt(S, i) & 0xFC00) != 0xDC00) return false;
    }
    return true;
  }
});

},{"../internals/export":97,"../internals/function-uncurry-this":110,"../internals/require-object-coercible":212,"../internals/to-string":261}],598:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.string.match-all');

},{"../modules/es.string.match-all":454}],599:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.string.replace-all');

},{"../modules/es.string.replace-all":460}],600:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toString = require('../internals/to-string');
var fails = require('../internals/fails');
var $Array = Array;
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var join = uncurryThis([].join);
var $toWellFormed = ''.toWellFormed;
var REPLACEMENT_CHARACTER = "\uFFFD";

// Safari bug
var TO_STRING_CONVERSION_BUG = $toWellFormed && fails(function () {
  return call($toWellFormed, 1) !== '1';
});

// `String.prototype.toWellFormed` method
// https://github.com/tc39/proposal-is-usv-string
$({
  target: 'String',
  proto: true,
  forced: TO_STRING_CONVERSION_BUG
}, {
  toWellFormed: function toWellFormed() {
    var S = toString(requireObjectCoercible(this));
    if (TO_STRING_CONVERSION_BUG) return call($toWellFormed, S);
    var length = S.length;
    var result = $Array(length);
    for (var i = 0; i < length; i++) {
      var charCode = charCodeAt(S, i);
      // single UTF-16 code unit
      if ((charCode & 0xF800) != 0xD800) result[i] = charAt(S, i);
      // unpaired surrogate
      else if (charCode >= 0xDC00 || i + 1 >= length || (charCodeAt(S, i + 1) & 0xFC00) != 0xDC00) result[i] = REPLACEMENT_CHARACTER;
      // surrogate pair
      else {
        result[i] = charAt(S, i);
        result[++i] = charAt(S, i);
      }
    }
    return join(result, '');
  }
});

},{"../internals/export":97,"../internals/fails":98,"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/require-object-coercible":212,"../internals/to-string":261}],601:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var create = require('../internals/object-create');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var installErrorStack = require('../internals/error-stack-install');
var normalizeStringArgument = require('../internals/normalize-string-argument');
var wellKnownSymbol = require('../internals/well-known-symbol');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Error = Error;
var $SuppressedError = function SuppressedError(error, suppressed, message) {
  var isInstance = isPrototypeOf(SuppressedErrorPrototype, this);
  var that;
  if (setPrototypeOf) {
    that = setPrototypeOf($Error(), isInstance ? getPrototypeOf(this) : SuppressedErrorPrototype);
  } else {
    that = isInstance ? this : create(SuppressedErrorPrototype);
    createNonEnumerableProperty(that, TO_STRING_TAG, 'Error');
  }
  if (message !== undefined) createNonEnumerableProperty(that, 'message', normalizeStringArgument(message));
  installErrorStack(that, $SuppressedError, that.stack, 1);
  createNonEnumerableProperty(that, 'error', error);
  createNonEnumerableProperty(that, 'suppressed', suppressed);
  return that;
};
if (setPrototypeOf) setPrototypeOf($SuppressedError, $Error);else copyConstructorProperties($SuppressedError, $Error, {
  name: true
});
var SuppressedErrorPrototype = $SuppressedError.prototype = create($Error.prototype, {
  constructor: createPropertyDescriptor(1, $SuppressedError),
  message: createPropertyDescriptor(1, ''),
  name: createPropertyDescriptor(1, 'SuppressedError')
});

// `SuppressedError` constructor
// https://github.com/tc39/proposal-explicit-resource-management
$({
  global: true,
  constructor: true,
  arity: 3
}, {
  SuppressedError: $SuppressedError
});

},{"../internals/copy-constructor-properties":57,"../internals/create-non-enumerable-property":62,"../internals/create-property-descriptor":63,"../internals/error-stack-install":94,"../internals/export":97,"../internals/normalize-string-argument":170,"../internals/object-create":177,"../internals/object-get-prototype-of":184,"../internals/object-is-prototype-of":186,"../internals/object-set-prototype-of":191,"../internals/well-known-symbol":277}],602:[function(require,module,exports){
"use strict";

var defineWellKnownSymbol = require('../internals/well-known-symbol-define');

// `Symbol.dispose` well-known symbol
// https://github.com/tc39/proposal-explicit-resource-management
defineWellKnownSymbol('dispose');

},{"../internals/well-known-symbol-define":275}],603:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.typed-array.at');

},{"../modules/es.typed-array.at":493}],604:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.typed-array.find-last-index');

},{"../modules/es.typed-array.find-last-index":499}],605:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.typed-array.find-last');

},{"../modules/es.typed-array.find-last":500}],606:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.typed-array.to-reversed');

},{"../modules/es.typed-array.to-reversed":525}],607:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.typed-array.to-sorted');

},{"../modules/es.typed-array.to-sorted":526}],608:[function(require,module,exports){
'use strict';

// TODO: Remove from `core-js@4`
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var isBigIntArray = require('../internals/is-big-int-array');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toBigInt = require('../internals/to-big-int');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var fails = require('../internals/fails');
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var max = Math.max;
var min = Math.min;

// some early implementations, like WebKit, does not follow the final semantic
var PROPER_ORDER = !fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  var array = new Int8Array([1]);
  var spliced = array.toSpliced(1, 0, {
    valueOf: function valueOf() {
      array[0] = 2;
      return 3;
    }
  });
  return spliced[0] !== 2 || spliced[1] !== 3;
});

// `%TypedArray%.prototype.toSpliced` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSpliced
exportTypedArrayMethod('toSpliced', function toSpliced(start, deleteCount /* , ...items */) {
  var O = aTypedArray(this);
  var C = getTypedArrayConstructor(O);
  var len = lengthOfArrayLike(O);
  var actualStart = toAbsoluteIndex(start, len);
  var argumentsLength = arguments.length;
  var k = 0;
  var insertCount, actualDeleteCount, thisIsBigIntArray, convertedItems, value, newLen, A;
  if (argumentsLength === 0) {
    insertCount = actualDeleteCount = 0;
  } else if (argumentsLength === 1) {
    insertCount = 0;
    actualDeleteCount = len - actualStart;
  } else {
    actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
    insertCount = argumentsLength - 2;
    if (insertCount) {
      convertedItems = new C(insertCount);
      thisIsBigIntArray = isBigIntArray(convertedItems);
      for (var i = 2; i < argumentsLength; i++) {
        value = arguments[i];
        // FF30- typed arrays doesn't properly convert objects to typed array values
        convertedItems[i - 2] = thisIsBigIntArray ? toBigInt(value) : +value;
      }
    }
  }
  newLen = len + insertCount - actualDeleteCount;
  A = new C(newLen);
  for (; k < actualStart; k++) A[k] = O[k];
  for (; k < actualStart + insertCount; k++) A[k] = convertedItems[k - actualStart];
  for (; k < newLen; k++) A[k] = O[k + actualDeleteCount - insertCount];
  return A;
}, !PROPER_ORDER);

},{"../internals/array-buffer-view-core":17,"../internals/fails":98,"../internals/is-big-int-array":137,"../internals/length-of-array-like":158,"../internals/to-absolute-index":249,"../internals/to-big-int":250,"../internals/to-integer-or-infinity":253}],609:[function(require,module,exports){
"use strict";

// TODO: Remove from `core-js@4`
require('../modules/es.typed-array.with');

},{"../modules/es.typed-array.with":532}],610:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var uncurryThis = require('../internals/function-uncurry-this');
var call = require('../internals/function-call');
var fails = require('../internals/fails');
var toString = require('../internals/to-string');
var hasOwn = require('../internals/has-own-property');
var validateArgumentsLength = require('../internals/validate-arguments-length');
var ctoi = require('../internals/base64-map').ctoi;
var disallowed = /[^\d+/a-z]/i;
var whitespaces = /[\t\n\f\r ]+/g;
var finalEq = /[=]{1,2}$/;
var $atob = getBuiltIn('atob');
var fromCharCode = String.fromCharCode;
var charAt = uncurryThis(''.charAt);
var replace = uncurryThis(''.replace);
var exec = uncurryThis(disallowed.exec);
var NO_SPACES_IGNORE = fails(function () {
  return $atob(' ') !== '';
});
var NO_ENCODING_CHECK = !fails(function () {
  $atob('a');
});
var NO_ARG_RECEIVING_CHECK = !NO_SPACES_IGNORE && !NO_ENCODING_CHECK && !fails(function () {
  $atob();
});
var WRONG_ARITY = !NO_SPACES_IGNORE && !NO_ENCODING_CHECK && $atob.length !== 1;

// `atob` method
// https://html.spec.whatwg.org/multipage/webappapis.html#dom-atob
$({
  global: true,
  bind: true,
  enumerable: true,
  forced: NO_SPACES_IGNORE || NO_ENCODING_CHECK || NO_ARG_RECEIVING_CHECK || WRONG_ARITY
}, {
  atob: function atob(data) {
    validateArgumentsLength(arguments.length, 1);
    // `webpack` dev server bug on IE global methods - use call(fn, global, ...)
    if (NO_ARG_RECEIVING_CHECK || WRONG_ARITY) return call($atob, global, data);
    var string = replace(toString(data), whitespaces, '');
    var output = '';
    var position = 0;
    var bc = 0;
    var chr, bs;
    if (string.length % 4 == 0) {
      string = replace(string, finalEq, '');
    }
    if (string.length % 4 == 1 || exec(disallowed, string)) {
      throw new (getBuiltIn('DOMException'))('The string is not correctly encoded', 'InvalidCharacterError');
    }
    while (chr = charAt(string, position++)) {
      if (hasOwn(ctoi, chr)) {
        bs = bc % 4 ? bs * 64 + ctoi[chr] : ctoi[chr];
        if (bc++ % 4) output += fromCharCode(255 & bs >> (-2 * bc & 6));
      }
    }
    return output;
  }
});

},{"../internals/base64-map":49,"../internals/export":97,"../internals/fails":98,"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/get-built-in":113,"../internals/global":122,"../internals/has-own-property":123,"../internals/to-string":261,"../internals/validate-arguments-length":273}],611:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var uncurryThis = require('../internals/function-uncurry-this');
var call = require('../internals/function-call');
var fails = require('../internals/fails');
var toString = require('../internals/to-string');
var validateArgumentsLength = require('../internals/validate-arguments-length');
var itoc = require('../internals/base64-map').itoc;
var $btoa = getBuiltIn('btoa');
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var NO_ARG_RECEIVING_CHECK = !!$btoa && !fails(function () {
  $btoa();
});
var WRONG_ARG_CONVERSION = !!$btoa && fails(function () {
  return $btoa(null) !== 'bnVsbA==';
});
var WRONG_ARITY = !!$btoa && $btoa.length !== 1;

// `btoa` method
// https://html.spec.whatwg.org/multipage/webappapis.html#dom-btoa
$({
  global: true,
  bind: true,
  enumerable: true,
  forced: NO_ARG_RECEIVING_CHECK || WRONG_ARG_CONVERSION || WRONG_ARITY
}, {
  btoa: function btoa(data) {
    validateArgumentsLength(arguments.length, 1);
    // `webpack` dev server bug on IE global methods - use call(fn, global, ...)
    if (NO_ARG_RECEIVING_CHECK || WRONG_ARG_CONVERSION || WRONG_ARITY) return call($btoa, global, toString(data));
    var string = toString(data);
    var output = '';
    var position = 0;
    var map = itoc;
    var block, charCode;
    while (charAt(string, position) || (map = '=', position % 1)) {
      charCode = charCodeAt(string, position += 3 / 4);
      if (charCode > 0xFF) {
        throw new (getBuiltIn('DOMException'))('The string contains characters outside of the Latin1 range', 'InvalidCharacterError');
      }
      block = block << 8 | charCode;
      output += charAt(map, 63 & block >> 8 - position % 1 * 8);
    }
    return output;
  }
});

},{"../internals/base64-map":49,"../internals/export":97,"../internals/fails":98,"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/get-built-in":113,"../internals/global":122,"../internals/to-string":261,"../internals/validate-arguments-length":273}],612:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var global = require('../internals/global');
var clearImmediate = require('../internals/task').clear;

// `clearImmediate` method
// http://w3c.github.io/setImmediate/#si-clearImmediate
$({
  global: true,
  bind: true,
  enumerable: true,
  forced: global.clearImmediate !== clearImmediate
}, {
  clearImmediate: clearImmediate
});

},{"../internals/export":97,"../internals/global":122,"../internals/task":247}],613:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var DOMIterables = require('../internals/dom-iterables');
var DOMTokenListPrototype = require('../internals/dom-token-list-prototype');
var forEach = require('../internals/array-for-each');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var handlePrototype = function handlePrototype(CollectionPrototype) {
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
};
for (var COLLECTION_NAME in DOMIterables) {
  if (DOMIterables[COLLECTION_NAME]) {
    handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype);
  }
}
handlePrototype(DOMTokenListPrototype);

},{"../internals/array-for-each":21,"../internals/create-non-enumerable-property":62,"../internals/dom-iterables":77,"../internals/dom-token-list-prototype":78,"../internals/global":122}],614:[function(require,module,exports){
"use strict";

var global = require('../internals/global');
var DOMIterables = require('../internals/dom-iterables');
var DOMTokenListPrototype = require('../internals/dom-token-list-prototype');
var ArrayIteratorMethods = require('../modules/es.array.iterator');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;
var handlePrototype = function handlePrototype(CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
};
for (var COLLECTION_NAME in DOMIterables) {
  handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype, COLLECTION_NAME);
}
handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

},{"../internals/create-non-enumerable-property":62,"../internals/dom-iterables":77,"../internals/dom-token-list-prototype":78,"../internals/global":122,"../internals/well-known-symbol":277,"../modules/es.array.iterator":303}],615:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var tryNodeRequire = require('../internals/try-node-require');
var getBuiltIn = require('../internals/get-built-in');
var fails = require('../internals/fails');
var create = require('../internals/object-create');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var defineProperty = require('../internals/object-define-property').f;
var defineBuiltIn = require('../internals/define-built-in');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var hasOwn = require('../internals/has-own-property');
var anInstance = require('../internals/an-instance');
var anObject = require('../internals/an-object');
var errorToString = require('../internals/error-to-string');
var normalizeStringArgument = require('../internals/normalize-string-argument');
var DOMExceptionConstants = require('../internals/dom-exception-constants');
var clearErrorStack = require('../internals/error-stack-clear');
var InternalStateModule = require('../internals/internal-state');
var DESCRIPTORS = require('../internals/descriptors');
var IS_PURE = require('../internals/is-pure');
var DOM_EXCEPTION = 'DOMException';
var DATA_CLONE_ERR = 'DATA_CLONE_ERR';
var Error = getBuiltIn('Error');
// NodeJS < 17.0 does not expose `DOMException` to global
var NativeDOMException = getBuiltIn(DOM_EXCEPTION) || function () {
  try {
    // NodeJS < 15.0 does not expose `MessageChannel` to global
    var MessageChannel = getBuiltIn('MessageChannel') || tryNodeRequire('worker_threads').MessageChannel;
    // eslint-disable-next-line es/no-weak-map, unicorn/require-post-message-target-origin -- safe
    new MessageChannel().port1.postMessage(new WeakMap());
  } catch (error) {
    if (error.name == DATA_CLONE_ERR && error.code == 25) return error.constructor;
  }
}();
var NativeDOMExceptionPrototype = NativeDOMException && NativeDOMException.prototype;
var ErrorPrototype = Error.prototype;
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(DOM_EXCEPTION);
var HAS_STACK = ('stack' in Error(DOM_EXCEPTION));
var codeFor = function codeFor(name) {
  return hasOwn(DOMExceptionConstants, name) && DOMExceptionConstants[name].m ? DOMExceptionConstants[name].c : 0;
};
var $DOMException = function DOMException() {
  anInstance(this, DOMExceptionPrototype);
  var argumentsLength = arguments.length;
  var message = normalizeStringArgument(argumentsLength < 1 ? undefined : arguments[0]);
  var name = normalizeStringArgument(argumentsLength < 2 ? undefined : arguments[1], 'Error');
  var code = codeFor(name);
  setInternalState(this, {
    type: DOM_EXCEPTION,
    name: name,
    message: message,
    code: code
  });
  if (!DESCRIPTORS) {
    this.name = name;
    this.message = message;
    this.code = code;
  }
  if (HAS_STACK) {
    var error = Error(message);
    error.name = DOM_EXCEPTION;
    defineProperty(this, 'stack', createPropertyDescriptor(1, clearErrorStack(error.stack, 1)));
  }
};
var DOMExceptionPrototype = $DOMException.prototype = create(ErrorPrototype);
var createGetterDescriptor = function createGetterDescriptor(get) {
  return {
    enumerable: true,
    configurable: true,
    get: get
  };
};
var getterFor = function getterFor(key) {
  return createGetterDescriptor(function () {
    return getInternalState(this)[key];
  });
};
if (DESCRIPTORS) {
  // `DOMException.prototype.code` getter
  defineBuiltInAccessor(DOMExceptionPrototype, 'code', getterFor('code'));
  // `DOMException.prototype.message` getter
  defineBuiltInAccessor(DOMExceptionPrototype, 'message', getterFor('message'));
  // `DOMException.prototype.name` getter
  defineBuiltInAccessor(DOMExceptionPrototype, 'name', getterFor('name'));
}
defineProperty(DOMExceptionPrototype, 'constructor', createPropertyDescriptor(1, $DOMException));

// FF36- DOMException is a function, but can't be constructed
var INCORRECT_CONSTRUCTOR = fails(function () {
  return !(new NativeDOMException() instanceof Error);
});

// Safari 10.1 / Chrome 32- / IE8- DOMException.prototype.toString bugs
var INCORRECT_TO_STRING = INCORRECT_CONSTRUCTOR || fails(function () {
  return ErrorPrototype.toString !== errorToString || String(new NativeDOMException(1, 2)) !== '2: 1';
});

// Deno 1.6.3- DOMException.prototype.code just missed
var INCORRECT_CODE = INCORRECT_CONSTRUCTOR || fails(function () {
  return new NativeDOMException(1, 'DataCloneError').code !== 25;
});

// Deno 1.6.3- DOMException constants just missed
var MISSED_CONSTANTS = INCORRECT_CONSTRUCTOR || NativeDOMException[DATA_CLONE_ERR] !== 25 || NativeDOMExceptionPrototype[DATA_CLONE_ERR] !== 25;
var FORCED_CONSTRUCTOR = IS_PURE ? INCORRECT_TO_STRING || INCORRECT_CODE || MISSED_CONSTANTS : INCORRECT_CONSTRUCTOR;

// `DOMException` constructor
// https://webidl.spec.whatwg.org/#idl-DOMException
$({
  global: true,
  constructor: true,
  forced: FORCED_CONSTRUCTOR
}, {
  DOMException: FORCED_CONSTRUCTOR ? $DOMException : NativeDOMException
});
var PolyfilledDOMException = getBuiltIn(DOM_EXCEPTION);
var PolyfilledDOMExceptionPrototype = PolyfilledDOMException.prototype;
if (INCORRECT_TO_STRING && (IS_PURE || NativeDOMException === PolyfilledDOMException)) {
  defineBuiltIn(PolyfilledDOMExceptionPrototype, 'toString', errorToString);
}
if (INCORRECT_CODE && DESCRIPTORS && NativeDOMException === PolyfilledDOMException) {
  defineBuiltInAccessor(PolyfilledDOMExceptionPrototype, 'code', createGetterDescriptor(function () {
    return codeFor(anObject(this).name);
  }));
}

// `DOMException` constants
for (var key in DOMExceptionConstants) if (hasOwn(DOMExceptionConstants, key)) {
  var constant = DOMExceptionConstants[key];
  var constantName = constant.s;
  var descriptor = createPropertyDescriptor(6, constant.c);
  if (!hasOwn(PolyfilledDOMException, constantName)) {
    defineProperty(PolyfilledDOMException, constantName, descriptor);
  }
  if (!hasOwn(PolyfilledDOMExceptionPrototype, constantName)) {
    defineProperty(PolyfilledDOMExceptionPrototype, constantName, descriptor);
  }
}

},{"../internals/an-instance":10,"../internals/an-object":11,"../internals/create-property-descriptor":63,"../internals/define-built-in":68,"../internals/define-built-in-accessor":67,"../internals/descriptors":72,"../internals/dom-exception-constants":76,"../internals/error-stack-clear":93,"../internals/error-to-string":96,"../internals/export":97,"../internals/fails":98,"../internals/get-built-in":113,"../internals/has-own-property":123,"../internals/internal-state":134,"../internals/is-pure":145,"../internals/normalize-string-argument":170,"../internals/object-create":177,"../internals/object-define-property":179,"../internals/try-node-require":262}],616:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var defineProperty = require('../internals/object-define-property').f;
var hasOwn = require('../internals/has-own-property');
var anInstance = require('../internals/an-instance');
var inheritIfRequired = require('../internals/inherit-if-required');
var normalizeStringArgument = require('../internals/normalize-string-argument');
var DOMExceptionConstants = require('../internals/dom-exception-constants');
var clearErrorStack = require('../internals/error-stack-clear');
var DESCRIPTORS = require('../internals/descriptors');
var IS_PURE = require('../internals/is-pure');
var DOM_EXCEPTION = 'DOMException';
var Error = getBuiltIn('Error');
var NativeDOMException = getBuiltIn(DOM_EXCEPTION);
var $DOMException = function DOMException() {
  anInstance(this, DOMExceptionPrototype);
  var argumentsLength = arguments.length;
  var message = normalizeStringArgument(argumentsLength < 1 ? undefined : arguments[0]);
  var name = normalizeStringArgument(argumentsLength < 2 ? undefined : arguments[1], 'Error');
  var that = new NativeDOMException(message, name);
  var error = Error(message);
  error.name = DOM_EXCEPTION;
  defineProperty(that, 'stack', createPropertyDescriptor(1, clearErrorStack(error.stack, 1)));
  inheritIfRequired(that, this, $DOMException);
  return that;
};
var DOMExceptionPrototype = $DOMException.prototype = NativeDOMException.prototype;
var ERROR_HAS_STACK = ('stack' in Error(DOM_EXCEPTION));
var DOM_EXCEPTION_HAS_STACK = ('stack' in new NativeDOMException(1, 2));

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var descriptor = NativeDOMException && DESCRIPTORS && Object.getOwnPropertyDescriptor(global, DOM_EXCEPTION);

// Bun ~ 0.1.1 DOMException have incorrect descriptor and we can't redefine it
// https://github.com/Jarred-Sumner/bun/issues/399
var BUGGY_DESCRIPTOR = !!descriptor && !(descriptor.writable && descriptor.configurable);
var FORCED_CONSTRUCTOR = ERROR_HAS_STACK && !BUGGY_DESCRIPTOR && !DOM_EXCEPTION_HAS_STACK;

// `DOMException` constructor patch for `.stack` where it's required
// https://webidl.spec.whatwg.org/#es-DOMException-specialness
$({
  global: true,
  constructor: true,
  forced: IS_PURE || FORCED_CONSTRUCTOR
}, {
  // TODO: fix export logic
  DOMException: FORCED_CONSTRUCTOR ? $DOMException : NativeDOMException
});
var PolyfilledDOMException = getBuiltIn(DOM_EXCEPTION);
var PolyfilledDOMExceptionPrototype = PolyfilledDOMException.prototype;
if (PolyfilledDOMExceptionPrototype.constructor !== PolyfilledDOMException) {
  if (!IS_PURE) {
    defineProperty(PolyfilledDOMExceptionPrototype, 'constructor', createPropertyDescriptor(1, PolyfilledDOMException));
  }
  for (var key in DOMExceptionConstants) if (hasOwn(DOMExceptionConstants, key)) {
    var constant = DOMExceptionConstants[key];
    var constantName = constant.s;
    if (!hasOwn(PolyfilledDOMException, constantName)) {
      defineProperty(PolyfilledDOMException, constantName, createPropertyDescriptor(6, constant.c));
    }
  }
}

},{"../internals/an-instance":10,"../internals/create-property-descriptor":63,"../internals/descriptors":72,"../internals/dom-exception-constants":76,"../internals/error-stack-clear":93,"../internals/export":97,"../internals/get-built-in":113,"../internals/global":122,"../internals/has-own-property":123,"../internals/inherit-if-required":130,"../internals/is-pure":145,"../internals/normalize-string-argument":170,"../internals/object-define-property":179}],617:[function(require,module,exports){
"use strict";

var getBuiltIn = require('../internals/get-built-in');
var setToStringTag = require('../internals/set-to-string-tag');
var DOM_EXCEPTION = 'DOMException';

// `DOMException.prototype[@@toStringTag]` property
setToStringTag(getBuiltIn(DOM_EXCEPTION), DOM_EXCEPTION);

},{"../internals/get-built-in":113,"../internals/set-to-string-tag":227}],618:[function(require,module,exports){
"use strict";

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
require('../modules/web.clear-immediate');
require('../modules/web.set-immediate');

},{"../modules/web.clear-immediate":612,"../modules/web.set-immediate":621}],619:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var global = require('../internals/global');
var microtask = require('../internals/microtask');
var aCallable = require('../internals/a-callable');
var validateArgumentsLength = require('../internals/validate-arguments-length');
var IS_NODE = require('../internals/engine-is-node');
var process = global.process;

// `queueMicrotask` method
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
$({
  global: true,
  enumerable: true,
  dontCallGetSet: true
}, {
  queueMicrotask: function queueMicrotask(fn) {
    validateArgumentsLength(arguments.length, 1);
    aCallable(fn);
    var domain = IS_NODE && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

},{"../internals/a-callable":3,"../internals/engine-is-node":86,"../internals/export":97,"../internals/global":122,"../internals/microtask":167,"../internals/validate-arguments-length":273}],620:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var global = require('../internals/global');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var DESCRIPTORS = require('../internals/descriptors');
var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var INCORRECT_VALUE = global.self !== global;

// `self` getter
// https://html.spec.whatwg.org/multipage/window-object.html#dom-self
try {
  if (DESCRIPTORS) {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var descriptor = Object.getOwnPropertyDescriptor(global, 'self');
    // some engines have `self`, but with incorrect descriptor
    // https://github.com/denoland/deno/issues/15765
    if (INCORRECT_VALUE || !descriptor || !descriptor.get || !descriptor.enumerable) {
      defineBuiltInAccessor(global, 'self', {
        get: function self() {
          return global;
        },
        set: function self(value) {
          if (this !== global) throw $TypeError('Illegal invocation');
          defineProperty(global, 'self', {
            value: value,
            writable: true,
            configurable: true,
            enumerable: true
          });
        },
        configurable: true,
        enumerable: true
      });
    }
  } else $({
    global: true,
    simple: true,
    forced: INCORRECT_VALUE
  }, {
    self: global
  });
} catch (error) {/* empty */}

},{"../internals/define-built-in-accessor":67,"../internals/descriptors":72,"../internals/export":97,"../internals/global":122}],621:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var global = require('../internals/global');
var setTask = require('../internals/task').set;
var schedulersFix = require('../internals/schedulers-fix');

// https://github.com/oven-sh/bun/issues/1633
var setImmediate = global.setImmediate ? schedulersFix(setTask, false) : setTask;

// `setImmediate` method
// http://w3c.github.io/setImmediate/#si-setImmediate
$({
  global: true,
  bind: true,
  enumerable: true,
  forced: global.setImmediate !== setImmediate
}, {
  setImmediate: setImmediate
});

},{"../internals/export":97,"../internals/global":122,"../internals/schedulers-fix":214,"../internals/task":247}],622:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var global = require('../internals/global');
var schedulersFix = require('../internals/schedulers-fix');
var setInterval = schedulersFix(global.setInterval, true);

// Bun / IE9- setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
$({
  global: true,
  bind: true,
  forced: global.setInterval !== setInterval
}, {
  setInterval: setInterval
});

},{"../internals/export":97,"../internals/global":122,"../internals/schedulers-fix":214}],623:[function(require,module,exports){
"use strict";

var $ = require('../internals/export');
var global = require('../internals/global');
var schedulersFix = require('../internals/schedulers-fix');
var setTimeout = schedulersFix(global.setTimeout, true);

// Bun / IE9- setTimeout additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
$({
  global: true,
  bind: true,
  forced: global.setTimeout !== setTimeout
}, {
  setTimeout: setTimeout
});

},{"../internals/export":97,"../internals/global":122,"../internals/schedulers-fix":214}],624:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var IS_PURE = require('../internals/is-pure');
var $ = require('../internals/export');
var global = require('../internals/global');
var getBuiltin = require('../internals/get-built-in');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var uid = require('../internals/uid');
var isCallable = require('../internals/is-callable');
var isConstructor = require('../internals/is-constructor');
var isNullOrUndefined = require('../internals/is-null-or-undefined');
var isObject = require('../internals/is-object');
var isSymbol = require('../internals/is-symbol');
var iterate = require('../internals/iterate');
var anObject = require('../internals/an-object');
var classof = require('../internals/classof');
var hasOwn = require('../internals/has-own-property');
var createProperty = require('../internals/create-property');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var validateArgumentsLength = require('../internals/validate-arguments-length');
var getRegExpFlags = require('../internals/regexp-get-flags');
var MapHelpers = require('../internals/map-helpers');
var SetHelpers = require('../internals/set-helpers');
var ERROR_STACK_INSTALLABLE = require('../internals/error-stack-installable');
var PROPER_TRANSFER = require('../internals/structured-clone-proper-transfer');
var Object = global.Object;
var Array = global.Array;
var Date = global.Date;
var Error = global.Error;
var EvalError = global.EvalError;
var RangeError = global.RangeError;
var ReferenceError = global.ReferenceError;
var SyntaxError = global.SyntaxError;
var TypeError = global.TypeError;
var URIError = global.URIError;
var PerformanceMark = global.PerformanceMark;
var WebAssembly = global.WebAssembly;
var CompileError = WebAssembly && WebAssembly.CompileError || Error;
var LinkError = WebAssembly && WebAssembly.LinkError || Error;
var RuntimeError = WebAssembly && WebAssembly.RuntimeError || Error;
var DOMException = getBuiltin('DOMException');
var Map = MapHelpers.Map;
var mapHas = MapHelpers.has;
var mapGet = MapHelpers.get;
var mapSet = MapHelpers.set;
var Set = SetHelpers.Set;
var setAdd = SetHelpers.add;
var objectKeys = getBuiltin('Object', 'keys');
var push = uncurryThis([].push);
var thisBooleanValue = uncurryThis(true.valueOf);
var thisNumberValue = uncurryThis(1.0.valueOf);
var thisStringValue = uncurryThis(''.valueOf);
var thisTimeValue = uncurryThis(Date.prototype.getTime);
var PERFORMANCE_MARK = uid('structuredClone');
var DATA_CLONE_ERROR = 'DataCloneError';
var TRANSFERRING = 'Transferring';
var checkBasicSemantic = function checkBasicSemantic(structuredCloneImplementation) {
  return !fails(function () {
    var set1 = new global.Set([7]);
    var set2 = structuredCloneImplementation(set1);
    var number = structuredCloneImplementation(Object(7));
    return set2 == set1 || !set2.has(7) || _typeof(number) != 'object' || number != 7;
  }) && structuredCloneImplementation;
};
var checkErrorsCloning = function checkErrorsCloning(structuredCloneImplementation, $Error) {
  return !fails(function () {
    var error = new $Error();
    var test = structuredCloneImplementation({
      a: error,
      b: error
    });
    return !(test && test.a === test.b && test.a instanceof $Error && test.a.stack === error.stack);
  });
};

// https://github.com/whatwg/html/pull/5749
var checkNewErrorsCloningSemantic = function checkNewErrorsCloningSemantic(structuredCloneImplementation) {
  return !fails(function () {
    var test = structuredCloneImplementation(new global.AggregateError([1], PERFORMANCE_MARK, {
      cause: 3
    }));
    return test.name != 'AggregateError' || test.errors[0] != 1 || test.message != PERFORMANCE_MARK || test.cause != 3;
  });
};

// FF94+, Safari 15.4+, Chrome 98+, NodeJS 17.0+, Deno 1.13+
// FF<103 and Safari implementations can't clone errors
// https://bugzilla.mozilla.org/show_bug.cgi?id=1556604
// FF103 can clone errors, but `.stack` of clone is an empty string
// https://bugzilla.mozilla.org/show_bug.cgi?id=1778762
// FF104+ fixed it on usual errors, but not on DOMExceptions
// https://bugzilla.mozilla.org/show_bug.cgi?id=1777321
// Chrome <102 returns `null` if cloned object contains multiple references to one error
// https://bugs.chromium.org/p/v8/issues/detail?id=12542
// NodeJS implementation can't clone DOMExceptions
// https://github.com/nodejs/node/issues/41038
// only FF103+ supports new (html/5749) error cloning semantic
var nativeStructuredClone = global.structuredClone;
var FORCED_REPLACEMENT = IS_PURE || !checkErrorsCloning(nativeStructuredClone, Error) || !checkErrorsCloning(nativeStructuredClone, DOMException) || !checkNewErrorsCloningSemantic(nativeStructuredClone);

// Chrome 82+, Safari 14.1+, Deno 1.11+
// Chrome 78-81 implementation swaps `.name` and `.message` of cloned `DOMException`
// Chrome returns `null` if cloned object contains multiple references to one error
// Safari 14.1 implementation doesn't clone some `RegExp` flags, so requires a workaround
// Safari implementation can't clone errors
// Deno 1.2-1.10 implementations too naive
// NodeJS 16.0+ does not have `PerformanceMark` constructor
// NodeJS <17.2 structured cloning implementation from `performance.mark` is too naive
// and can't clone, for example, `RegExp` or some boxed primitives
// https://github.com/nodejs/node/issues/40840
// no one of those implementations supports new (html/5749) error cloning semantic
var structuredCloneFromMark = !nativeStructuredClone && checkBasicSemantic(function (value) {
  return new PerformanceMark(PERFORMANCE_MARK, {
    detail: value
  }).detail;
});
var nativeRestrictedStructuredClone = checkBasicSemantic(nativeStructuredClone) || structuredCloneFromMark;
var throwUncloneable = function throwUncloneable(type) {
  throw new DOMException('Uncloneable type: ' + type, DATA_CLONE_ERROR);
};
var throwUnpolyfillable = function throwUnpolyfillable(type, action) {
  throw new DOMException((action || 'Cloning') + ' of ' + type + ' cannot be properly polyfilled in this engine', DATA_CLONE_ERROR);
};
var createDataTransfer = function createDataTransfer() {
  var dataTransfer;
  try {
    dataTransfer = new global.DataTransfer();
  } catch (error) {
    try {
      dataTransfer = new global.ClipboardEvent('').clipboardData;
    } catch (error2) {/* empty */}
  }
  return dataTransfer && dataTransfer.items && dataTransfer.files ? dataTransfer : null;
};
var structuredCloneInternal = function structuredCloneInternal(value, map) {
  if (isSymbol(value)) throwUncloneable('Symbol');
  if (!isObject(value)) return value;
  // effectively preserves circular references
  if (map) {
    if (mapHas(map, value)) return mapGet(map, value);
  } else map = new Map();
  var type = classof(value);
  var deep = false;
  var C, name, cloned, dataTransfer, i, length, keys, key, source, target;
  switch (type) {
    case 'Array':
      cloned = Array(lengthOfArrayLike(value));
      deep = true;
      break;
    case 'Object':
      cloned = {};
      deep = true;
      break;
    case 'Map':
      cloned = new Map();
      deep = true;
      break;
    case 'Set':
      cloned = new Set();
      deep = true;
      break;
    case 'RegExp':
      // in this block because of a Safari 14.1 bug
      // old FF does not clone regexes passed to the constructor, so get the source and flags directly
      cloned = new RegExp(value.source, getRegExpFlags(value));
      break;
    case 'Error':
      name = value.name;
      switch (name) {
        case 'AggregateError':
          cloned = getBuiltin('AggregateError')([]);
          break;
        case 'EvalError':
          cloned = EvalError();
          break;
        case 'RangeError':
          cloned = RangeError();
          break;
        case 'ReferenceError':
          cloned = ReferenceError();
          break;
        case 'SyntaxError':
          cloned = SyntaxError();
          break;
        case 'TypeError':
          cloned = TypeError();
          break;
        case 'URIError':
          cloned = URIError();
          break;
        case 'CompileError':
          cloned = CompileError();
          break;
        case 'LinkError':
          cloned = LinkError();
          break;
        case 'RuntimeError':
          cloned = RuntimeError();
          break;
        default:
          cloned = Error();
      }
      deep = true;
      break;
    case 'DOMException':
      cloned = new DOMException(value.message, value.name);
      deep = true;
      break;
    case 'DataView':
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'BigInt64Array':
    case 'BigUint64Array':
      C = global[type];
      // in some old engines like Safari 9, typeof C is 'object'
      // on Uint8ClampedArray or some other constructors
      if (!isObject(C)) throwUnpolyfillable(type);
      cloned = new C(
      // this is safe, since arraybuffer cannot have circular references
      structuredCloneInternal(value.buffer, map), value.byteOffset, type === 'DataView' ? value.byteLength : value.length);
      break;
    case 'DOMQuad':
      try {
        cloned = new DOMQuad(structuredCloneInternal(value.p1, map), structuredCloneInternal(value.p2, map), structuredCloneInternal(value.p3, map), structuredCloneInternal(value.p4, map));
      } catch (error) {
        if (nativeRestrictedStructuredClone) {
          cloned = nativeRestrictedStructuredClone(value);
        } else throwUnpolyfillable(type);
      }
      break;
    case 'FileList':
      dataTransfer = createDataTransfer();
      if (dataTransfer) {
        for (i = 0, length = lengthOfArrayLike(value); i < length; i++) {
          dataTransfer.items.add(structuredCloneInternal(value[i], map));
        }
        cloned = dataTransfer.files;
      } else if (nativeRestrictedStructuredClone) {
        cloned = nativeRestrictedStructuredClone(value);
      } else throwUnpolyfillable(type);
      break;
    case 'ImageData':
      // Safari 9 ImageData is a constructor, but typeof ImageData is 'object'
      try {
        cloned = new ImageData(structuredCloneInternal(value.data, map), value.width, value.height, {
          colorSpace: value.colorSpace
        });
      } catch (error) {
        if (nativeRestrictedStructuredClone) {
          cloned = nativeRestrictedStructuredClone(value);
        } else throwUnpolyfillable(type);
      }
      break;
    default:
      if (nativeRestrictedStructuredClone) {
        cloned = nativeRestrictedStructuredClone(value);
      } else switch (type) {
        case 'BigInt':
          // can be a 3rd party polyfill
          cloned = Object(value.valueOf());
          break;
        case 'Boolean':
          cloned = Object(thisBooleanValue(value));
          break;
        case 'Number':
          cloned = Object(thisNumberValue(value));
          break;
        case 'String':
          cloned = Object(thisStringValue(value));
          break;
        case 'Date':
          cloned = new Date(thisTimeValue(value));
          break;
        case 'ArrayBuffer':
          C = global.DataView;
          // `ArrayBuffer#slice` is not available in IE10
          // `ArrayBuffer#slice` and `DataView` are not available in old FF
          if (!C && typeof value.slice != 'function') throwUnpolyfillable(type);
          // detached buffers throws in `DataView` and `.slice`
          try {
            if (typeof value.slice == 'function') {
              cloned = value.slice(0);
            } else {
              length = value.byteLength;
              cloned = new ArrayBuffer(length);
              source = new C(value);
              target = new C(cloned);
              for (i = 0; i < length; i++) {
                target.setUint8(i, source.getUint8(i));
              }
            }
          } catch (error) {
            throw new DOMException('ArrayBuffer is detached', DATA_CLONE_ERROR);
          }
          break;
        case 'SharedArrayBuffer':
          // SharedArrayBuffer should use shared memory, we can't polyfill it, so return the original
          cloned = value;
          break;
        case 'Blob':
          try {
            cloned = value.slice(0, value.size, value.type);
          } catch (error) {
            throwUnpolyfillable(type);
          }
          break;
        case 'DOMPoint':
        case 'DOMPointReadOnly':
          C = global[type];
          try {
            cloned = C.fromPoint ? C.fromPoint(value) : new C(value.x, value.y, value.z, value.w);
          } catch (error) {
            throwUnpolyfillable(type);
          }
          break;
        case 'DOMRect':
        case 'DOMRectReadOnly':
          C = global[type];
          try {
            cloned = C.fromRect ? C.fromRect(value) : new C(value.x, value.y, value.width, value.height);
          } catch (error) {
            throwUnpolyfillable(type);
          }
          break;
        case 'DOMMatrix':
        case 'DOMMatrixReadOnly':
          C = global[type];
          try {
            cloned = C.fromMatrix ? C.fromMatrix(value) : new C(value);
          } catch (error) {
            throwUnpolyfillable(type);
          }
          break;
        case 'AudioData':
        case 'VideoFrame':
          if (!isCallable(value.clone)) throwUnpolyfillable(type);
          try {
            cloned = value.clone();
          } catch (error) {
            throwUncloneable(type);
          }
          break;
        case 'File':
          try {
            cloned = new File([value], value.name, value);
          } catch (error) {
            throwUnpolyfillable(type);
          }
          break;
        case 'CropTarget':
        case 'CryptoKey':
        case 'FileSystemDirectoryHandle':
        case 'FileSystemFileHandle':
        case 'FileSystemHandle':
        case 'GPUCompilationInfo':
        case 'GPUCompilationMessage':
        case 'ImageBitmap':
        case 'RTCCertificate':
        case 'WebAssembly.Module':
          throwUnpolyfillable(type);
        // break omitted
        default:
          throwUncloneable(type);
      }
  }
  mapSet(map, value, cloned);
  if (deep) switch (type) {
    case 'Array':
    case 'Object':
      keys = objectKeys(value);
      for (i = 0, length = lengthOfArrayLike(keys); i < length; i++) {
        key = keys[i];
        createProperty(cloned, key, structuredCloneInternal(value[key], map));
      }
      break;
    case 'Map':
      value.forEach(function (v, k) {
        mapSet(cloned, structuredCloneInternal(k, map), structuredCloneInternal(v, map));
      });
      break;
    case 'Set':
      value.forEach(function (v) {
        setAdd(cloned, structuredCloneInternal(v, map));
      });
      break;
    case 'Error':
      createNonEnumerableProperty(cloned, 'message', structuredCloneInternal(value.message, map));
      if (hasOwn(value, 'cause')) {
        createNonEnumerableProperty(cloned, 'cause', structuredCloneInternal(value.cause, map));
      }
      if (name == 'AggregateError') {
        cloned.errors = structuredCloneInternal(value.errors, map);
      }
    // break omitted
    case 'DOMException':
      if (ERROR_STACK_INSTALLABLE) {
        createNonEnumerableProperty(cloned, 'stack', structuredCloneInternal(value.stack, map));
      }
  }
  return cloned;
};
var tryToTransfer = function tryToTransfer(rawTransfer, map) {
  if (!isObject(rawTransfer)) throw TypeError('Transfer option cannot be converted to a sequence');
  var transfer = [];
  iterate(rawTransfer, function (value) {
    push(transfer, anObject(value));
  });
  var i = 0;
  var length = lengthOfArrayLike(transfer);
  var value, type, C, transferredArray, transferred, canvas, context;
  if (PROPER_TRANSFER) {
    transferredArray = nativeStructuredClone(transfer, {
      transfer: transfer
    });
    while (i < length) mapSet(map, transfer[i], transferredArray[i++]);
  } else while (i < length) {
    value = transfer[i++];
    if (mapHas(map, value)) throw new DOMException('Duplicate transferable', DATA_CLONE_ERROR);
    type = classof(value);
    switch (type) {
      case 'ImageBitmap':
        C = global.OffscreenCanvas;
        if (!isConstructor(C)) throwUnpolyfillable(type, TRANSFERRING);
        try {
          canvas = new C(value.width, value.height);
          context = canvas.getContext('bitmaprenderer');
          context.transferFromImageBitmap(value);
          transferred = canvas.transferToImageBitmap();
        } catch (error) {/* empty */}
        break;
      case 'AudioData':
      case 'VideoFrame':
        if (!isCallable(value.clone) || !isCallable(value.close)) throwUnpolyfillable(type, TRANSFERRING);
        try {
          transferred = value.clone();
          value.close();
        } catch (error) {/* empty */}
        break;
      case 'ArrayBuffer':
        if (!isCallable(value.transfer)) throwUnpolyfillable(type, TRANSFERRING);
        transferred = value.transfer();
        break;
      case 'MediaSourceHandle':
      case 'MessagePort':
      case 'OffscreenCanvas':
      case 'ReadableStream':
      case 'TransformStream':
      case 'WritableStream':
        throwUnpolyfillable(type, TRANSFERRING);
    }
    if (transferred === undefined) throw new DOMException('This object cannot be transferred: ' + type, DATA_CLONE_ERROR);
    mapSet(map, value, transferred);
  }
};

// `structuredClone` method
// https://html.spec.whatwg.org/multipage/structured-data.html#dom-structuredclone
$({
  global: true,
  enumerable: true,
  sham: !PROPER_TRANSFER,
  forced: FORCED_REPLACEMENT
}, {
  structuredClone: function structuredClone(value /* , { transfer } */) {
    var options = validateArgumentsLength(arguments.length, 1) > 1 && !isNullOrUndefined(arguments[1]) ? anObject(arguments[1]) : undefined;
    var transfer = options ? options.transfer : undefined;
    var map;
    if (transfer !== undefined) {
      map = new Map();
      tryToTransfer(transfer, map);
    }
    return structuredCloneInternal(value, map);
  }
});

},{"../internals/an-object":11,"../internals/classof":53,"../internals/create-non-enumerable-property":62,"../internals/create-property":64,"../internals/error-stack-installable":95,"../internals/export":97,"../internals/fails":98,"../internals/function-uncurry-this":110,"../internals/get-built-in":113,"../internals/global":122,"../internals/has-own-property":123,"../internals/is-callable":138,"../internals/is-constructor":139,"../internals/is-null-or-undefined":143,"../internals/is-object":144,"../internals/is-pure":145,"../internals/is-symbol":148,"../internals/iterate":150,"../internals/length-of-array-like":158,"../internals/map-helpers":160,"../internals/regexp-get-flags":208,"../internals/set-helpers":217,"../internals/structured-clone-proper-transfer":243,"../internals/uid":269,"../internals/validate-arguments-length":273}],625:[function(require,module,exports){
"use strict";

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
require('../modules/web.set-interval');
require('../modules/web.set-timeout');

},{"../modules/web.set-interval":622,"../modules/web.set-timeout":623}],626:[function(require,module,exports){
'use strict';

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
require('../modules/es.array.iterator');
var $ = require('../internals/export');
var global = require('../internals/global');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var DESCRIPTORS = require('../internals/descriptors');
var USE_NATIVE_URL = require('../internals/url-constructor-detection');
var defineBuiltIn = require('../internals/define-built-in');
var defineBuiltIns = require('../internals/define-built-ins');
var setToStringTag = require('../internals/set-to-string-tag');
var createIteratorConstructor = require('../internals/iterator-create-constructor');
var InternalStateModule = require('../internals/internal-state');
var anInstance = require('../internals/an-instance');
var isCallable = require('../internals/is-callable');
var hasOwn = require('../internals/has-own-property');
var bind = require('../internals/function-bind-context');
var classof = require('../internals/classof');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var $toString = require('../internals/to-string');
var create = require('../internals/object-create');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var getIterator = require('../internals/get-iterator');
var getIteratorMethod = require('../internals/get-iterator-method');
var validateArgumentsLength = require('../internals/validate-arguments-length');
var wellKnownSymbol = require('../internals/well-known-symbol');
var arraySort = require('../internals/array-sort');
var ITERATOR = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState = InternalStateModule.set;
var getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR);
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Avoid NodeJS experimental warning
var safeGetBuiltIn = function safeGetBuiltIn(name) {
  if (!DESCRIPTORS) return global[name];
  var descriptor = getOwnPropertyDescriptor(global, name);
  return descriptor && descriptor.value;
};
var nativeFetch = safeGetBuiltIn('fetch');
var NativeRequest = safeGetBuiltIn('Request');
var Headers = safeGetBuiltIn('Headers');
var RequestPrototype = NativeRequest && NativeRequest.prototype;
var HeadersPrototype = Headers && Headers.prototype;
var RegExp = global.RegExp;
var TypeError = global.TypeError;
var decodeURIComponent = global.decodeURIComponent;
var encodeURIComponent = global.encodeURIComponent;
var charAt = uncurryThis(''.charAt);
var join = uncurryThis([].join);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var shift = uncurryThis([].shift);
var splice = uncurryThis([].splice);
var split = uncurryThis(''.split);
var stringSlice = uncurryThis(''.slice);
var plus = /\+/g;
var sequences = Array(4);
var percentSequence = function percentSequence(bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};
var percentDecode = function percentDecode(sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};
var deserialize = function deserialize(it) {
  var result = replace(it, plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = replace(result, percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};
var find = /[!'()~]|%20/g;
var replacements = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};
var replacer = function replacer(match) {
  return replacements[match];
};
var _serialize = function serialize(it) {
  return replace(encodeURIComponent(it), find, replacer);
};
var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  }
  return step;
}, true);
var URLSearchParamsState = function URLSearchParamsState(init) {
  this.entries = [];
  this.url = null;
  if (init !== undefined) {
    if (isObject(init)) this.parseObject(init);else this.parseQuery(typeof init == 'string' ? charAt(init, 0) === '?' ? stringSlice(init, 1) : init : $toString(init));
  }
};
URLSearchParamsState.prototype = {
  type: URL_SEARCH_PARAMS,
  bindURL: function bindURL(url) {
    this.url = url;
    this.update();
  },
  parseObject: function parseObject(object) {
    var iteratorMethod = getIteratorMethod(object);
    var iterator, next, step, entryIterator, entryNext, first, second;
    if (iteratorMethod) {
      iterator = getIterator(object, iteratorMethod);
      next = iterator.next;
      while (!(step = call(next, iterator)).done) {
        entryIterator = getIterator(anObject(step.value));
        entryNext = entryIterator.next;
        if ((first = call(entryNext, entryIterator)).done || (second = call(entryNext, entryIterator)).done || !call(entryNext, entryIterator).done) throw TypeError('Expected sequence with length 2');
        push(this.entries, {
          key: $toString(first.value),
          value: $toString(second.value)
        });
      }
    } else for (var key in object) if (hasOwn(object, key)) {
      push(this.entries, {
        key: key,
        value: $toString(object[key])
      });
    }
  },
  parseQuery: function parseQuery(query) {
    if (query) {
      var attributes = split(query, '&');
      var index = 0;
      var attribute, entry;
      while (index < attributes.length) {
        attribute = attributes[index++];
        if (attribute.length) {
          entry = split(attribute, '=');
          push(this.entries, {
            key: deserialize(shift(entry)),
            value: deserialize(join(entry, '='))
          });
        }
      }
    }
  },
  serialize: function serialize() {
    var entries = this.entries;
    var result = [];
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      push(result, _serialize(entry.key) + '=' + _serialize(entry.value));
    }
    return join(result, '&');
  },
  update: function update() {
    this.entries.length = 0;
    this.parseQuery(this.url.query);
  },
  updateURL: function updateURL() {
    if (this.url) this.url.update();
  }
};

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams( /* init */
) {
  anInstance(this, URLSearchParamsPrototype);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  setInternalState(this, new URLSearchParamsState(init));
};
var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;
defineBuiltIns(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    push(state.entries, {
      key: $toString(name),
      value: $toString(value)
    });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function _delete(name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = $toString(name);
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) splice(entries, index, 1);else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = $toString(name);
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = $toString(name);
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) push(result, entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = $toString(name);
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = $toString(name);
    var val = $toString(value);
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) splice(entries, index--, 1);else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) push(entries, {
      key: key,
      value: val
    });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    arraySort(state.entries, function (a, b) {
      return a.key > b.key ? 1 : -1;
    });
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, {
  enumerable: true
});

// `URLSearchParams.prototype[@@iterator]` method
defineBuiltIn(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries, {
  name: 'entries'
});

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
defineBuiltIn(URLSearchParamsPrototype, 'toString', function toString() {
  return getInternalParamsState(this).serialize();
}, {
  enumerable: true
});
setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);
$({
  global: true,
  constructor: true,
  forced: !USE_NATIVE_URL
}, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
if (!USE_NATIVE_URL && isCallable(Headers)) {
  var headersHas = uncurryThis(HeadersPrototype.has);
  var headersSet = uncurryThis(HeadersPrototype.set);
  var wrapRequestOptions = function wrapRequestOptions(init) {
    if (isObject(init)) {
      var body = init.body;
      var headers;
      if (classof(body) === URL_SEARCH_PARAMS) {
        headers = init.headers ? new Headers(init.headers) : new Headers();
        if (!headersHas(headers, 'content-type')) {
          headersSet(headers, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
        return create(init, {
          body: createPropertyDescriptor(0, $toString(body)),
          headers: createPropertyDescriptor(0, headers)
        });
      }
    }
    return init;
  };
  if (isCallable(nativeFetch)) {
    $({
      global: true,
      enumerable: true,
      dontCallGetSet: true,
      forced: true
    }, {
      fetch: function fetch(input /* , init */) {
        return nativeFetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
      }
    });
  }
  if (isCallable(NativeRequest)) {
    var RequestConstructor = function Request(input /* , init */) {
      anInstance(this, RequestPrototype);
      return new NativeRequest(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
    };
    RequestPrototype.constructor = RequestConstructor;
    RequestConstructor.prototype = RequestPrototype;
    $({
      global: true,
      constructor: true,
      dontCallGetSet: true,
      forced: true
    }, {
      Request: RequestConstructor
    });
  }
}
module.exports = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};

},{"../internals/an-instance":10,"../internals/an-object":11,"../internals/array-sort":37,"../internals/classof":53,"../internals/create-property-descriptor":63,"../internals/define-built-in":68,"../internals/define-built-ins":69,"../internals/descriptors":72,"../internals/export":97,"../internals/function-bind-context":103,"../internals/function-call":106,"../internals/function-uncurry-this":110,"../internals/get-iterator":117,"../internals/get-iterator-method":116,"../internals/global":122,"../internals/has-own-property":123,"../internals/internal-state":134,"../internals/is-callable":138,"../internals/is-object":144,"../internals/iterator-create-constructor":152,"../internals/object-create":177,"../internals/set-to-string-tag":227,"../internals/to-string":261,"../internals/url-constructor-detection":270,"../internals/validate-arguments-length":273,"../internals/well-known-symbol":277,"../modules/es.array.iterator":303}],627:[function(require,module,exports){
"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
require('../modules/web.url-search-params.constructor');

},{"../modules/web.url-search-params.constructor":626}],628:[function(require,module,exports){
'use strict';

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
require('../modules/es.string.iterator');
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var USE_NATIVE_URL = require('../internals/url-constructor-detection');
var global = require('../internals/global');
var bind = require('../internals/function-bind-context');
var uncurryThis = require('../internals/function-uncurry-this');
var defineBuiltIn = require('../internals/define-built-in');
var defineBuiltInAccessor = require('../internals/define-built-in-accessor');
var anInstance = require('../internals/an-instance');
var hasOwn = require('../internals/has-own-property');
var assign = require('../internals/object-assign');
var arrayFrom = require('../internals/array-from');
var arraySlice = require('../internals/array-slice-simple');
var codeAt = require('../internals/string-multibyte').codeAt;
var toASCII = require('../internals/string-punycode-to-ascii');
var $toString = require('../internals/to-string');
var setToStringTag = require('../internals/set-to-string-tag');
var validateArgumentsLength = require('../internals/validate-arguments-length');
var URLSearchParamsModule = require('../modules/web.url-search-params.constructor');
var InternalStateModule = require('../internals/internal-state');
var setInternalState = InternalStateModule.set;
var getInternalURLState = InternalStateModule.getterFor('URL');
var URLSearchParams = URLSearchParamsModule.URLSearchParams;
var getInternalSearchParamsState = URLSearchParamsModule.getState;
var NativeURL = global.URL;
var TypeError = global.TypeError;
var parseInt = global.parseInt;
var floor = Math.floor;
var pow = Math.pow;
var charAt = uncurryThis(''.charAt);
var exec = uncurryThis(/./.exec);
var join = uncurryThis([].join);
var numberToString = uncurryThis(1.0.toString);
var pop = uncurryThis([].pop);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var shift = uncurryThis([].shift);
var split = uncurryThis(''.split);
var stringSlice = uncurryThis(''.slice);
var toLowerCase = uncurryThis(''.toLowerCase);
var unshift = uncurryThis([].unshift);
var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';
var ALPHA = /[a-z]/i;
// eslint-disable-next-line regexp/no-obscure-range -- safe
var ALPHANUMERIC = /[\d+-.a-z]/i;
var DIGIT = /\d/;
var HEX_START = /^0x/i;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\da-f]+$/i;
/* eslint-disable regexp/no-control-character -- safe */
var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
var LEADING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+/;
var TRAILING_C0_CONTROL_OR_SPACE = /(^|[^\u0000-\u0020])[\u0000-\u0020]+$/;
var TAB_AND_NEW_LINE = /[\t\n\r]/g;
/* eslint-enable regexp/no-control-character -- safe */
var EOF;

// https://url.spec.whatwg.org/#ipv4-number-parser
var parseIPv4 = function parseIPv4(input) {
  var parts = split(input, '.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.length--;
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && charAt(part, 0) == '0') {
      radix = exec(HEX_START, part) ? 16 : 8;
      part = stringSlice(part, radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!exec(radix == 10 ? DEC : radix == 8 ? OCT : HEX, part)) return input;
      number = parseInt(part, radix);
    }
    push(numbers, number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = pop(numbers);
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// https://url.spec.whatwg.org/#concept-ipv6-parser
// eslint-disable-next-line max-statements -- TODO
var parseIPv6 = function parseIPv6(input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;
  var chr = function chr() {
    return charAt(input, pointer);
  };
  if (chr() == ':') {
    if (charAt(input, 1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (chr()) {
    if (pieceIndex == 8) return;
    if (chr() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && exec(HEX, chr())) {
      value = value * 16 + parseInt(chr(), 16);
      pointer++;
      length++;
    }
    if (chr() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (chr()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (chr() == '.' && numbersSeen < 4) pointer++;else return;
        }
        if (!exec(DIGIT, chr())) return;
        while (exec(DIGIT, chr())) {
          number = parseInt(chr(), 10);
          if (ipv4Piece === null) ipv4Piece = number;else if (ipv4Piece == 0) return;else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (chr() == ':') {
      pointer++;
      if (!chr()) return;
    } else if (chr()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};
var findLongestZeroSequence = function findLongestZeroSequence(ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

// https://url.spec.whatwg.org/#host-serializing
var serializeHost = function serializeHost(host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      unshift(result, host % 256);
      host = floor(host / 256);
    }
    return join(result, '.');
    // ipv6
  } else if (_typeof(host) == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += numberToString(host[index], 16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  }
  return host;
};
var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1,
  '"': 1,
  '<': 1,
  '>': 1,
  '`': 1
});
var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
  '#': 1,
  '?': 1,
  '{': 1,
  '}': 1
});
var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
  '/': 1,
  ':': 1,
  ';': 1,
  '=': 1,
  '@': 1,
  '[': 1,
  '\\': 1,
  ']': 1,
  '^': 1,
  '|': 1
});
var percentEncode = function percentEncode(chr, set) {
  var code = codeAt(chr, 0);
  return code > 0x20 && code < 0x7F && !hasOwn(set, chr) ? chr : encodeURIComponent(chr);
};

// https://url.spec.whatwg.org/#special-scheme
var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

// https://url.spec.whatwg.org/#windows-drive-letter
var isWindowsDriveLetter = function isWindowsDriveLetter(string, normalized) {
  var second;
  return string.length == 2 && exec(ALPHA, charAt(string, 0)) && ((second = charAt(string, 1)) == ':' || !normalized && second == '|');
};

// https://url.spec.whatwg.org/#start-with-a-windows-drive-letter
var startsWithWindowsDriveLetter = function startsWithWindowsDriveLetter(string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(stringSlice(string, 0, 2)) && (string.length == 2 || (third = charAt(string, 2)) === '/' || third === '\\' || third === '?' || third === '#');
};

// https://url.spec.whatwg.org/#single-dot-path-segment
var isSingleDot = function isSingleDot(segment) {
  return segment === '.' || toLowerCase(segment) === '%2e';
};

// https://url.spec.whatwg.org/#double-dot-path-segment
var isDoubleDot = function isDoubleDot(segment) {
  segment = toLowerCase(segment);
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};
var URLState = function URLState(url, isBase, base) {
  var urlString = $toString(url);
  var baseState, failure, searchParams;
  if (isBase) {
    failure = this.parse(urlString);
    if (failure) throw TypeError(failure);
    this.searchParams = null;
  } else {
    if (base !== undefined) baseState = new URLState(base, true);
    failure = this.parse(urlString, null, baseState);
    if (failure) throw TypeError(failure);
    searchParams = getInternalSearchParamsState(new URLSearchParams());
    searchParams.bindURL(this);
    this.searchParams = searchParams;
  }
};
URLState.prototype = {
  type: 'URL',
  // https://url.spec.whatwg.org/#url-parsing
  // eslint-disable-next-line max-statements -- TODO
  parse: function parse(input, stateOverride, base) {
    var url = this;
    var state = stateOverride || SCHEME_START;
    var pointer = 0;
    var buffer = '';
    var seenAt = false;
    var seenBracket = false;
    var seenPasswordToken = false;
    var codePoints, chr, bufferCodePoints, failure;
    input = $toString(input);
    if (!stateOverride) {
      url.scheme = '';
      url.username = '';
      url.password = '';
      url.host = null;
      url.port = null;
      url.path = [];
      url.query = null;
      url.fragment = null;
      url.cannotBeABaseURL = false;
      input = replace(input, LEADING_C0_CONTROL_OR_SPACE, '');
      input = replace(input, TRAILING_C0_CONTROL_OR_SPACE, '$1');
    }
    input = replace(input, TAB_AND_NEW_LINE, '');
    codePoints = arrayFrom(input);
    while (pointer <= codePoints.length) {
      chr = codePoints[pointer];
      switch (state) {
        case SCHEME_START:
          if (chr && exec(ALPHA, chr)) {
            buffer += toLowerCase(chr);
            state = SCHEME;
          } else if (!stateOverride) {
            state = NO_SCHEME;
            continue;
          } else return INVALID_SCHEME;
          break;
        case SCHEME:
          if (chr && (exec(ALPHANUMERIC, chr) || chr == '+' || chr == '-' || chr == '.')) {
            buffer += toLowerCase(chr);
          } else if (chr == ':') {
            if (stateOverride && (url.isSpecial() != hasOwn(specialSchemes, buffer) || buffer == 'file' && (url.includesCredentials() || url.port !== null) || url.scheme == 'file' && !url.host)) return;
            url.scheme = buffer;
            if (stateOverride) {
              if (url.isSpecial() && specialSchemes[url.scheme] == url.port) url.port = null;
              return;
            }
            buffer = '';
            if (url.scheme == 'file') {
              state = FILE;
            } else if (url.isSpecial() && base && base.scheme == url.scheme) {
              state = SPECIAL_RELATIVE_OR_AUTHORITY;
            } else if (url.isSpecial()) {
              state = SPECIAL_AUTHORITY_SLASHES;
            } else if (codePoints[pointer + 1] == '/') {
              state = PATH_OR_AUTHORITY;
              pointer++;
            } else {
              url.cannotBeABaseURL = true;
              push(url.path, '');
              state = CANNOT_BE_A_BASE_URL_PATH;
            }
          } else if (!stateOverride) {
            buffer = '';
            state = NO_SCHEME;
            pointer = 0;
            continue;
          } else return INVALID_SCHEME;
          break;
        case NO_SCHEME:
          if (!base || base.cannotBeABaseURL && chr != '#') return INVALID_SCHEME;
          if (base.cannotBeABaseURL && chr == '#') {
            url.scheme = base.scheme;
            url.path = arraySlice(base.path);
            url.query = base.query;
            url.fragment = '';
            url.cannotBeABaseURL = true;
            state = FRAGMENT;
            break;
          }
          state = base.scheme == 'file' ? FILE : RELATIVE;
          continue;
        case SPECIAL_RELATIVE_OR_AUTHORITY:
          if (chr == '/' && codePoints[pointer + 1] == '/') {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            pointer++;
          } else {
            state = RELATIVE;
            continue;
          }
          break;
        case PATH_OR_AUTHORITY:
          if (chr == '/') {
            state = AUTHORITY;
            break;
          } else {
            state = PATH;
            continue;
          }
        case RELATIVE:
          url.scheme = base.scheme;
          if (chr == EOF) {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = base.query;
          } else if (chr == '/' || chr == '\\' && url.isSpecial()) {
            state = RELATIVE_SLASH;
          } else if (chr == '?') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = '';
            state = QUERY;
          } else if (chr == '#') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.path.length--;
            state = PATH;
            continue;
          }
          break;
        case RELATIVE_SLASH:
          if (url.isSpecial() && (chr == '/' || chr == '\\')) {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          } else if (chr == '/') {
            state = AUTHORITY;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            state = PATH;
            continue;
          }
          break;
        case SPECIAL_AUTHORITY_SLASHES:
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          if (chr != '/' || charAt(buffer, pointer + 1) != '/') continue;
          pointer++;
          break;
        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
          if (chr != '/' && chr != '\\') {
            state = AUTHORITY;
            continue;
          }
          break;
        case AUTHORITY:
          if (chr == '@') {
            if (seenAt) buffer = '%40' + buffer;
            seenAt = true;
            bufferCodePoints = arrayFrom(buffer);
            for (var i = 0; i < bufferCodePoints.length; i++) {
              var codePoint = bufferCodePoints[i];
              if (codePoint == ':' && !seenPasswordToken) {
                seenPasswordToken = true;
                continue;
              }
              var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
              if (seenPasswordToken) url.password += encodedCodePoints;else url.username += encodedCodePoints;
            }
            buffer = '';
          } else if (chr == EOF || chr == '/' || chr == '?' || chr == '#' || chr == '\\' && url.isSpecial()) {
            if (seenAt && buffer == '') return INVALID_AUTHORITY;
            pointer -= arrayFrom(buffer).length + 1;
            buffer = '';
            state = HOST;
          } else buffer += chr;
          break;
        case HOST:
        case HOSTNAME:
          if (stateOverride && url.scheme == 'file') {
            state = FILE_HOST;
            continue;
          } else if (chr == ':' && !seenBracket) {
            if (buffer == '') return INVALID_HOST;
            failure = url.parseHost(buffer);
            if (failure) return failure;
            buffer = '';
            state = PORT;
            if (stateOverride == HOSTNAME) return;
          } else if (chr == EOF || chr == '/' || chr == '?' || chr == '#' || chr == '\\' && url.isSpecial()) {
            if (url.isSpecial() && buffer == '') return INVALID_HOST;
            if (stateOverride && buffer == '' && (url.includesCredentials() || url.port !== null)) return;
            failure = url.parseHost(buffer);
            if (failure) return failure;
            buffer = '';
            state = PATH_START;
            if (stateOverride) return;
            continue;
          } else {
            if (chr == '[') seenBracket = true;else if (chr == ']') seenBracket = false;
            buffer += chr;
          }
          break;
        case PORT:
          if (exec(DIGIT, chr)) {
            buffer += chr;
          } else if (chr == EOF || chr == '/' || chr == '?' || chr == '#' || chr == '\\' && url.isSpecial() || stateOverride) {
            if (buffer != '') {
              var port = parseInt(buffer, 10);
              if (port > 0xFFFF) return INVALID_PORT;
              url.port = url.isSpecial() && port === specialSchemes[url.scheme] ? null : port;
              buffer = '';
            }
            if (stateOverride) return;
            state = PATH_START;
            continue;
          } else return INVALID_PORT;
          break;
        case FILE:
          url.scheme = 'file';
          if (chr == '/' || chr == '\\') state = FILE_SLASH;else if (base && base.scheme == 'file') {
            if (chr == EOF) {
              url.host = base.host;
              url.path = arraySlice(base.path);
              url.query = base.query;
            } else if (chr == '?') {
              url.host = base.host;
              url.path = arraySlice(base.path);
              url.query = '';
              state = QUERY;
            } else if (chr == '#') {
              url.host = base.host;
              url.path = arraySlice(base.path);
              url.query = base.query;
              url.fragment = '';
              state = FRAGMENT;
            } else {
              if (!startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
                url.host = base.host;
                url.path = arraySlice(base.path);
                url.shortenPath();
              }
              state = PATH;
              continue;
            }
          } else {
            state = PATH;
            continue;
          }
          break;
        case FILE_SLASH:
          if (chr == '/' || chr == '\\') {
            state = FILE_HOST;
            break;
          }
          if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
            if (isWindowsDriveLetter(base.path[0], true)) push(url.path, base.path[0]);else url.host = base.host;
          }
          state = PATH;
          continue;
        case FILE_HOST:
          if (chr == EOF || chr == '/' || chr == '\\' || chr == '?' || chr == '#') {
            if (!stateOverride && isWindowsDriveLetter(buffer)) {
              state = PATH;
            } else if (buffer == '') {
              url.host = '';
              if (stateOverride) return;
              state = PATH_START;
            } else {
              failure = url.parseHost(buffer);
              if (failure) return failure;
              if (url.host == 'localhost') url.host = '';
              if (stateOverride) return;
              buffer = '';
              state = PATH_START;
            }
            continue;
          } else buffer += chr;
          break;
        case PATH_START:
          if (url.isSpecial()) {
            state = PATH;
            if (chr != '/' && chr != '\\') continue;
          } else if (!stateOverride && chr == '?') {
            url.query = '';
            state = QUERY;
          } else if (!stateOverride && chr == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr != EOF) {
            state = PATH;
            if (chr != '/') continue;
          }
          break;
        case PATH:
          if (chr == EOF || chr == '/' || chr == '\\' && url.isSpecial() || !stateOverride && (chr == '?' || chr == '#')) {
            if (isDoubleDot(buffer)) {
              url.shortenPath();
              if (chr != '/' && !(chr == '\\' && url.isSpecial())) {
                push(url.path, '');
              }
            } else if (isSingleDot(buffer)) {
              if (chr != '/' && !(chr == '\\' && url.isSpecial())) {
                push(url.path, '');
              }
            } else {
              if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                if (url.host) url.host = '';
                buffer = charAt(buffer, 0) + ':'; // normalize windows drive letter
              }

              push(url.path, buffer);
            }
            buffer = '';
            if (url.scheme == 'file' && (chr == EOF || chr == '?' || chr == '#')) {
              while (url.path.length > 1 && url.path[0] === '') {
                shift(url.path);
              }
            }
            if (chr == '?') {
              url.query = '';
              state = QUERY;
            } else if (chr == '#') {
              url.fragment = '';
              state = FRAGMENT;
            }
          } else {
            buffer += percentEncode(chr, pathPercentEncodeSet);
          }
          break;
        case CANNOT_BE_A_BASE_URL_PATH:
          if (chr == '?') {
            url.query = '';
            state = QUERY;
          } else if (chr == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr != EOF) {
            url.path[0] += percentEncode(chr, C0ControlPercentEncodeSet);
          }
          break;
        case QUERY:
          if (!stateOverride && chr == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr != EOF) {
            if (chr == "'" && url.isSpecial()) url.query += '%27';else if (chr == '#') url.query += '%23';else url.query += percentEncode(chr, C0ControlPercentEncodeSet);
          }
          break;
        case FRAGMENT:
          if (chr != EOF) url.fragment += percentEncode(chr, fragmentPercentEncodeSet);
          break;
      }
      pointer++;
    }
  },
  // https://url.spec.whatwg.org/#host-parsing
  parseHost: function parseHost(input) {
    var result, codePoints, index;
    if (charAt(input, 0) == '[') {
      if (charAt(input, input.length - 1) != ']') return INVALID_HOST;
      result = parseIPv6(stringSlice(input, 1, -1));
      if (!result) return INVALID_HOST;
      this.host = result;
      // opaque host
    } else if (!this.isSpecial()) {
      if (exec(FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT, input)) return INVALID_HOST;
      result = '';
      codePoints = arrayFrom(input);
      for (index = 0; index < codePoints.length; index++) {
        result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
      }
      this.host = result;
    } else {
      input = toASCII(input);
      if (exec(FORBIDDEN_HOST_CODE_POINT, input)) return INVALID_HOST;
      result = parseIPv4(input);
      if (result === null) return INVALID_HOST;
      this.host = result;
    }
  },
  // https://url.spec.whatwg.org/#cannot-have-a-username-password-port
  cannotHaveUsernamePasswordPort: function cannotHaveUsernamePasswordPort() {
    return !this.host || this.cannotBeABaseURL || this.scheme == 'file';
  },
  // https://url.spec.whatwg.org/#include-credentials
  includesCredentials: function includesCredentials() {
    return this.username != '' || this.password != '';
  },
  // https://url.spec.whatwg.org/#is-special
  isSpecial: function isSpecial() {
    return hasOwn(specialSchemes, this.scheme);
  },
  // https://url.spec.whatwg.org/#shorten-a-urls-path
  shortenPath: function shortenPath() {
    var path = this.path;
    var pathSize = path.length;
    if (pathSize && (this.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
      path.length--;
    }
  },
  // https://url.spec.whatwg.org/#concept-url-serializer
  serialize: function serialize() {
    var url = this;
    var scheme = url.scheme;
    var username = url.username;
    var password = url.password;
    var host = url.host;
    var port = url.port;
    var path = url.path;
    var query = url.query;
    var fragment = url.fragment;
    var output = scheme + ':';
    if (host !== null) {
      output += '//';
      if (url.includesCredentials()) {
        output += username + (password ? ':' + password : '') + '@';
      }
      output += serializeHost(host);
      if (port !== null) output += ':' + port;
    } else if (scheme == 'file') output += '//';
    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
    if (query !== null) output += '?' + query;
    if (fragment !== null) output += '#' + fragment;
    return output;
  },
  // https://url.spec.whatwg.org/#dom-url-href
  setHref: function setHref(href) {
    var failure = this.parse(href);
    if (failure) throw TypeError(failure);
    this.searchParams.update();
  },
  // https://url.spec.whatwg.org/#dom-url-origin
  getOrigin: function getOrigin() {
    var scheme = this.scheme;
    var port = this.port;
    if (scheme == 'blob') try {
      return new URLConstructor(scheme.path[0]).origin;
    } catch (error) {
      return 'null';
    }
    if (scheme == 'file' || !this.isSpecial()) return 'null';
    return scheme + '://' + serializeHost(this.host) + (port !== null ? ':' + port : '');
  },
  // https://url.spec.whatwg.org/#dom-url-protocol
  getProtocol: function getProtocol() {
    return this.scheme + ':';
  },
  setProtocol: function setProtocol(protocol) {
    this.parse($toString(protocol) + ':', SCHEME_START);
  },
  // https://url.spec.whatwg.org/#dom-url-username
  getUsername: function getUsername() {
    return this.username;
  },
  setUsername: function setUsername(username) {
    var codePoints = arrayFrom($toString(username));
    if (this.cannotHaveUsernamePasswordPort()) return;
    this.username = '';
    for (var i = 0; i < codePoints.length; i++) {
      this.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
    }
  },
  // https://url.spec.whatwg.org/#dom-url-password
  getPassword: function getPassword() {
    return this.password;
  },
  setPassword: function setPassword(password) {
    var codePoints = arrayFrom($toString(password));
    if (this.cannotHaveUsernamePasswordPort()) return;
    this.password = '';
    for (var i = 0; i < codePoints.length; i++) {
      this.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
    }
  },
  // https://url.spec.whatwg.org/#dom-url-host
  getHost: function getHost() {
    var host = this.host;
    var port = this.port;
    return host === null ? '' : port === null ? serializeHost(host) : serializeHost(host) + ':' + port;
  },
  setHost: function setHost(host) {
    if (this.cannotBeABaseURL) return;
    this.parse(host, HOST);
  },
  // https://url.spec.whatwg.org/#dom-url-hostname
  getHostname: function getHostname() {
    var host = this.host;
    return host === null ? '' : serializeHost(host);
  },
  setHostname: function setHostname(hostname) {
    if (this.cannotBeABaseURL) return;
    this.parse(hostname, HOSTNAME);
  },
  // https://url.spec.whatwg.org/#dom-url-port
  getPort: function getPort() {
    var port = this.port;
    return port === null ? '' : $toString(port);
  },
  setPort: function setPort(port) {
    if (this.cannotHaveUsernamePasswordPort()) return;
    port = $toString(port);
    if (port == '') this.port = null;else this.parse(port, PORT);
  },
  // https://url.spec.whatwg.org/#dom-url-pathname
  getPathname: function getPathname() {
    var path = this.path;
    return this.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
  },
  setPathname: function setPathname(pathname) {
    if (this.cannotBeABaseURL) return;
    this.path = [];
    this.parse(pathname, PATH_START);
  },
  // https://url.spec.whatwg.org/#dom-url-search
  getSearch: function getSearch() {
    var query = this.query;
    return query ? '?' + query : '';
  },
  setSearch: function setSearch(search) {
    search = $toString(search);
    if (search == '') {
      this.query = null;
    } else {
      if ('?' == charAt(search, 0)) search = stringSlice(search, 1);
      this.query = '';
      this.parse(search, QUERY);
    }
    this.searchParams.update();
  },
  // https://url.spec.whatwg.org/#dom-url-searchparams
  getSearchParams: function getSearchParams() {
    return this.searchParams.facade;
  },
  // https://url.spec.whatwg.org/#dom-url-hash
  getHash: function getHash() {
    var fragment = this.fragment;
    return fragment ? '#' + fragment : '';
  },
  setHash: function setHash(hash) {
    hash = $toString(hash);
    if (hash == '') {
      this.fragment = null;
      return;
    }
    if ('#' == charAt(hash, 0)) hash = stringSlice(hash, 1);
    this.fragment = '';
    this.parse(hash, FRAGMENT);
  },
  update: function update() {
    this.query = this.searchParams.serialize() || null;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLPrototype);
  var base = validateArgumentsLength(arguments.length, 1) > 1 ? arguments[1] : undefined;
  var state = setInternalState(that, new URLState(url, false, base));
  if (!DESCRIPTORS) {
    that.href = state.serialize();
    that.origin = state.getOrigin();
    that.protocol = state.getProtocol();
    that.username = state.getUsername();
    that.password = state.getPassword();
    that.host = state.getHost();
    that.hostname = state.getHostname();
    that.port = state.getPort();
    that.pathname = state.getPathname();
    that.search = state.getSearch();
    that.searchParams = state.getSearchParams();
    that.hash = state.getHash();
  }
};
var URLPrototype = URLConstructor.prototype;
var accessorDescriptor = function accessorDescriptor(getter, setter) {
  return {
    get: function get() {
      return getInternalURLState(this)[getter]();
    },
    set: setter && function (value) {
      return getInternalURLState(this)[setter](value);
    },
    configurable: true,
    enumerable: true
  };
};
if (DESCRIPTORS) {
  // `URL.prototype.href` accessors pair
  // https://url.spec.whatwg.org/#dom-url-href
  defineBuiltInAccessor(URLPrototype, 'href', accessorDescriptor('serialize', 'setHref'));
  // `URL.prototype.origin` getter
  // https://url.spec.whatwg.org/#dom-url-origin
  defineBuiltInAccessor(URLPrototype, 'origin', accessorDescriptor('getOrigin'));
  // `URL.prototype.protocol` accessors pair
  // https://url.spec.whatwg.org/#dom-url-protocol
  defineBuiltInAccessor(URLPrototype, 'protocol', accessorDescriptor('getProtocol', 'setProtocol'));
  // `URL.prototype.username` accessors pair
  // https://url.spec.whatwg.org/#dom-url-username
  defineBuiltInAccessor(URLPrototype, 'username', accessorDescriptor('getUsername', 'setUsername'));
  // `URL.prototype.password` accessors pair
  // https://url.spec.whatwg.org/#dom-url-password
  defineBuiltInAccessor(URLPrototype, 'password', accessorDescriptor('getPassword', 'setPassword'));
  // `URL.prototype.host` accessors pair
  // https://url.spec.whatwg.org/#dom-url-host
  defineBuiltInAccessor(URLPrototype, 'host', accessorDescriptor('getHost', 'setHost'));
  // `URL.prototype.hostname` accessors pair
  // https://url.spec.whatwg.org/#dom-url-hostname
  defineBuiltInAccessor(URLPrototype, 'hostname', accessorDescriptor('getHostname', 'setHostname'));
  // `URL.prototype.port` accessors pair
  // https://url.spec.whatwg.org/#dom-url-port
  defineBuiltInAccessor(URLPrototype, 'port', accessorDescriptor('getPort', 'setPort'));
  // `URL.prototype.pathname` accessors pair
  // https://url.spec.whatwg.org/#dom-url-pathname
  defineBuiltInAccessor(URLPrototype, 'pathname', accessorDescriptor('getPathname', 'setPathname'));
  // `URL.prototype.search` accessors pair
  // https://url.spec.whatwg.org/#dom-url-search
  defineBuiltInAccessor(URLPrototype, 'search', accessorDescriptor('getSearch', 'setSearch'));
  // `URL.prototype.searchParams` getter
  // https://url.spec.whatwg.org/#dom-url-searchparams
  defineBuiltInAccessor(URLPrototype, 'searchParams', accessorDescriptor('getSearchParams'));
  // `URL.prototype.hash` accessors pair
  // https://url.spec.whatwg.org/#dom-url-hash
  defineBuiltInAccessor(URLPrototype, 'hash', accessorDescriptor('getHash', 'setHash'));
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
defineBuiltIn(URLPrototype, 'toJSON', function toJSON() {
  return getInternalURLState(this).serialize();
}, {
  enumerable: true
});

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
defineBuiltIn(URLPrototype, 'toString', function toString() {
  return getInternalURLState(this).serialize();
}, {
  enumerable: true
});
if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  if (nativeCreateObjectURL) defineBuiltIn(URLConstructor, 'createObjectURL', bind(nativeCreateObjectURL, NativeURL));
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  if (nativeRevokeObjectURL) defineBuiltIn(URLConstructor, 'revokeObjectURL', bind(nativeRevokeObjectURL, NativeURL));
}
setToStringTag(URLConstructor, 'URL');
$({
  global: true,
  constructor: true,
  forced: !USE_NATIVE_URL,
  sham: !DESCRIPTORS
}, {
  URL: URLConstructor
});

},{"../internals/an-instance":10,"../internals/array-from":24,"../internals/array-slice-simple":35,"../internals/define-built-in":68,"../internals/define-built-in-accessor":67,"../internals/descriptors":72,"../internals/export":97,"../internals/function-bind-context":103,"../internals/function-uncurry-this":110,"../internals/global":122,"../internals/has-own-property":123,"../internals/internal-state":134,"../internals/object-assign":176,"../internals/set-to-string-tag":227,"../internals/string-multibyte":234,"../internals/string-punycode-to-ascii":237,"../internals/to-string":261,"../internals/url-constructor-detection":270,"../internals/validate-arguments-length":273,"../modules/es.string.iterator":452,"../modules/web.url-search-params.constructor":626}],629:[function(require,module,exports){
"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
require('../modules/web.url.constructor');

},{"../modules/web.url.constructor":628}],630:[function(require,module,exports){
'use strict';

var $ = require('../internals/export');
var call = require('../internals/function-call');

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
$({
  target: 'URL',
  proto: true,
  enumerable: true
}, {
  toJSON: function toJSON() {
    return call(URL.prototype.toString, this);
  }
});

},{"../internals/export":97,"../internals/function-call":106}],631:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-accessible-object-hasownproperty
require('../modules/esnext.object.has-own');

},{"../modules/esnext.object.has-own":587}],632:[function(require,module,exports){
"use strict";

require('../modules/esnext.array-buffer.detached');
require('../modules/esnext.array-buffer.transfer');
require('../modules/esnext.array-buffer.transfer-to-fixed-length');

},{"../modules/esnext.array-buffer.detached":539,"../modules/esnext.array-buffer.transfer":541,"../modules/esnext.array-buffer.transfer-to-fixed-length":540}],633:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-array-find-from-last/
require('../modules/esnext.array.find-last');
require('../modules/esnext.array.find-last-index');
require('../modules/esnext.typed-array.find-last');
require('../modules/esnext.typed-array.find-last-index');

},{"../modules/esnext.array.find-last":544,"../modules/esnext.array.find-last-index":543,"../modules/esnext.typed-array.find-last":605,"../modules/esnext.typed-array.find-last-index":604}],634:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-array-from-async
require('../modules/esnext.array.from-async');

},{"../modules/esnext.array.from-async":545}],635:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-array-grouping
require('../modules/esnext.array.group');
require('../modules/esnext.array.group-to-map');

},{"../modules/esnext.array.group":549,"../modules/esnext.array.group-to-map":548}],636:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-array-grouping
// TODO: Remove from `core-js@4`
require('../modules/esnext.array.group-by');
require('../modules/esnext.array.group-by-to-map');

},{"../modules/esnext.array.group-by":547,"../modules/esnext.array.group-by-to-map":546}],637:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-change-array-by-copy
require('../modules/esnext.array.to-reversed');
require('../modules/esnext.array.to-sorted');
require('../modules/esnext.array.to-spliced');
require('../modules/esnext.array.with');
require('../modules/esnext.typed-array.to-reversed');
require('../modules/esnext.typed-array.to-sorted');
require('../modules/esnext.typed-array.with');

},{"../modules/esnext.array.to-reversed":550,"../modules/esnext.array.to-sorted":551,"../modules/esnext.array.to-spliced":552,"../modules/esnext.array.with":553,"../modules/esnext.typed-array.to-reversed":606,"../modules/esnext.typed-array.to-sorted":607,"../modules/esnext.typed-array.with":609}],638:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-change-array-by-copy
require('../modules/esnext.array.to-reversed');
require('../modules/esnext.array.to-sorted');
require('../modules/esnext.array.to-spliced');
require('../modules/esnext.array.with');
require('../modules/esnext.typed-array.to-reversed');
require('../modules/esnext.typed-array.to-sorted');
// TODO: Remove from `core-js@4`
require('../modules/esnext.typed-array.to-spliced');
require('../modules/esnext.typed-array.with');

},{"../modules/esnext.array.to-reversed":550,"../modules/esnext.array.to-sorted":551,"../modules/esnext.array.to-spliced":552,"../modules/esnext.array.with":553,"../modules/esnext.typed-array.to-reversed":606,"../modules/esnext.typed-array.to-sorted":607,"../modules/esnext.typed-array.to-spliced":608,"../modules/esnext.typed-array.with":609}],639:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-explicit-resource-management
require('../modules/esnext.suppressed-error.constructor');
require('../modules/esnext.disposable-stack.constructor');
require('../modules/esnext.iterator.dispose');
require('../modules/esnext.symbol.dispose');

},{"../modules/esnext.disposable-stack.constructor":567,"../modules/esnext.iterator.dispose":570,"../modules/esnext.suppressed-error.constructor":601,"../modules/esnext.symbol.dispose":602}],640:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-global
require('../modules/esnext.global-this');
var global = require('../internals/global');
module.exports = global;

},{"../internals/global":122,"../modules/esnext.global-this":568}],641:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-iterator-helpers
require('../modules/esnext.iterator.constructor');
require('../modules/esnext.iterator.drop');
require('../modules/esnext.iterator.every');
require('../modules/esnext.iterator.filter');
require('../modules/esnext.iterator.find');
require('../modules/esnext.iterator.flat-map');
require('../modules/esnext.iterator.for-each');
require('../modules/esnext.iterator.from');
require('../modules/esnext.iterator.map');
require('../modules/esnext.iterator.reduce');
require('../modules/esnext.iterator.some');
require('../modules/esnext.iterator.take');
require('../modules/esnext.iterator.to-array');

},{"../modules/esnext.iterator.constructor":569,"../modules/esnext.iterator.drop":571,"../modules/esnext.iterator.every":572,"../modules/esnext.iterator.filter":573,"../modules/esnext.iterator.find":574,"../modules/esnext.iterator.flat-map":575,"../modules/esnext.iterator.for-each":576,"../modules/esnext.iterator.from":577,"../modules/esnext.iterator.map":578,"../modules/esnext.iterator.reduce":579,"../modules/esnext.iterator.some":580,"../modules/esnext.iterator.take":581,"../modules/esnext.iterator.to-array":582}],642:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-iterator-helpers
require('../modules/esnext.async-iterator.constructor');
require('../modules/esnext.async-iterator.drop');
require('../modules/esnext.async-iterator.every');
require('../modules/esnext.async-iterator.filter');
require('../modules/esnext.async-iterator.find');
require('../modules/esnext.async-iterator.flat-map');
require('../modules/esnext.async-iterator.for-each');
require('../modules/esnext.async-iterator.from');
require('../modules/esnext.async-iterator.map');
require('../modules/esnext.async-iterator.reduce');
require('../modules/esnext.async-iterator.some');
require('../modules/esnext.async-iterator.take');
require('../modules/esnext.async-iterator.to-array');
require('../modules/esnext.iterator.constructor');
require('../modules/esnext.iterator.drop');
require('../modules/esnext.iterator.every');
require('../modules/esnext.iterator.filter');
require('../modules/esnext.iterator.find');
require('../modules/esnext.iterator.flat-map');
require('../modules/esnext.iterator.for-each');
require('../modules/esnext.iterator.from');
require('../modules/esnext.iterator.map');
require('../modules/esnext.iterator.reduce');
require('../modules/esnext.iterator.some');
require('../modules/esnext.iterator.take');
require('../modules/esnext.iterator.to-array');
require('../modules/esnext.iterator.to-async');

},{"../modules/esnext.async-iterator.constructor":554,"../modules/esnext.async-iterator.drop":555,"../modules/esnext.async-iterator.every":556,"../modules/esnext.async-iterator.filter":557,"../modules/esnext.async-iterator.find":558,"../modules/esnext.async-iterator.flat-map":559,"../modules/esnext.async-iterator.for-each":560,"../modules/esnext.async-iterator.from":561,"../modules/esnext.async-iterator.map":562,"../modules/esnext.async-iterator.reduce":563,"../modules/esnext.async-iterator.some":564,"../modules/esnext.async-iterator.take":565,"../modules/esnext.async-iterator.to-array":566,"../modules/esnext.iterator.constructor":569,"../modules/esnext.iterator.drop":571,"../modules/esnext.iterator.every":572,"../modules/esnext.iterator.filter":573,"../modules/esnext.iterator.find":574,"../modules/esnext.iterator.flat-map":575,"../modules/esnext.iterator.for-each":576,"../modules/esnext.iterator.from":577,"../modules/esnext.iterator.map":578,"../modules/esnext.iterator.reduce":579,"../modules/esnext.iterator.some":580,"../modules/esnext.iterator.take":581,"../modules/esnext.iterator.to-array":582,"../modules/esnext.iterator.to-async":583}],643:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-json-parse-with-source
require('../modules/esnext.json.is-raw-json');
require('../modules/esnext.json.parse');
require('../modules/esnext.json.raw-json');

},{"../modules/esnext.json.is-raw-json":584,"../modules/esnext.json.parse":585,"../modules/esnext.json.raw-json":586}],644:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-promise-allSettled
require('../modules/esnext.promise.all-settled');

},{"../modules/esnext.promise.all-settled":588}],645:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-promise-any
require('../modules/esnext.aggregate-error');
require('../modules/esnext.promise.any');

},{"../modules/esnext.aggregate-error":538,"../modules/esnext.promise.any":589}],646:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-relative-indexing-method
require('../modules/es.string.at-alternative');
require('../modules/esnext.array.at');
require('../modules/esnext.typed-array.at');

},{"../modules/es.string.at-alternative":440,"../modules/esnext.array.at":542,"../modules/esnext.typed-array.at":603}],647:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-set-methods
require('../modules/esnext.set.difference.v2');
require('../modules/esnext.set.intersection.v2');
require('../modules/esnext.set.is-disjoint-from.v2');
require('../modules/esnext.set.is-subset-of.v2');
require('../modules/esnext.set.is-superset-of.v2');
require('../modules/esnext.set.union.v2');
require('../modules/esnext.set.symmetric-difference.v2');

},{"../modules/esnext.set.difference.v2":590,"../modules/esnext.set.intersection.v2":591,"../modules/esnext.set.is-disjoint-from.v2":592,"../modules/esnext.set.is-subset-of.v2":593,"../modules/esnext.set.is-superset-of.v2":594,"../modules/esnext.set.symmetric-difference.v2":595,"../modules/esnext.set.union.v2":596}],648:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-string-matchall
require('../modules/esnext.string.match-all');

},{"../modules/esnext.string.match-all":598}],649:[function(require,module,exports){
"use strict";

// https://github.com/tc39/proposal-string-replaceall
require('../modules/esnext.string.replace-all');

},{"../modules/esnext.string.replace-all":599}],650:[function(require,module,exports){
"use strict";

require('../modules/esnext.string.is-well-formed');
require('../modules/esnext.string.to-well-formed');

},{"../modules/esnext.string.is-well-formed":597,"../modules/esnext.string.to-well-formed":600}],651:[function(require,module,exports){
"use strict";

require('../modules/es.symbol');
require('../modules/es.symbol.description');
require('../modules/es.symbol.async-iterator');
require('../modules/es.symbol.has-instance');
require('../modules/es.symbol.is-concat-spreadable');
require('../modules/es.symbol.iterator');
require('../modules/es.symbol.match');
require('../modules/es.symbol.match-all');
require('../modules/es.symbol.replace');
require('../modules/es.symbol.search');
require('../modules/es.symbol.species');
require('../modules/es.symbol.split');
require('../modules/es.symbol.to-primitive');
require('../modules/es.symbol.to-string-tag');
require('../modules/es.symbol.unscopables');
require('../modules/es.error.cause');
require('../modules/es.error.to-string');
require('../modules/es.aggregate-error');
require('../modules/es.aggregate-error.cause');
require('../modules/es.array.at');
require('../modules/es.array.concat');
require('../modules/es.array.copy-within');
require('../modules/es.array.every');
require('../modules/es.array.fill');
require('../modules/es.array.filter');
require('../modules/es.array.find');
require('../modules/es.array.find-index');
require('../modules/es.array.find-last');
require('../modules/es.array.find-last-index');
require('../modules/es.array.flat');
require('../modules/es.array.flat-map');
require('../modules/es.array.for-each');
require('../modules/es.array.from');
require('../modules/es.array.includes');
require('../modules/es.array.index-of');
require('../modules/es.array.is-array');
require('../modules/es.array.iterator');
require('../modules/es.array.join');
require('../modules/es.array.last-index-of');
require('../modules/es.array.map');
require('../modules/es.array.of');
require('../modules/es.array.push');
require('../modules/es.array.reduce');
require('../modules/es.array.reduce-right');
require('../modules/es.array.reverse');
require('../modules/es.array.slice');
require('../modules/es.array.some');
require('../modules/es.array.sort');
require('../modules/es.array.species');
require('../modules/es.array.splice');
require('../modules/es.array.to-reversed');
require('../modules/es.array.to-sorted');
require('../modules/es.array.to-spliced');
require('../modules/es.array.unscopables.flat');
require('../modules/es.array.unscopables.flat-map');
require('../modules/es.array.unshift');
require('../modules/es.array.with');
require('../modules/es.array-buffer.constructor');
require('../modules/es.array-buffer.is-view');
require('../modules/es.array-buffer.slice');
require('../modules/es.data-view');
require('../modules/es.date.get-year');
require('../modules/es.date.now');
require('../modules/es.date.set-year');
require('../modules/es.date.to-gmt-string');
require('../modules/es.date.to-iso-string');
require('../modules/es.date.to-json');
require('../modules/es.date.to-primitive');
require('../modules/es.date.to-string');
require('../modules/es.escape');
require('../modules/es.function.bind');
require('../modules/es.function.has-instance');
require('../modules/es.function.name');
require('../modules/es.global-this');
require('../modules/es.json.stringify');
require('../modules/es.json.to-string-tag');
require('../modules/es.map');
require('../modules/es.math.acosh');
require('../modules/es.math.asinh');
require('../modules/es.math.atanh');
require('../modules/es.math.cbrt');
require('../modules/es.math.clz32');
require('../modules/es.math.cosh');
require('../modules/es.math.expm1');
require('../modules/es.math.fround');
require('../modules/es.math.hypot');
require('../modules/es.math.imul');
require('../modules/es.math.log10');
require('../modules/es.math.log1p');
require('../modules/es.math.log2');
require('../modules/es.math.sign');
require('../modules/es.math.sinh');
require('../modules/es.math.tanh');
require('../modules/es.math.to-string-tag');
require('../modules/es.math.trunc');
require('../modules/es.number.constructor');
require('../modules/es.number.epsilon');
require('../modules/es.number.is-finite');
require('../modules/es.number.is-integer');
require('../modules/es.number.is-nan');
require('../modules/es.number.is-safe-integer');
require('../modules/es.number.max-safe-integer');
require('../modules/es.number.min-safe-integer');
require('../modules/es.number.parse-float');
require('../modules/es.number.parse-int');
require('../modules/es.number.to-exponential');
require('../modules/es.number.to-fixed');
require('../modules/es.number.to-precision');
require('../modules/es.object.assign');
require('../modules/es.object.create');
require('../modules/es.object.define-getter');
require('../modules/es.object.define-properties');
require('../modules/es.object.define-property');
require('../modules/es.object.define-setter');
require('../modules/es.object.entries');
require('../modules/es.object.freeze');
require('../modules/es.object.from-entries');
require('../modules/es.object.get-own-property-descriptor');
require('../modules/es.object.get-own-property-descriptors');
require('../modules/es.object.get-own-property-names');
require('../modules/es.object.get-prototype-of');
require('../modules/es.object.has-own');
require('../modules/es.object.is');
require('../modules/es.object.is-extensible');
require('../modules/es.object.is-frozen');
require('../modules/es.object.is-sealed');
require('../modules/es.object.keys');
require('../modules/es.object.lookup-getter');
require('../modules/es.object.lookup-setter');
require('../modules/es.object.prevent-extensions');
require('../modules/es.object.proto');
require('../modules/es.object.seal');
require('../modules/es.object.set-prototype-of');
require('../modules/es.object.to-string');
require('../modules/es.object.values');
require('../modules/es.parse-float');
require('../modules/es.parse-int');
require('../modules/es.promise');
require('../modules/es.promise.all-settled');
require('../modules/es.promise.any');
require('../modules/es.promise.finally');
require('../modules/es.reflect.apply');
require('../modules/es.reflect.construct');
require('../modules/es.reflect.define-property');
require('../modules/es.reflect.delete-property');
require('../modules/es.reflect.get');
require('../modules/es.reflect.get-own-property-descriptor');
require('../modules/es.reflect.get-prototype-of');
require('../modules/es.reflect.has');
require('../modules/es.reflect.is-extensible');
require('../modules/es.reflect.own-keys');
require('../modules/es.reflect.prevent-extensions');
require('../modules/es.reflect.set');
require('../modules/es.reflect.set-prototype-of');
require('../modules/es.reflect.to-string-tag');
require('../modules/es.regexp.constructor');
require('../modules/es.regexp.dot-all');
require('../modules/es.regexp.exec');
require('../modules/es.regexp.flags');
require('../modules/es.regexp.sticky');
require('../modules/es.regexp.test');
require('../modules/es.regexp.to-string');
require('../modules/es.set');
require('../modules/es.string.at-alternative');
require('../modules/es.string.code-point-at');
require('../modules/es.string.ends-with');
require('../modules/es.string.from-code-point');
require('../modules/es.string.includes');
require('../modules/es.string.iterator');
require('../modules/es.string.match');
require('../modules/es.string.match-all');
require('../modules/es.string.pad-end');
require('../modules/es.string.pad-start');
require('../modules/es.string.raw');
require('../modules/es.string.repeat');
require('../modules/es.string.replace');
require('../modules/es.string.replace-all');
require('../modules/es.string.search');
require('../modules/es.string.split');
require('../modules/es.string.starts-with');
require('../modules/es.string.substr');
require('../modules/es.string.trim');
require('../modules/es.string.trim-end');
require('../modules/es.string.trim-start');
require('../modules/es.string.anchor');
require('../modules/es.string.big');
require('../modules/es.string.blink');
require('../modules/es.string.bold');
require('../modules/es.string.fixed');
require('../modules/es.string.fontcolor');
require('../modules/es.string.fontsize');
require('../modules/es.string.italics');
require('../modules/es.string.link');
require('../modules/es.string.small');
require('../modules/es.string.strike');
require('../modules/es.string.sub');
require('../modules/es.string.sup');
require('../modules/es.typed-array.float32-array');
require('../modules/es.typed-array.float64-array');
require('../modules/es.typed-array.int8-array');
require('../modules/es.typed-array.int16-array');
require('../modules/es.typed-array.int32-array');
require('../modules/es.typed-array.uint8-array');
require('../modules/es.typed-array.uint8-clamped-array');
require('../modules/es.typed-array.uint16-array');
require('../modules/es.typed-array.uint32-array');
require('../modules/es.typed-array.at');
require('../modules/es.typed-array.copy-within');
require('../modules/es.typed-array.every');
require('../modules/es.typed-array.fill');
require('../modules/es.typed-array.filter');
require('../modules/es.typed-array.find');
require('../modules/es.typed-array.find-index');
require('../modules/es.typed-array.find-last');
require('../modules/es.typed-array.find-last-index');
require('../modules/es.typed-array.for-each');
require('../modules/es.typed-array.from');
require('../modules/es.typed-array.includes');
require('../modules/es.typed-array.index-of');
require('../modules/es.typed-array.iterator');
require('../modules/es.typed-array.join');
require('../modules/es.typed-array.last-index-of');
require('../modules/es.typed-array.map');
require('../modules/es.typed-array.of');
require('../modules/es.typed-array.reduce');
require('../modules/es.typed-array.reduce-right');
require('../modules/es.typed-array.reverse');
require('../modules/es.typed-array.set');
require('../modules/es.typed-array.slice');
require('../modules/es.typed-array.some');
require('../modules/es.typed-array.sort');
require('../modules/es.typed-array.subarray');
require('../modules/es.typed-array.to-locale-string');
require('../modules/es.typed-array.to-reversed');
require('../modules/es.typed-array.to-sorted');
require('../modules/es.typed-array.to-string');
require('../modules/es.typed-array.with');
require('../modules/es.unescape');
require('../modules/es.weak-map');
require('../modules/es.weak-set');
require('../modules/web.atob');
require('../modules/web.btoa');
require('../modules/web.dom-collections.for-each');
require('../modules/web.dom-collections.iterator');
require('../modules/web.dom-exception.constructor');
require('../modules/web.dom-exception.stack');
require('../modules/web.dom-exception.to-string-tag');
require('../modules/web.immediate');
require('../modules/web.queue-microtask');
require('../modules/web.self');
require('../modules/web.structured-clone');
require('../modules/web.timers');
require('../modules/web.url');
require('../modules/web.url.to-json');
require('../modules/web.url-search-params');
module.exports = require('../internals/path');

},{"../internals/path":197,"../modules/es.aggregate-error":282,"../modules/es.aggregate-error.cause":280,"../modules/es.array-buffer.constructor":283,"../modules/es.array-buffer.is-view":284,"../modules/es.array-buffer.slice":285,"../modules/es.array.at":286,"../modules/es.array.concat":287,"../modules/es.array.copy-within":288,"../modules/es.array.every":289,"../modules/es.array.fill":290,"../modules/es.array.filter":291,"../modules/es.array.find":295,"../modules/es.array.find-index":292,"../modules/es.array.find-last":294,"../modules/es.array.find-last-index":293,"../modules/es.array.flat":297,"../modules/es.array.flat-map":296,"../modules/es.array.for-each":298,"../modules/es.array.from":299,"../modules/es.array.includes":300,"../modules/es.array.index-of":301,"../modules/es.array.is-array":302,"../modules/es.array.iterator":303,"../modules/es.array.join":304,"../modules/es.array.last-index-of":305,"../modules/es.array.map":306,"../modules/es.array.of":307,"../modules/es.array.push":308,"../modules/es.array.reduce":310,"../modules/es.array.reduce-right":309,"../modules/es.array.reverse":311,"../modules/es.array.slice":312,"../modules/es.array.some":313,"../modules/es.array.sort":314,"../modules/es.array.species":315,"../modules/es.array.splice":316,"../modules/es.array.to-reversed":317,"../modules/es.array.to-sorted":318,"../modules/es.array.to-spliced":319,"../modules/es.array.unscopables.flat":321,"../modules/es.array.unscopables.flat-map":320,"../modules/es.array.unshift":322,"../modules/es.array.with":323,"../modules/es.data-view":325,"../modules/es.date.get-year":326,"../modules/es.date.now":327,"../modules/es.date.set-year":328,"../modules/es.date.to-gmt-string":329,"../modules/es.date.to-iso-string":330,"../modules/es.date.to-json":331,"../modules/es.date.to-primitive":332,"../modules/es.date.to-string":333,"../modules/es.error.cause":334,"../modules/es.error.to-string":335,"../modules/es.escape":336,"../modules/es.function.bind":337,"../modules/es.function.has-instance":338,"../modules/es.function.name":339,"../modules/es.global-this":340,"../modules/es.json.stringify":341,"../modules/es.json.to-string-tag":342,"../modules/es.map":344,"../modules/es.math.acosh":345,"../modules/es.math.asinh":346,"../modules/es.math.atanh":347,"../modules/es.math.cbrt":348,"../modules/es.math.clz32":349,"../modules/es.math.cosh":350,"../modules/es.math.expm1":351,"../modules/es.math.fround":352,"../modules/es.math.hypot":353,"../modules/es.math.imul":354,"../modules/es.math.log10":355,"../modules/es.math.log1p":356,"../modules/es.math.log2":357,"../modules/es.math.sign":358,"../modules/es.math.sinh":359,"../modules/es.math.tanh":360,"../modules/es.math.to-string-tag":361,"../modules/es.math.trunc":362,"../modules/es.number.constructor":363,"../modules/es.number.epsilon":364,"../modules/es.number.is-finite":365,"../modules/es.number.is-integer":366,"../modules/es.number.is-nan":367,"../modules/es.number.is-safe-integer":368,"../modules/es.number.max-safe-integer":369,"../modules/es.number.min-safe-integer":370,"../modules/es.number.parse-float":371,"../modules/es.number.parse-int":372,"../modules/es.number.to-exponential":373,"../modules/es.number.to-fixed":374,"../modules/es.number.to-precision":375,"../modules/es.object.assign":376,"../modules/es.object.create":377,"../modules/es.object.define-getter":378,"../modules/es.object.define-properties":379,"../modules/es.object.define-property":380,"../modules/es.object.define-setter":381,"../modules/es.object.entries":382,"../modules/es.object.freeze":383,"../modules/es.object.from-entries":384,"../modules/es.object.get-own-property-descriptor":385,"../modules/es.object.get-own-property-descriptors":386,"../modules/es.object.get-own-property-names":387,"../modules/es.object.get-prototype-of":389,"../modules/es.object.has-own":390,"../modules/es.object.is":394,"../modules/es.object.is-extensible":391,"../modules/es.object.is-frozen":392,"../modules/es.object.is-sealed":393,"../modules/es.object.keys":395,"../modules/es.object.lookup-getter":396,"../modules/es.object.lookup-setter":397,"../modules/es.object.prevent-extensions":398,"../modules/es.object.proto":399,"../modules/es.object.seal":400,"../modules/es.object.set-prototype-of":401,"../modules/es.object.to-string":402,"../modules/es.object.values":403,"../modules/es.parse-float":404,"../modules/es.parse-int":405,"../modules/es.promise":412,"../modules/es.promise.all-settled":406,"../modules/es.promise.any":408,"../modules/es.promise.finally":411,"../modules/es.reflect.apply":416,"../modules/es.reflect.construct":417,"../modules/es.reflect.define-property":418,"../modules/es.reflect.delete-property":419,"../modules/es.reflect.get":422,"../modules/es.reflect.get-own-property-descriptor":420,"../modules/es.reflect.get-prototype-of":421,"../modules/es.reflect.has":423,"../modules/es.reflect.is-extensible":424,"../modules/es.reflect.own-keys":425,"../modules/es.reflect.prevent-extensions":426,"../modules/es.reflect.set":428,"../modules/es.reflect.set-prototype-of":427,"../modules/es.reflect.to-string-tag":429,"../modules/es.regexp.constructor":430,"../modules/es.regexp.dot-all":431,"../modules/es.regexp.exec":432,"../modules/es.regexp.flags":433,"../modules/es.regexp.sticky":434,"../modules/es.regexp.test":435,"../modules/es.regexp.to-string":436,"../modules/es.set":438,"../modules/es.string.anchor":439,"../modules/es.string.at-alternative":440,"../modules/es.string.big":441,"../modules/es.string.blink":442,"../modules/es.string.bold":443,"../modules/es.string.code-point-at":444,"../modules/es.string.ends-with":445,"../modules/es.string.fixed":446,"../modules/es.string.fontcolor":447,"../modules/es.string.fontsize":448,"../modules/es.string.from-code-point":449,"../modules/es.string.includes":450,"../modules/es.string.italics":451,"../modules/es.string.iterator":452,"../modules/es.string.link":453,"../modules/es.string.match":455,"../modules/es.string.match-all":454,"../modules/es.string.pad-end":456,"../modules/es.string.pad-start":457,"../modules/es.string.raw":458,"../modules/es.string.repeat":459,"../modules/es.string.replace":461,"../modules/es.string.replace-all":460,"../modules/es.string.search":462,"../modules/es.string.small":463,"../modules/es.string.split":464,"../modules/es.string.starts-with":465,"../modules/es.string.strike":466,"../modules/es.string.sub":467,"../modules/es.string.substr":468,"../modules/es.string.sup":469,"../modules/es.string.trim":474,"../modules/es.string.trim-end":470,"../modules/es.string.trim-start":473,"../modules/es.symbol":482,"../modules/es.symbol.async-iterator":475,"../modules/es.symbol.description":477,"../modules/es.symbol.has-instance":479,"../modules/es.symbol.is-concat-spreadable":480,"../modules/es.symbol.iterator":481,"../modules/es.symbol.match":485,"../modules/es.symbol.match-all":484,"../modules/es.symbol.replace":486,"../modules/es.symbol.search":487,"../modules/es.symbol.species":488,"../modules/es.symbol.split":489,"../modules/es.symbol.to-primitive":490,"../modules/es.symbol.to-string-tag":491,"../modules/es.symbol.unscopables":492,"../modules/es.typed-array.at":493,"../modules/es.typed-array.copy-within":494,"../modules/es.typed-array.every":495,"../modules/es.typed-array.fill":496,"../modules/es.typed-array.filter":497,"../modules/es.typed-array.find":501,"../modules/es.typed-array.find-index":498,"../modules/es.typed-array.find-last":500,"../modules/es.typed-array.find-last-index":499,"../modules/es.typed-array.float32-array":502,"../modules/es.typed-array.float64-array":503,"../modules/es.typed-array.for-each":504,"../modules/es.typed-array.from":505,"../modules/es.typed-array.includes":506,"../modules/es.typed-array.index-of":507,"../modules/es.typed-array.int16-array":508,"../modules/es.typed-array.int32-array":509,"../modules/es.typed-array.int8-array":510,"../modules/es.typed-array.iterator":511,"../modules/es.typed-array.join":512,"../modules/es.typed-array.last-index-of":513,"../modules/es.typed-array.map":514,"../modules/es.typed-array.of":515,"../modules/es.typed-array.reduce":517,"../modules/es.typed-array.reduce-right":516,"../modules/es.typed-array.reverse":518,"../modules/es.typed-array.set":519,"../modules/es.typed-array.slice":520,"../modules/es.typed-array.some":521,"../modules/es.typed-array.sort":522,"../modules/es.typed-array.subarray":523,"../modules/es.typed-array.to-locale-string":524,"../modules/es.typed-array.to-reversed":525,"../modules/es.typed-array.to-sorted":526,"../modules/es.typed-array.to-string":527,"../modules/es.typed-array.uint16-array":528,"../modules/es.typed-array.uint32-array":529,"../modules/es.typed-array.uint8-array":530,"../modules/es.typed-array.uint8-clamped-array":531,"../modules/es.typed-array.with":532,"../modules/es.unescape":533,"../modules/es.weak-map":535,"../modules/es.weak-set":537,"../modules/web.atob":610,"../modules/web.btoa":611,"../modules/web.dom-collections.for-each":613,"../modules/web.dom-collections.iterator":614,"../modules/web.dom-exception.constructor":615,"../modules/web.dom-exception.stack":616,"../modules/web.dom-exception.to-string-tag":617,"../modules/web.immediate":618,"../modules/web.queue-microtask":619,"../modules/web.self":620,"../modules/web.structured-clone":624,"../modules/web.timers":625,"../modules/web.url":629,"../modules/web.url-search-params":627,"../modules/web.url.to-json":630}],652:[function(require,module,exports){
"use strict";

var parent = require('./4');
require('../proposals/array-from-async-stage-2');
require('../proposals/array-grouping-stage-3-2');
require('../proposals/array-buffer-transfer');
require('../proposals/explicit-resource-management');
require('../proposals/iterator-helpers-stage-3-2');
require('../proposals/json-parse-with-source');
require('../proposals/set-methods-v2');
require('../proposals/well-formed-unicode-strings');
// TODO: Obsolete versions, remove from `core-js@4`
require('../proposals/array-grouping-stage-3');
require('../proposals/change-array-by-copy');
require('../proposals/iterator-helpers-stage-3');
module.exports = parent;

},{"../proposals/array-buffer-transfer":632,"../proposals/array-from-async-stage-2":634,"../proposals/array-grouping-stage-3":636,"../proposals/array-grouping-stage-3-2":635,"../proposals/change-array-by-copy":638,"../proposals/explicit-resource-management":639,"../proposals/iterator-helpers-stage-3":642,"../proposals/iterator-helpers-stage-3-2":641,"../proposals/json-parse-with-source":643,"../proposals/set-methods-v2":647,"../proposals/well-formed-unicode-strings":650,"./4":653}],653:[function(require,module,exports){
"use strict";

// TODO: Remove this entry from `core-js@4`
require('../proposals/accessible-object-hasownproperty');
require('../proposals/array-find-from-last');
require('../proposals/change-array-by-copy-stage-4');
// require('../proposals/error-cause');
require('../proposals/global-this');
require('../proposals/promise-all-settled');
require('../proposals/promise-any');
require('../proposals/relative-indexing-method');
require('../proposals/string-match-all');
require('../proposals/string-replace-all-stage-4');
var path = require('../internals/path');
module.exports = path;

},{"../internals/path":197,"../proposals/accessible-object-hasownproperty":631,"../proposals/array-find-from-last":633,"../proposals/change-array-by-copy-stage-4":637,"../proposals/global-this":640,"../proposals/promise-all-settled":644,"../proposals/promise-any":645,"../proposals/relative-indexing-method":646,"../proposals/string-match-all":648,"../proposals/string-replace-all-stage-4":649}],654:[function(require,module,exports){
"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initAccordions = void 0;
var Default = {
  alwaysOpen: false,
  activeClasses: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
  inactiveClasses: 'text-gray-500 dark:text-gray-400',
  onOpen: function onOpen() {},
  onClose: function onClose() {},
  onToggle: function onToggle() {}
};
var Accordion = /** @class */function () {
  function Accordion(items, options) {
    if (items === void 0) {
      items = [];
    }
    if (options === void 0) {
      options = Default;
    }
    this._items = items;
    this._options = __assign(__assign({}, Default), options);
    this._init();
  }
  Accordion.prototype._init = function () {
    var _this = this;
    if (this._items.length) {
      // show accordion item based on click
      this._items.map(function (item) {
        if (item.active) {
          _this.open(item.id);
        }
        item.triggerEl.addEventListener('click', function () {
          _this.toggle(item.id);
        });
      });
    }
  };
  Accordion.prototype.getItem = function (id) {
    return this._items.filter(function (item) {
      return item.id === id;
    })[0];
  };
  Accordion.prototype.open = function (id) {
    var _a, _b;
    var _this = this;
    var item = this.getItem(id);
    // don't hide other accordions if always open
    if (!this._options.alwaysOpen) {
      this._items.map(function (i) {
        var _a, _b;
        if (i !== item) {
          (_a = i.triggerEl.classList).remove.apply(_a, _this._options.activeClasses.split(' '));
          (_b = i.triggerEl.classList).add.apply(_b, _this._options.inactiveClasses.split(' '));
          i.targetEl.classList.add('hidden');
          i.triggerEl.setAttribute('aria-expanded', 'false');
          i.active = false;
          // rotate icon if set
          if (i.iconEl) {
            i.iconEl.classList.remove('rotate-180');
          }
        }
      });
    }
    // show active item
    (_a = item.triggerEl.classList).add.apply(_a, this._options.activeClasses.split(' '));
    (_b = item.triggerEl.classList).remove.apply(_b, this._options.inactiveClasses.split(' '));
    item.triggerEl.setAttribute('aria-expanded', 'true');
    item.targetEl.classList.remove('hidden');
    item.active = true;
    // rotate icon if set
    if (item.iconEl) {
      item.iconEl.classList.add('rotate-180');
    }
    // callback function
    this._options.onOpen(this, item);
  };
  Accordion.prototype.toggle = function (id) {
    var item = this.getItem(id);
    if (item.active) {
      this.close(id);
    } else {
      this.open(id);
    }
    // callback function
    this._options.onToggle(this, item);
  };
  Accordion.prototype.close = function (id) {
    var _a, _b;
    var item = this.getItem(id);
    (_a = item.triggerEl.classList).remove.apply(_a, this._options.activeClasses.split(' '));
    (_b = item.triggerEl.classList).add.apply(_b, this._options.inactiveClasses.split(' '));
    item.targetEl.classList.add('hidden');
    item.triggerEl.setAttribute('aria-expanded', 'false');
    item.active = false;
    // rotate icon if set
    if (item.iconEl) {
      item.iconEl.classList.remove('rotate-180');
    }
    // callback function
    this._options.onClose(this, item);
  };
  return Accordion;
}();
if (typeof window !== 'undefined') {
  window.Accordion = Accordion;
}
function initAccordions() {
  document.querySelectorAll('[data-accordion]').forEach(function ($accordionEl) {
    var alwaysOpen = $accordionEl.getAttribute('data-accordion');
    var activeClasses = $accordionEl.getAttribute('data-active-classes');
    var inactiveClasses = $accordionEl.getAttribute('data-inactive-classes');
    var items = [];
    $accordionEl.querySelectorAll('[data-accordion-target]').forEach(function ($triggerEl) {
      var item = {
        id: $triggerEl.getAttribute('data-accordion-target'),
        triggerEl: $triggerEl,
        targetEl: document.querySelector($triggerEl.getAttribute('data-accordion-target')),
        iconEl: $triggerEl.querySelector('[data-accordion-icon]'),
        active: $triggerEl.getAttribute('aria-expanded') === 'true' ? true : false
      };
      items.push(item);
    });
    new Accordion(items, {
      alwaysOpen: alwaysOpen === 'open' ? true : false,
      activeClasses: activeClasses ? activeClasses : Default.activeClasses,
      inactiveClasses: inactiveClasses ? inactiveClasses : Default.inactiveClasses
    });
  });
}
exports.initAccordions = initAccordions;
exports["default"] = Accordion;

},{}],655:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{}],656:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],657:[function(require,module,exports){
"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCarousels = void 0;
var Default = {
  defaultPosition: 0,
  indicators: {
    items: [],
    activeClasses: 'bg-white dark:bg-gray-800',
    inactiveClasses: 'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800'
  },
  interval: 3000,
  onNext: function onNext() {},
  onPrev: function onPrev() {},
  onChange: function onChange() {}
};
var Carousel = /** @class */function () {
  function Carousel(items, options) {
    if (items === void 0) {
      items = [];
    }
    if (options === void 0) {
      options = Default;
    }
    this._items = items;
    this._options = __assign(__assign(__assign({}, Default), options), {
      indicators: __assign(__assign({}, Default.indicators), options.indicators)
    });
    this._activeItem = this.getItem(this._options.defaultPosition);
    this._indicators = this._options.indicators.items;
    this._intervalDuration = this._options.interval;
    this._intervalInstance = null;
    this._init();
  }
  /**
   * initialize carousel and items based on active one
   */
  Carousel.prototype._init = function () {
    var _this = this;
    this._items.map(function (item) {
      item.el.classList.add('absolute', 'inset-0', 'transition-transform', 'transform');
    });
    // if no active item is set then first position is default
    if (this._getActiveItem()) {
      this.slideTo(this._getActiveItem().position);
    } else {
      this.slideTo(0);
    }
    this._indicators.map(function (indicator, position) {
      indicator.el.addEventListener('click', function () {
        _this.slideTo(position);
      });
    });
  };
  Carousel.prototype.getItem = function (position) {
    return this._items[position];
  };
  /**
   * Slide to the element based on id
   * @param {*} position
   */
  Carousel.prototype.slideTo = function (position) {
    var nextItem = this._items[position];
    var rotationItems = {
      left: nextItem.position === 0 ? this._items[this._items.length - 1] : this._items[nextItem.position - 1],
      middle: nextItem,
      right: nextItem.position === this._items.length - 1 ? this._items[0] : this._items[nextItem.position + 1]
    };
    this._rotate(rotationItems);
    this._setActiveItem(nextItem);
    if (this._intervalInstance) {
      this.pause();
      this.cycle();
    }
    this._options.onChange(this);
  };
  /**
   * Based on the currently active item it will go to the next position
   */
  Carousel.prototype.next = function () {
    var activeItem = this._getActiveItem();
    var nextItem = null;
    // check if last item
    if (activeItem.position === this._items.length - 1) {
      nextItem = this._items[0];
    } else {
      nextItem = this._items[activeItem.position + 1];
    }
    this.slideTo(nextItem.position);
    // callback function
    this._options.onNext(this);
  };
  /**
   * Based on the currently active item it will go to the previous position
   */
  Carousel.prototype.prev = function () {
    var activeItem = this._getActiveItem();
    var prevItem = null;
    // check if first item
    if (activeItem.position === 0) {
      prevItem = this._items[this._items.length - 1];
    } else {
      prevItem = this._items[activeItem.position - 1];
    }
    this.slideTo(prevItem.position);
    // callback function
    this._options.onPrev(this);
  };
  /**
   * This method applies the transform classes based on the left, middle, and right rotation carousel items
   * @param {*} rotationItems
   */
  Carousel.prototype._rotate = function (rotationItems) {
    // reset
    this._items.map(function (item) {
      item.el.classList.add('hidden');
    });
    // left item (previously active)
    rotationItems.left.el.classList.remove('-translate-x-full', 'translate-x-full', 'translate-x-0', 'hidden', 'z-20');
    rotationItems.left.el.classList.add('-translate-x-full', 'z-10');
    // currently active item
    rotationItems.middle.el.classList.remove('-translate-x-full', 'translate-x-full', 'translate-x-0', 'hidden', 'z-10');
    rotationItems.middle.el.classList.add('translate-x-0', 'z-20');
    // right item (upcoming active)
    rotationItems.right.el.classList.remove('-translate-x-full', 'translate-x-full', 'translate-x-0', 'hidden', 'z-20');
    rotationItems.right.el.classList.add('translate-x-full', 'z-10');
  };
  /**
   * Set an interval to cycle through the carousel items
   */
  Carousel.prototype.cycle = function () {
    var _this = this;
    if (typeof window !== 'undefined') {
      this._intervalInstance = window.setInterval(function () {
        _this.next();
      }, this._intervalDuration);
    }
  };
  /**
   * Clears the cycling interval
   */
  Carousel.prototype.pause = function () {
    clearInterval(this._intervalInstance);
  };
  /**
   * Get the currently active item
   */
  Carousel.prototype._getActiveItem = function () {
    return this._activeItem;
  };
  /**
   * Set the currently active item and data attribute
   * @param {*} position
   */
  Carousel.prototype._setActiveItem = function (item) {
    var _a, _b;
    var _this = this;
    this._activeItem = item;
    var position = item.position;
    // update the indicators if available
    if (this._indicators.length) {
      this._indicators.map(function (indicator) {
        var _a, _b;
        indicator.el.setAttribute('aria-current', 'false');
        (_a = indicator.el.classList).remove.apply(_a, _this._options.indicators.activeClasses.split(' '));
        (_b = indicator.el.classList).add.apply(_b, _this._options.indicators.inactiveClasses.split(' '));
      });
      (_a = this._indicators[position].el.classList).add.apply(_a, this._options.indicators.activeClasses.split(' '));
      (_b = this._indicators[position].el.classList).remove.apply(_b, this._options.indicators.inactiveClasses.split(' '));
      this._indicators[position].el.setAttribute('aria-current', 'true');
    }
  };
  return Carousel;
}();
if (typeof window !== 'undefined') {
  window.Carousel = Carousel;
}
function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(function ($carouselEl) {
    var interval = $carouselEl.getAttribute('data-carousel-interval');
    var slide = $carouselEl.getAttribute('data-carousel') === 'slide' ? true : false;
    var items = [];
    var defaultPosition = 0;
    if ($carouselEl.querySelectorAll('[data-carousel-item]').length) {
      Array.from($carouselEl.querySelectorAll('[data-carousel-item]')).map(function ($carouselItemEl, position) {
        items.push({
          position: position,
          el: $carouselItemEl
        });
        if ($carouselItemEl.getAttribute('data-carousel-item') === 'active') {
          defaultPosition = position;
        }
      });
    }
    var indicators = [];
    if ($carouselEl.querySelectorAll('[data-carousel-slide-to]').length) {
      Array.from($carouselEl.querySelectorAll('[data-carousel-slide-to]')).map(function ($indicatorEl) {
        indicators.push({
          position: parseInt($indicatorEl.getAttribute('data-carousel-slide-to')),
          el: $indicatorEl
        });
      });
    }
    var carousel = new Carousel(items, {
      defaultPosition: defaultPosition,
      indicators: {
        items: indicators
      },
      interval: interval ? interval : Default.interval
    });
    if (slide) {
      carousel.cycle();
    }
    // check for controls
    var carouselNextEl = $carouselEl.querySelector('[data-carousel-next]');
    var carouselPrevEl = $carouselEl.querySelector('[data-carousel-prev]');
    if (carouselNextEl) {
      carouselNextEl.addEventListener('click', function () {
        carousel.next();
      });
    }
    if (carouselPrevEl) {
      carouselPrevEl.addEventListener('click', function () {
        carousel.prev();
      });
    }
  });
}
exports.initCarousels = initCarousels;
exports["default"] = Carousel;

},{}],658:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],659:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],660:[function(require,module,exports){
"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCollapses = void 0;
var Default = {
  onCollapse: function onCollapse() {},
  onExpand: function onExpand() {},
  onToggle: function onToggle() {}
};
var Collapse = /** @class */function () {
  function Collapse(targetEl, triggerEl, options) {
    if (targetEl === void 0) {
      targetEl = null;
    }
    if (triggerEl === void 0) {
      triggerEl = null;
    }
    if (options === void 0) {
      options = Default;
    }
    this._targetEl = targetEl;
    this._triggerEl = triggerEl;
    this._options = __assign(__assign({}, Default), options);
    this._visible = false;
    this._init();
  }
  Collapse.prototype._init = function () {
    var _this = this;
    if (this._triggerEl) {
      if (this._triggerEl.hasAttribute('aria-expanded')) {
        this._visible = this._triggerEl.getAttribute('aria-expanded') === 'true';
      } else {
        // fix until v2 not to break previous single collapses which became dismiss
        this._visible = !this._targetEl.classList.contains('hidden');
      }
      this._triggerEl.addEventListener('click', function () {
        _this.toggle();
      });
    }
  };
  Collapse.prototype.collapse = function () {
    this._targetEl.classList.add('hidden');
    if (this._triggerEl) {
      this._triggerEl.setAttribute('aria-expanded', 'false');
    }
    this._visible = false;
    // callback function
    this._options.onCollapse(this);
  };
  Collapse.prototype.expand = function () {
    this._targetEl.classList.remove('hidden');
    if (this._triggerEl) {
      this._triggerEl.setAttribute('aria-expanded', 'true');
    }
    this._visible = true;
    // callback function
    this._options.onExpand(this);
  };
  Collapse.prototype.toggle = function () {
    if (this._visible) {
      this.collapse();
    } else {
      this.expand();
    }
    // callback function
    this._options.onToggle(this);
  };
  return Collapse;
}();
if (typeof window !== 'undefined') {
  window.Collapse = Collapse;
}
function initCollapses() {
  document.querySelectorAll('[data-collapse-toggle]').forEach(function ($triggerEl) {
    var targetId = $triggerEl.getAttribute('data-collapse-toggle');
    var $targetEl = document.getElementById(targetId);
    // check if the target element exists
    if ($targetEl) {
      new Collapse($targetEl, $triggerEl);
    } else {
      console.error("The target element with id \"".concat(targetId, "\" does not exist. Please check the data-collapse-toggle attribute."));
    }
  });
}
exports.initCollapses = initCollapses;
exports["default"] = Collapse;

},{}],661:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],662:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],663:[function(require,module,exports){
"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDials = void 0;
var Default = {
  triggerType: 'hover',
  onShow: function onShow() {},
  onHide: function onHide() {},
  onToggle: function onToggle() {}
};
var Dial = /** @class */function () {
  function Dial(parentEl, triggerEl, targetEl, options) {
    if (parentEl === void 0) {
      parentEl = null;
    }
    if (triggerEl === void 0) {
      triggerEl = null;
    }
    if (targetEl === void 0) {
      targetEl = null;
    }
    if (options === void 0) {
      options = Default;
    }
    this._parentEl = parentEl;
    this._triggerEl = triggerEl;
    this._targetEl = targetEl;
    this._options = __assign(__assign({}, Default), options);
    this._visible = false;
    this._init();
  }
  Dial.prototype._init = function () {
    var _this = this;
    if (this._triggerEl) {
      var triggerEventTypes = this._getTriggerEventTypes(this._options.triggerType);
      triggerEventTypes.showEvents.forEach(function (ev) {
        _this._triggerEl.addEventListener(ev, function () {
          _this.show();
        });
        _this._targetEl.addEventListener(ev, function () {
          _this.show();
        });
      });
      triggerEventTypes.hideEvents.forEach(function (ev) {
        _this._parentEl.addEventListener(ev, function () {
          if (!_this._parentEl.matches(':hover')) {
            _this.hide();
          }
        });
      });
    }
  };
  Dial.prototype.hide = function () {
    this._targetEl.classList.add('hidden');
    if (this._triggerEl) {
      this._triggerEl.setAttribute('aria-expanded', 'false');
    }
    this._visible = false;
    // callback function
    this._options.onHide(this);
  };
  Dial.prototype.show = function () {
    this._targetEl.classList.remove('hidden');
    if (this._triggerEl) {
      this._triggerEl.setAttribute('aria-expanded', 'true');
    }
    this._visible = true;
    // callback function
    this._options.onShow(this);
  };
  Dial.prototype.toggle = function () {
    if (this._visible) {
      this.hide();
    } else {
      this.show();
    }
  };
  Dial.prototype.isHidden = function () {
    return !this._visible;
  };
  Dial.prototype.isVisible = function () {
    return this._visible;
  };
  Dial.prototype._getTriggerEventTypes = function (triggerType) {
    switch (triggerType) {
      case 'hover':
        return {
          showEvents: ['mouseenter', 'focus'],
          hideEvents: ['mouseleave', 'blur']
        };
      case 'click':
        return {
          showEvents: ['click', 'focus'],
          hideEvents: ['focusout', 'blur']
        };
      case 'none':
        return {
          showEvents: [],
          hideEvents: []
        };
      default:
        return {
          showEvents: ['mouseenter', 'focus'],
          hideEvents: ['mouseleave', 'blur']
        };
    }
  };
  return Dial;
}();
if (typeof window !== 'undefined') {
  window.Dial = Dial;
}
function initDials() {
  document.querySelectorAll('[data-dial-init]').forEach(function ($parentEl) {
    var $triggerEl = $parentEl.querySelector('[data-dial-toggle]');
    if ($triggerEl) {
      var dialId = $triggerEl.getAttribute('data-dial-toggle');
      var $dialEl = document.getElementById(dialId);
      if ($dialEl) {
        var triggerType = $triggerEl.getAttribute('data-dial-trigger');
        new Dial($parentEl, $triggerEl, $dialEl, {
          triggerType: triggerType ? triggerType : Default.triggerType
        });
      } else {
        console.error("Dial with id ".concat(dialId, " does not exist. Are you sure that the data-dial-toggle attribute points to the correct modal id?"));
      }
    } else {
      console.error("Dial with id ".concat($parentEl.id, " does not have a trigger element. Are you sure that the data-dial-toggle attribute exists?"));
    }
  });
}
exports.initDials = initDials;
exports["default"] = Dial;

},{}],664:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],665:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],666:[function(require,module,exports){
"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDismisses = void 0;
var Default = {
  transition: 'transition-opacity',
  duration: 300,
  timing: 'ease-out',
  onHide: function onHide() {}
};
var Dismiss = /** @class */function () {
  function Dismiss(targetEl, triggerEl, options) {
    if (targetEl === void 0) {
      targetEl = null;
    }
    if (triggerEl === void 0) {
      triggerEl = null;
    }
    if (options === void 0) {
      options = Default;
    }
    this._targetEl = targetEl;
    this._triggerEl = triggerEl;
    this._options = __assign(__assign({}, Default), options);
    this._init();
  }
  Dismiss.prototype._init = function () {
    var _this = this;
    if (this._triggerEl) {
      this._triggerEl.addEventListener('click', function () {
        _this.hide();
      });
    }
  };
  Dismiss.prototype.hide = function () {
    var _this = this;
    this._targetEl.classList.add(this._options.transition, "duration-".concat(this._options.duration), this._options.timing, 'opacity-0');
    setTimeout(function () {
      _this._targetEl.classList.add('hidden');
    }, this._options.duration);
    // callback function
    this._options.onHide(this, this._targetEl);
  };
  return Dismiss;
}();
if (typeof window !== 'undefined') {
  window.Dismiss = Dismiss;
}
function initDismisses() {
  document.querySelectorAll('[data-dismiss-target]').forEach(function ($triggerEl) {
    var targetId = $triggerEl.getAttribute('data-dismiss-target');
    var $dismissEl = document.querySelector(targetId);
    if ($dismissEl) {
      new Dismiss($dismissEl, $triggerEl);
    } else {
      console.error("The dismiss element with id \"".concat(targetId, "\" does not exist. Please check the data-dismiss-target attribute."));
    }
  });
}
exports.initDismisses = initDismisses;
exports["default"] = Dismiss;

},{}],667:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],668:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],669:[function(require,module,exports){
"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDrawers = void 0;
var Default = {
  placement: 'left',
  bodyScrolling: false,
  backdrop: true,
  edge: false,
  edgeOffset: 'bottom-[60px]',
  backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30',
  onShow: function onShow() {},
  onHide: function onHide() {},
  onToggle: function onToggle() {}
};
var Drawer = /** @class */function () {
  function Drawer(targetEl, options) {
    if (targetEl === void 0) {
      targetEl = null;
    }
    if (options === void 0) {
      options = Default;
    }
    this._targetEl = targetEl;
    this._options = __assign(__assign({}, Default), options);
    this._visible = false;
    this._init();
  }
  Drawer.prototype._init = function () {
    var _this = this;
    // set initial accessibility attributes
    if (this._targetEl) {
      this._targetEl.setAttribute('aria-hidden', 'true');
      this._targetEl.classList.add('transition-transform');
    }
    // set base placement classes
    this._getPlacementClasses(this._options.placement).base.map(function (c) {
      _this._targetEl.classList.add(c);
    });
    // add keyboard event listener to document
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        // if 'Escape' key is pressed
        if (_this.isVisible()) {
          // if the Drawer is visible
          _this.hide(); // hide the Drawer
        }
      }
    });
  };

  Drawer.prototype.hide = function () {
    var _this = this;
    // based on the edge option show placement classes
    if (this._options.edge) {
      this._getPlacementClasses(this._options.placement + '-edge').active.map(function (c) {
        _this._targetEl.classList.remove(c);
      });
      this._getPlacementClasses(this._options.placement + '-edge').inactive.map(function (c) {
        _this._targetEl.classList.add(c);
      });
    } else {
      this._getPlacementClasses(this._options.placement).active.map(function (c) {
        _this._targetEl.classList.remove(c);
      });
      this._getPlacementClasses(this._options.placement).inactive.map(function (c) {
        _this._targetEl.classList.add(c);
      });
    }
    // set accessibility attributes
    this._targetEl.setAttribute('aria-hidden', 'true');
    this._targetEl.removeAttribute('aria-modal');
    this._targetEl.removeAttribute('role');
    // enable body scroll
    if (!this._options.bodyScrolling) {
      document.body.classList.remove('overflow-hidden');
    }
    // destroy backdrop
    if (this._options.backdrop) {
      this._destroyBackdropEl();
    }
    this._visible = false;
    // callback function
    this._options.onHide(this);
  };
  Drawer.prototype.show = function () {
    var _this = this;
    if (this._options.edge) {
      this._getPlacementClasses(this._options.placement + '-edge').active.map(function (c) {
        _this._targetEl.classList.add(c);
      });
      this._getPlacementClasses(this._options.placement + '-edge').inactive.map(function (c) {
        _this._targetEl.classList.remove(c);
      });
    } else {
      this._getPlacementClasses(this._options.placement).active.map(function (c) {
        _this._targetEl.classList.add(c);
      });
      this._getPlacementClasses(this._options.placement).inactive.map(function (c) {
        _this._targetEl.classList.remove(c);
      });
    }
    // set accessibility attributes
    this._targetEl.setAttribute('aria-modal', 'true');
    this._targetEl.setAttribute('role', 'dialog');
    this._targetEl.removeAttribute('aria-hidden');
    // disable body scroll
    if (!this._options.bodyScrolling) {
      document.body.classList.add('overflow-hidden');
    }
    // show backdrop
    if (this._options.backdrop) {
      this._createBackdrop();
    }
    this._visible = true;
    // callback function
    this._options.onShow(this);
  };
  Drawer.prototype.toggle = function () {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  };
  Drawer.prototype._createBackdrop = function () {
    var _a;
    var _this = this;
    if (!this._visible) {
      var backdropEl = document.createElement('div');
      backdropEl.setAttribute('drawer-backdrop', '');
      (_a = backdropEl.classList).add.apply(_a, this._options.backdropClasses.split(' '));
      document.querySelector('body').append(backdropEl);
      backdropEl.addEventListener('click', function () {
        _this.hide();
      });
    }
  };
  Drawer.prototype._destroyBackdropEl = function () {
    if (this._visible) {
      document.querySelector('[drawer-backdrop]').remove();
    }
  };
  Drawer.prototype._getPlacementClasses = function (placement) {
    switch (placement) {
      case 'top':
        return {
          base: ['top-0', 'left-0', 'right-0'],
          active: ['transform-none'],
          inactive: ['-translate-y-full']
        };
      case 'right':
        return {
          base: ['right-0', 'top-0'],
          active: ['transform-none'],
          inactive: ['translate-x-full']
        };
      case 'bottom':
        return {
          base: ['bottom-0', 'left-0', 'right-0'],
          active: ['transform-none'],
          inactive: ['translate-y-full']
        };
      case 'left':
        return {
          base: ['left-0', 'top-0'],
          active: ['transform-none'],
          inactive: ['-translate-x-full']
        };
      case 'bottom-edge':
        return {
          base: ['left-0', 'top-0'],
          active: ['transform-none'],
          inactive: ['translate-y-full', this._options.edgeOffset]
        };
      default:
        return {
          base: ['left-0', 'top-0'],
          active: ['transform-none'],
          inactive: ['-translate-x-full']
        };
    }
  };
  Drawer.prototype.isHidden = function () {
    return !this._visible;
  };
  Drawer.prototype.isVisible = function () {
    return this._visible;
  };
  return Drawer;
}();
if (typeof window !== 'undefined') {
  window.Drawer = Drawer;
}
var getDrawerInstance = function getDrawerInstance(id, instances) {
  if (instances.some(function (drawerInstance) {
    return drawerInstance.id === id;
  })) {
    return instances.find(function (drawerInstance) {
      return drawerInstance.id === id;
    });
  }
};
function initDrawers() {
  var drawerInstances = [];
  document.querySelectorAll('[data-drawer-target]').forEach(function ($triggerEl) {
    // mandatory
    var drawerId = $triggerEl.getAttribute('data-drawer-target');
    var $drawerEl = document.getElementById(drawerId);
    if ($drawerEl) {
      // optional
      var placement = $triggerEl.getAttribute('data-drawer-placement');
      var bodyScrolling = $triggerEl.getAttribute('data-drawer-body-scrolling');
      var backdrop = $triggerEl.getAttribute('data-drawer-backdrop');
      var edge = $triggerEl.getAttribute('data-drawer-edge');
      var edgeOffset = $triggerEl.getAttribute('data-drawer-edge-offset');
      if (!getDrawerInstance(drawerId, drawerInstances)) {
        drawerInstances.push({
          id: drawerId,
          object: new Drawer($drawerEl, {
            placement: placement ? placement : Default.placement,
            bodyScrolling: bodyScrolling ? bodyScrolling === 'true' ? true : false : Default.bodyScrolling,
            backdrop: backdrop ? backdrop === 'true' ? true : false : Default.backdrop,
            edge: edge ? edge === 'true' ? true : false : Default.edge,
            edgeOffset: edgeOffset ? edgeOffset : Default.edgeOffset
          })
        });
      }
    } else {
      console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
    }
  });
  document.querySelectorAll('[data-drawer-toggle]').forEach(function ($triggerEl) {
    var drawerId = $triggerEl.getAttribute('data-drawer-toggle');
    var $drawerEl = document.getElementById(drawerId);
    if ($drawerEl) {
      var drawer_1 = getDrawerInstance(drawerId, drawerInstances);
      if (drawer_1) {
        $triggerEl.addEventListener('click', function () {
          drawer_1.object.toggle();
        });
      } else {
        console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
      }
    } else {
      console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
    }
  });
  document.querySelectorAll('[data-drawer-dismiss], [data-drawer-hide]').forEach(function ($triggerEl) {
    var drawerId = $triggerEl.getAttribute('data-drawer-dismiss') ? $triggerEl.getAttribute('data-drawer-dismiss') : $triggerEl.getAttribute('data-drawer-hide');
    var $drawerEl = document.getElementById(drawerId);
    if ($drawerEl) {
      var drawer_2 = getDrawerInstance(drawerId, drawerInstances);
      if (drawer_2) {
        $triggerEl.addEventListener('click', function () {
          drawer_2.object.hide();
        });
      } else {
        console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
      }
    } else {
      console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id"));
    }
  });
  document.querySelectorAll('[data-drawer-show]').forEach(function ($triggerEl) {
    var drawerId = $triggerEl.getAttribute('data-drawer-show');
    var $drawerEl = document.getElementById(drawerId);
    if ($drawerEl) {
      var drawer_3 = getDrawerInstance(drawerId, drawerInstances);
      if (drawer_3) {
        $triggerEl.addEventListener('click', function () {
          drawer_3.object.show();
        });
      } else {
        console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
      }
    } else {
      console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
    }
  });
}
exports.initDrawers = initDrawers;
exports["default"] = Drawer;

},{}],670:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],671:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],672:[function(require,module,exports){
"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDropdowns = void 0;
/* eslint-disable @typescript-eslint/no-empty-function */
var core_1 = require("@popperjs/core");
var Default = {
  placement: 'bottom',
  triggerType: 'click',
  offsetSkidding: 0,
  offsetDistance: 10,
  delay: 300,
  onShow: function onShow() {},
  onHide: function onHide() {},
  onToggle: function onToggle() {}
};
var Dropdown = /** @class */function () {
  function Dropdown(targetElement, triggerElement, options) {
    if (targetElement === void 0) {
      targetElement = null;
    }
    if (triggerElement === void 0) {
      triggerElement = null;
    }
    if (options === void 0) {
      options = Default;
    }
    this._targetEl = targetElement;
    this._triggerEl = triggerElement;
    this._options = __assign(__assign({}, Default), options);
    this._popperInstance = this._createPopperInstance();
    this._visible = false;
    this._init();
  }
  Dropdown.prototype._init = function () {
    if (this._triggerEl) {
      this._setupEventListeners();
    }
  };
  Dropdown.prototype._setupEventListeners = function () {
    var _this = this;
    var triggerEvents = this._getTriggerEvents();
    // click event handling for trigger element
    if (this._options.triggerType === 'click') {
      triggerEvents.showEvents.forEach(function (ev) {
        _this._triggerEl.addEventListener(ev, function () {
          _this.toggle();
        });
      });
    }
    // hover event handling for trigger element
    if (this._options.triggerType === 'hover') {
      triggerEvents.showEvents.forEach(function (ev) {
        _this._triggerEl.addEventListener(ev, function () {
          if (ev === 'click') {
            _this.toggle();
          } else {
            setTimeout(function () {
              _this.show();
            }, _this._options.delay);
          }
        });
        _this._targetEl.addEventListener(ev, function () {
          _this.show();
        });
      });
      triggerEvents.hideEvents.forEach(function (ev) {
        _this._triggerEl.addEventListener(ev, function () {
          setTimeout(function () {
            if (!_this._targetEl.matches(':hover')) {
              _this.hide();
            }
          }, _this._options.delay);
        });
        _this._targetEl.addEventListener(ev, function () {
          setTimeout(function () {
            if (!_this._triggerEl.matches(':hover')) {
              _this.hide();
            }
          }, _this._options.delay);
        });
      });
    }
  };
  Dropdown.prototype._createPopperInstance = function () {
    return (0, core_1.createPopper)(this._triggerEl, this._targetEl, {
      placement: this._options.placement,
      modifiers: [{
        name: 'offset',
        options: {
          offset: [this._options.offsetSkidding, this._options.offsetDistance]
        }
      }]
    });
  };
  Dropdown.prototype._setupClickOutsideListener = function () {
    var _this = this;
    this._clickOutsideEventListener = function (ev) {
      _this._handleClickOutside(ev, _this._targetEl);
    };
    document.body.addEventListener('click', this._clickOutsideEventListener, true);
  };
  Dropdown.prototype._removeClickOutsideListener = function () {
    document.body.removeEventListener('click', this._clickOutsideEventListener, true);
  };
  Dropdown.prototype._handleClickOutside = function (ev, targetEl) {
    var clickedEl = ev.target;
    if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && this.isVisible()) {
      this.hide();
    }
  };
  Dropdown.prototype._getTriggerEvents = function () {
    switch (this._options.triggerType) {
      case 'hover':
        return {
          showEvents: ['mouseenter', 'click'],
          hideEvents: ['mouseleave']
        };
      case 'click':
        return {
          showEvents: ['click'],
          hideEvents: []
        };
      case 'none':
        return {
          showEvents: [],
          hideEvents: []
        };
      default:
        return {
          showEvents: ['click'],
          hideEvents: []
        };
    }
  };
  Dropdown.prototype.toggle = function () {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
    this._options.onToggle(this);
  };
  Dropdown.prototype.isVisible = function () {
    return this._visible;
  };
  Dropdown.prototype.show = function () {
    this._targetEl.classList.remove('hidden');
    this._targetEl.classList.add('block');
    // Enable the event listeners
    this._popperInstance.setOptions(function (options) {
      return __assign(__assign({}, options), {
        modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [{
          name: 'eventListeners',
          enabled: true
        }], false)
      });
    });
    this._setupClickOutsideListener();
    // Update its position
    this._popperInstance.update();
    this._visible = true;
    // callback function
    this._options.onShow(this);
  };
  Dropdown.prototype.hide = function () {
    this._targetEl.classList.remove('block');
    this._targetEl.classList.add('hidden');
    // Disable the event listeners
    this._popperInstance.setOptions(function (options) {
      return __assign(__assign({}, options), {
        modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [{
          name: 'eventListeners',
          enabled: false
        }], false)
      });
    });
    this._visible = false;
    this._removeClickOutsideListener();
    // callback function
    this._options.onHide(this);
  };
  return Dropdown;
}();
if (typeof window !== 'undefined') {
  window.Dropdown = Dropdown;
}
function initDropdowns() {
  document.querySelectorAll('[data-dropdown-toggle]').forEach(function ($triggerEl) {
    var dropdownId = $triggerEl.getAttribute('data-dropdown-toggle');
    var $dropdownEl = document.getElementById(dropdownId);
    if ($dropdownEl) {
      var placement = $triggerEl.getAttribute('data-dropdown-placement');
      var offsetSkidding = $triggerEl.getAttribute('data-dropdown-offset-skidding');
      var offsetDistance = $triggerEl.getAttribute('data-dropdown-offset-distance');
      var triggerType = $triggerEl.getAttribute('data-dropdown-trigger');
      var delay = $triggerEl.getAttribute('data-dropdown-delay');
      new Dropdown($dropdownEl, $triggerEl, {
        placement: placement ? placement : Default.placement,
        triggerType: triggerType ? triggerType : Default.triggerType,
        offsetSkidding: offsetSkidding ? parseInt(offsetSkidding) : Default.offsetSkidding,
        offsetDistance: offsetDistance ? parseInt(offsetDistance) : Default.offsetDistance,
        delay: delay ? parseInt(delay) : Default.delay
      });
    } else {
      console.error("The dropdown element with id \"".concat(dropdownId, "\" does not exist. Please check the data-dropdown-toggle attribute."));
    }
  });
}
exports.initDropdowns = initDropdowns;
exports["default"] = Dropdown;

},{"@popperjs/core":1}],673:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],674:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],675:[function(require,module,exports){
"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initModals = void 0;
var Default = {
  placement: 'center',
  backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
  backdrop: 'dynamic',
  closable: true,
  onHide: function onHide() {},
  onShow: function onShow() {},
  onToggle: function onToggle() {}
};
var Modal = /** @class */function () {
  function Modal(targetEl, options) {
    if (targetEl === void 0) {
      targetEl = null;
    }
    if (options === void 0) {
      options = Default;
    }
    this._targetEl = targetEl;
    this._options = __assign(__assign({}, Default), options);
    this._isHidden = true;
    this._backdropEl = null;
    this._init();
  }
  Modal.prototype._init = function () {
    var _this = this;
    if (this._targetEl) {
      this._getPlacementClasses().map(function (c) {
        _this._targetEl.classList.add(c);
      });
    }
  };
  Modal.prototype._createBackdrop = function () {
    var _a;
    if (this._isHidden) {
      var backdropEl = document.createElement('div');
      backdropEl.setAttribute('modal-backdrop', '');
      (_a = backdropEl.classList).add.apply(_a, this._options.backdropClasses.split(' '));
      document.querySelector('body').append(backdropEl);
      this._backdropEl = backdropEl;
    }
  };
  Modal.prototype._destroyBackdropEl = function () {
    if (!this._isHidden) {
      document.querySelector('[modal-backdrop]').remove();
    }
  };
  Modal.prototype._setupModalCloseEventListeners = function () {
    var _this = this;
    if (this._options.backdrop === 'dynamic') {
      this._clickOutsideEventListener = function (ev) {
        _this._handleOutsideClick(ev.target);
      };
      this._targetEl.addEventListener('click', this._clickOutsideEventListener, true);
    }
    this._keydownEventListener = function (ev) {
      if (ev.key === 'Escape') {
        _this.hide();
      }
    };
    document.body.addEventListener('keydown', this._keydownEventListener, true);
  };
  Modal.prototype._removeModalCloseEventListeners = function () {
    if (this._options.backdrop === 'dynamic') {
      this._targetEl.removeEventListener('click', this._clickOutsideEventListener, true);
    }
    document.body.removeEventListener('keydown', this._keydownEventListener, true);
  };
  Modal.prototype._handleOutsideClick = function (target) {
    if (target === this._targetEl || target === this._backdropEl && this.isVisible()) {
      this.hide();
    }
  };
  Modal.prototype._getPlacementClasses = function () {
    switch (this._options.placement) {
      // top
      case 'top-left':
        return ['justify-start', 'items-start'];
      case 'top-center':
        return ['justify-center', 'items-start'];
      case 'top-right':
        return ['justify-end', 'items-start'];
      // center
      case 'center-left':
        return ['justify-start', 'items-center'];
      case 'center':
        return ['justify-center', 'items-center'];
      case 'center-right':
        return ['justify-end', 'items-center'];
      // bottom
      case 'bottom-left':
        return ['justify-start', 'items-end'];
      case 'bottom-center':
        return ['justify-center', 'items-end'];
      case 'bottom-right':
        return ['justify-end', 'items-end'];
      default:
        return ['justify-center', 'items-center'];
    }
  };
  Modal.prototype.toggle = function () {
    if (this._isHidden) {
      this.show();
    } else {
      this.hide();
    }
    // callback function
    this._options.onToggle(this);
  };
  Modal.prototype.show = function () {
    if (this.isHidden) {
      this._targetEl.classList.add('flex');
      this._targetEl.classList.remove('hidden');
      this._targetEl.setAttribute('aria-modal', 'true');
      this._targetEl.setAttribute('role', 'dialog');
      this._targetEl.removeAttribute('aria-hidden');
      this._createBackdrop();
      this._isHidden = false;
      // prevent body scroll
      document.body.classList.add('overflow-hidden');
      // Add keyboard event listener to the document
      if (this._options.closable) {
        this._setupModalCloseEventListeners();
      }
      // callback function
      this._options.onShow(this);
    }
  };
  Modal.prototype.hide = function () {
    if (this.isVisible) {
      this._targetEl.classList.add('hidden');
      this._targetEl.classList.remove('flex');
      this._targetEl.setAttribute('aria-hidden', 'true');
      this._targetEl.removeAttribute('aria-modal');
      this._targetEl.removeAttribute('role');
      this._destroyBackdropEl();
      this._isHidden = true;
      // re-apply body scroll
      document.body.classList.remove('overflow-hidden');
      if (this._options.closable) {
        this._removeModalCloseEventListeners();
      }
      // callback function
      this._options.onHide(this);
    }
  };
  Modal.prototype.isVisible = function () {
    return !this._isHidden;
  };
  Modal.prototype.isHidden = function () {
    return this._isHidden;
  };
  return Modal;
}();
if (typeof window !== 'undefined') {
  window.Modal = Modal;
}
var getModalInstance = function getModalInstance(id, instances) {
  if (instances.some(function (modalInstance) {
    return modalInstance.id === id;
  })) {
    return instances.find(function (modalInstance) {
      return modalInstance.id === id;
    });
  }
  return null;
};
function initModals() {
  var modalInstances = [];
  // initiate modal based on data-modal-target
  document.querySelectorAll('[data-modal-target]').forEach(function ($triggerEl) {
    var modalId = $triggerEl.getAttribute('data-modal-target');
    var $modalEl = document.getElementById(modalId);
    if ($modalEl) {
      var placement = $modalEl.getAttribute('data-modal-placement');
      var backdrop = $modalEl.getAttribute('data-modal-backdrop');
      if (!getModalInstance(modalId, modalInstances)) {
        modalInstances.push({
          id: modalId,
          object: new Modal($modalEl, {
            placement: placement ? placement : Default.placement,
            backdrop: backdrop ? backdrop : Default.backdrop
          })
        });
      }
    } else {
      console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-target attribute points to the correct modal id?."));
    }
  });
  // support pre v1.6.0 data-modal-toggle initialization
  document.querySelectorAll('[data-modal-toggle]').forEach(function ($triggerEl) {
    var modalId = $triggerEl.getAttribute('data-modal-toggle');
    var $modalEl = document.getElementById(modalId);
    if ($modalEl) {
      var placement = $modalEl.getAttribute('data-modal-placement');
      var backdrop = $modalEl.getAttribute('data-modal-backdrop');
      var modal_1 = getModalInstance(modalId, modalInstances);
      if (!modal_1) {
        modal_1 = {
          id: modalId,
          object: new Modal($modalEl, {
            placement: placement ? placement : Default.placement,
            backdrop: backdrop ? backdrop : Default.backdrop
          })
        };
        modalInstances.push(modal_1);
      }
      $triggerEl.addEventListener('click', function () {
        modal_1.object.toggle();
      });
    } else {
      console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-toggle attribute points to the correct modal id?"));
    }
  });
  // show modal on click if exists based on id
  document.querySelectorAll('[data-modal-show]').forEach(function ($triggerEl) {
    var modalId = $triggerEl.getAttribute('data-modal-show');
    var $modalEl = document.getElementById(modalId);
    if ($modalEl) {
      var modal_2 = getModalInstance(modalId, modalInstances);
      if (modal_2) {
        $triggerEl.addEventListener('click', function () {
          if (modal_2.object.isHidden) {
            modal_2.object.show();
          }
        });
      } else {
        console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
      }
    } else {
      console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-show attribute points to the correct modal id?"));
    }
  });
  // hide modal on click if exists based on id
  document.querySelectorAll('[data-modal-hide]').forEach(function ($triggerEl) {
    var modalId = $triggerEl.getAttribute('data-modal-hide');
    var $modalEl = document.getElementById(modalId);
    if ($modalEl) {
      var modal_3 = getModalInstance(modalId, modalInstances);
      if (modal_3) {
        $triggerEl.addEventListener('click', function () {
          if (modal_3.object.isVisible) {
            modal_3.object.hide();
          }
        });
      } else {
        console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
      }
    } else {
      console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-hide attribute points to the correct modal id?"));
    }
  });
}
exports.initModals = initModals;
exports["default"] = Modal;

},{}],676:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],677:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],678:[function(require,module,exports){
"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPopovers = void 0;
/* eslint-disable @typescript-eslint/no-empty-function */
var core_1 = require("@popperjs/core");
var Default = {
  placement: 'top',
  offset: 10,
  triggerType: 'hover',
  onShow: function onShow() {},
  onHide: function onHide() {},
  onToggle: function onToggle() {}
};
var Popover = /** @class */function () {
  function Popover(targetEl, triggerEl, options) {
    if (targetEl === void 0) {
      targetEl = null;
    }
    if (triggerEl === void 0) {
      triggerEl = null;
    }
    if (options === void 0) {
      options = Default;
    }
    this._targetEl = targetEl;
    this._triggerEl = triggerEl;
    this._options = __assign(__assign({}, Default), options);
    this._popperInstance = this._createPopperInstance();
    this._visible = false;
    this._init();
  }
  Popover.prototype._init = function () {
    if (this._triggerEl) {
      this._setupEventListeners();
    }
  };
  Popover.prototype._setupEventListeners = function () {
    var _this = this;
    var triggerEvents = this._getTriggerEvents();
    triggerEvents.showEvents.forEach(function (ev) {
      _this._triggerEl.addEventListener(ev, function () {
        _this.show();
      });
      _this._targetEl.addEventListener(ev, function () {
        _this.show();
      });
    });
    triggerEvents.hideEvents.forEach(function (ev) {
      _this._triggerEl.addEventListener(ev, function () {
        setTimeout(function () {
          if (!_this._targetEl.matches(':hover')) {
            _this.hide();
          }
        }, 100);
      });
      _this._targetEl.addEventListener(ev, function () {
        setTimeout(function () {
          if (!_this._triggerEl.matches(':hover')) {
            _this.hide();
          }
        }, 100);
      });
    });
  };
  Popover.prototype._createPopperInstance = function () {
    return (0, core_1.createPopper)(this._triggerEl, this._targetEl, {
      placement: this._options.placement,
      modifiers: [{
        name: 'offset',
        options: {
          offset: [0, this._options.offset]
        }
      }]
    });
  };
  Popover.prototype._getTriggerEvents = function () {
    switch (this._options.triggerType) {
      case 'hover':
        return {
          showEvents: ['mouseenter', 'focus'],
          hideEvents: ['mouseleave', 'blur']
        };
      case 'click':
        return {
          showEvents: ['click', 'focus'],
          hideEvents: ['focusout', 'blur']
        };
      case 'none':
        return {
          showEvents: [],
          hideEvents: []
        };
      default:
        return {
          showEvents: ['mouseenter', 'focus'],
          hideEvents: ['mouseleave', 'blur']
        };
    }
  };
  Popover.prototype._setupClickOutsideListener = function () {
    var _this = this;
    this._clickOutsideEventListener = function (ev) {
      _this._handleClickOutside(ev, _this._targetEl);
    };
    document.body.addEventListener('click', this._clickOutsideEventListener, true);
  };
  Popover.prototype._removeClickOutsideListener = function () {
    document.body.removeEventListener('click', this._clickOutsideEventListener, true);
  };
  Popover.prototype._handleClickOutside = function (ev, targetEl) {
    var clickedEl = ev.target;
    if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && this.isVisible()) {
      this.hide();
    }
  };
  Popover.prototype.isVisible = function () {
    return this._visible;
  };
  Popover.prototype.toggle = function () {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
    this._options.onToggle(this);
  };
  Popover.prototype.show = function () {
    this._targetEl.classList.remove('opacity-0', 'invisible');
    this._targetEl.classList.add('opacity-100', 'visible');
    // Enable the event listeners
    this._popperInstance.setOptions(function (options) {
      return __assign(__assign({}, options), {
        modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [{
          name: 'eventListeners',
          enabled: true
        }], false)
      });
    });
    // handle click outside
    this._setupClickOutsideListener();
    // Update its position
    this._popperInstance.update();
    // set visibility to true
    this._visible = true;
    // callback function
    this._options.onShow(this);
  };
  Popover.prototype.hide = function () {
    this._targetEl.classList.remove('opacity-100', 'visible');
    this._targetEl.classList.add('opacity-0', 'invisible');
    // Disable the event listeners
    this._popperInstance.setOptions(function (options) {
      return __assign(__assign({}, options), {
        modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [{
          name: 'eventListeners',
          enabled: false
        }], false)
      });
    });
    // handle click outside
    this._removeClickOutsideListener();
    // set visibility to false
    this._visible = false;
    // callback function
    this._options.onHide(this);
  };
  return Popover;
}();
if (typeof window !== 'undefined') {
  window.Popover = Popover;
}
function initPopovers() {
  document.querySelectorAll('[data-popover-target]').forEach(function ($triggerEl) {
    var popoverID = $triggerEl.getAttribute('data-popover-target');
    var $popoverEl = document.getElementById(popoverID);
    if ($popoverEl) {
      var triggerType = $triggerEl.getAttribute('data-popover-trigger');
      var placement = $triggerEl.getAttribute('data-popover-placement');
      var offset = $triggerEl.getAttribute('data-popover-offset');
      new Popover($popoverEl, $triggerEl, {
        placement: placement ? placement : Default.placement,
        offset: offset ? parseInt(offset) : Default.offset,
        triggerType: triggerType ? triggerType : Default.triggerType
      });
    } else {
      console.error("The popover element with id \"".concat(popoverID, "\" does not exist. Please check the data-popover-target attribute."));
    }
  });
}
exports.initPopovers = initPopovers;
exports["default"] = Popover;

},{"@popperjs/core":1}],679:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],680:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],681:[function(require,module,exports){
"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initTabs = void 0;
var Default = {
  defaultTabId: null,
  activeClasses: 'text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500',
  inactiveClasses: 'dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300',
  onShow: function onShow() {}
};
var Tabs = /** @class */function () {
  function Tabs(items, options) {
    if (items === void 0) {
      items = [];
    }
    if (options === void 0) {
      options = Default;
    }
    this._items = items;
    this._activeTab = options ? this.getTab(options.defaultTabId) : null;
    this._options = __assign(__assign({}, Default), options);
    this._init();
  }
  Tabs.prototype._init = function () {
    var _this = this;
    if (this._items.length) {
      // set the first tab as active if not set by explicitly
      if (!this._activeTab) {
        this._setActiveTab(this._items[0]);
      }
      // force show the first default tab
      this.show(this._activeTab.id, true);
      // show tab content based on click
      this._items.map(function (tab) {
        tab.triggerEl.addEventListener('click', function () {
          _this.show(tab.id);
        });
      });
    }
  };
  Tabs.prototype.getActiveTab = function () {
    return this._activeTab;
  };
  Tabs.prototype._setActiveTab = function (tab) {
    this._activeTab = tab;
  };
  Tabs.prototype.getTab = function (id) {
    return this._items.filter(function (t) {
      return t.id === id;
    })[0];
  };
  Tabs.prototype.show = function (id, forceShow) {
    var _a, _b;
    var _this = this;
    if (forceShow === void 0) {
      forceShow = false;
    }
    var tab = this.getTab(id);
    // don't do anything if already active
    if (tab === this._activeTab && !forceShow) {
      return;
    }
    // hide other tabs
    this._items.map(function (t) {
      var _a, _b;
      if (t !== tab) {
        (_a = t.triggerEl.classList).remove.apply(_a, _this._options.activeClasses.split(' '));
        (_b = t.triggerEl.classList).add.apply(_b, _this._options.inactiveClasses.split(' '));
        t.targetEl.classList.add('hidden');
        t.triggerEl.setAttribute('aria-selected', 'false');
      }
    });
    // show active tab
    (_a = tab.triggerEl.classList).add.apply(_a, this._options.activeClasses.split(' '));
    (_b = tab.triggerEl.classList).remove.apply(_b, this._options.inactiveClasses.split(' '));
    tab.triggerEl.setAttribute('aria-selected', 'true');
    tab.targetEl.classList.remove('hidden');
    this._setActiveTab(tab);
    // callback function
    this._options.onShow(this, tab);
  };
  return Tabs;
}();
if (typeof window !== 'undefined') {
  window.Tabs = Tabs;
}
function initTabs() {
  document.querySelectorAll('[data-tabs-toggle]').forEach(function ($triggerEl) {
    var tabItems = [];
    var defaultTabId = null;
    $triggerEl.querySelectorAll('[role="tab"]').forEach(function ($triggerEl) {
      var isActive = $triggerEl.getAttribute('aria-selected') === 'true';
      var tab = {
        id: $triggerEl.getAttribute('data-tabs-target'),
        triggerEl: $triggerEl,
        targetEl: document.querySelector($triggerEl.getAttribute('data-tabs-target'))
      };
      tabItems.push(tab);
      if (isActive) {
        defaultTabId = tab.id;
      }
    });
    new Tabs(tabItems, {
      defaultTabId: defaultTabId
    });
  });
}
exports.initTabs = initTabs;
exports["default"] = Tabs;

},{}],682:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],683:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],684:[function(require,module,exports){
"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initTooltips = void 0;
/* eslint-disable @typescript-eslint/no-empty-function */
var core_1 = require("@popperjs/core");
var Default = {
  placement: 'top',
  triggerType: 'hover',
  onShow: function onShow() {},
  onHide: function onHide() {},
  onToggle: function onToggle() {}
};
var Tooltip = /** @class */function () {
  function Tooltip(targetEl, triggerEl, options) {
    if (targetEl === void 0) {
      targetEl = null;
    }
    if (triggerEl === void 0) {
      triggerEl = null;
    }
    if (options === void 0) {
      options = Default;
    }
    this._targetEl = targetEl;
    this._triggerEl = triggerEl;
    this._options = __assign(__assign({}, Default), options);
    this._popperInstance = this._createPopperInstance();
    this._visible = false;
    this._init();
  }
  Tooltip.prototype._init = function () {
    if (this._triggerEl) {
      this._setupEventListeners();
    }
  };
  Tooltip.prototype._setupEventListeners = function () {
    var _this = this;
    var triggerEvents = this._getTriggerEvents();
    triggerEvents.showEvents.forEach(function (ev) {
      _this._triggerEl.addEventListener(ev, function () {
        _this.show();
      });
    });
    triggerEvents.hideEvents.forEach(function (ev) {
      _this._triggerEl.addEventListener(ev, function () {
        _this.hide();
      });
    });
  };
  Tooltip.prototype._createPopperInstance = function () {
    return (0, core_1.createPopper)(this._triggerEl, this._targetEl, {
      placement: this._options.placement,
      modifiers: [{
        name: 'offset',
        options: {
          offset: [0, 8]
        }
      }]
    });
  };
  Tooltip.prototype._getTriggerEvents = function () {
    switch (this._options.triggerType) {
      case 'hover':
        return {
          showEvents: ['mouseenter', 'focus'],
          hideEvents: ['mouseleave', 'blur']
        };
      case 'click':
        return {
          showEvents: ['click', 'focus'],
          hideEvents: ['focusout', 'blur']
        };
      case 'none':
        return {
          showEvents: [],
          hideEvents: []
        };
      default:
        return {
          showEvents: ['mouseenter', 'focus'],
          hideEvents: ['mouseleave', 'blur']
        };
    }
  };
  Tooltip.prototype._setupClickOutsideListener = function () {
    var _this = this;
    this._clickOutsideEventListener = function (ev) {
      _this._handleClickOutside(ev, _this._targetEl);
    };
    document.body.addEventListener('click', this._clickOutsideEventListener, true);
  };
  Tooltip.prototype._removeClickOutsideListener = function () {
    document.body.removeEventListener('click', this._clickOutsideEventListener, true);
  };
  Tooltip.prototype._handleClickOutside = function (ev, targetEl) {
    var clickedEl = ev.target;
    if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && this.isVisible()) {
      this.hide();
    }
  };
  Tooltip.prototype.isVisible = function () {
    return this._visible;
  };
  Tooltip.prototype.toggle = function () {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  };
  Tooltip.prototype.show = function () {
    this._targetEl.classList.remove('opacity-0', 'invisible');
    this._targetEl.classList.add('opacity-100', 'visible');
    // Enable the event listeners
    this._popperInstance.setOptions(function (options) {
      return __assign(__assign({}, options), {
        modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [{
          name: 'eventListeners',
          enabled: true
        }], false)
      });
    });
    // handle click outside
    this._setupClickOutsideListener();
    // Update its position
    this._popperInstance.update();
    // set visibility
    this._visible = true;
    // callback function
    this._options.onShow(this);
  };
  Tooltip.prototype.hide = function () {
    this._targetEl.classList.remove('opacity-100', 'visible');
    this._targetEl.classList.add('opacity-0', 'invisible');
    // Disable the event listeners
    this._popperInstance.setOptions(function (options) {
      return __assign(__assign({}, options), {
        modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [{
          name: 'eventListeners',
          enabled: false
        }], false)
      });
    });
    // handle click outside
    this._removeClickOutsideListener();
    // set visibility
    this._visible = false;
    // callback function
    this._options.onHide(this);
  };
  return Tooltip;
}();
if (typeof window !== 'undefined') {
  window.Tooltip = Tooltip;
}
function initTooltips() {
  document.querySelectorAll('[data-tooltip-target]').forEach(function ($triggerEl) {
    var tooltipId = $triggerEl.getAttribute('data-tooltip-target');
    var $tooltipEl = document.getElementById(tooltipId);
    if ($tooltipEl) {
      var triggerType = $triggerEl.getAttribute('data-tooltip-trigger');
      var placement = $triggerEl.getAttribute('data-tooltip-placement');
      new Tooltip($tooltipEl, $triggerEl, {
        placement: placement ? placement : Default.placement,
        triggerType: triggerType ? triggerType : Default.triggerType
      });
    } else {
      console.error("The tooltip element with id \"".concat(tooltipId, "\" does not exist. Please check the data-tooltip-target attribute."));
    }
  });
}
exports.initTooltips = initTooltips;
exports["default"] = Tooltip;

},{"@popperjs/core":1}],685:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],686:[function(require,module,exports){
arguments[4][655][0].apply(exports,arguments)
},{"dup":655}],687:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Events = /** @class */function () {
  function Events(eventType, eventFunctions) {
    if (eventFunctions === void 0) {
      eventFunctions = [];
    }
    this._eventType = eventType;
    this._eventFunctions = eventFunctions;
  }
  Events.prototype.init = function () {
    var _this = this;
    this._eventFunctions.forEach(function (eventFunction) {
      if (typeof window !== 'undefined') {
        window.addEventListener(_this._eventType, eventFunction);
      }
    });
  };
  return Events;
}();
exports["default"] = Events;

},{}],688:[function(require,module,exports){
"use strict";

var __createBinding = void 0 && (void 0).__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function get() {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __exportStar = void 0 && (void 0).__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initTooltips = exports.initTabs = exports.initPopovers = exports.initModals = exports.initDropdowns = exports.initDrawers = exports.initDismisses = exports.initDials = exports.initCollapses = exports.initCarousels = exports.initAccordions = exports.Tooltip = exports.Tabs = exports.Popover = exports.Modal = exports.Dropdown = exports.Drawer = exports.Dismiss = exports.Dial = exports.Collapse = exports.Carousel = exports.Accordion = void 0;
var events_1 = require("./dom/events");
var accordion_1 = require("./components/accordion");
var collapse_1 = require("./components/collapse");
var carousel_1 = require("./components/carousel");
var dismiss_1 = require("./components/dismiss");
var dropdown_1 = require("./components/dropdown");
var modal_1 = require("./components/modal");
var drawer_1 = require("./components/drawer");
var tabs_1 = require("./components/tabs");
var tooltip_1 = require("./components/tooltip");
var popover_1 = require("./components/popover");
var dial_1 = require("./components/dial");
// setup events for data attributes
var events = new events_1["default"]('load', [accordion_1.initAccordions, collapse_1.initCollapses, carousel_1.initCarousels, dismiss_1.initDismisses, dropdown_1.initDropdowns, modal_1.initModals, drawer_1.initDrawers, tabs_1.initTabs, tooltip_1.initTooltips, popover_1.initPopovers, dial_1.initDials]);
events.init();
// export all components
var accordion_2 = require("./components/accordion");
Object.defineProperty(exports, "Accordion", {
  enumerable: true,
  get: function get() {
    return accordion_2["default"];
  }
});
var carousel_2 = require("./components/carousel");
Object.defineProperty(exports, "Carousel", {
  enumerable: true,
  get: function get() {
    return carousel_2["default"];
  }
});
var collapse_2 = require("./components/collapse");
Object.defineProperty(exports, "Collapse", {
  enumerable: true,
  get: function get() {
    return collapse_2["default"];
  }
});
var dial_2 = require("./components/dial");
Object.defineProperty(exports, "Dial", {
  enumerable: true,
  get: function get() {
    return dial_2["default"];
  }
});
var dismiss_2 = require("./components/dismiss");
Object.defineProperty(exports, "Dismiss", {
  enumerable: true,
  get: function get() {
    return dismiss_2["default"];
  }
});
var drawer_2 = require("./components/drawer");
Object.defineProperty(exports, "Drawer", {
  enumerable: true,
  get: function get() {
    return drawer_2["default"];
  }
});
var dropdown_2 = require("./components/dropdown");
Object.defineProperty(exports, "Dropdown", {
  enumerable: true,
  get: function get() {
    return dropdown_2["default"];
  }
});
var modal_2 = require("./components/modal");
Object.defineProperty(exports, "Modal", {
  enumerable: true,
  get: function get() {
    return modal_2["default"];
  }
});
var popover_2 = require("./components/popover");
Object.defineProperty(exports, "Popover", {
  enumerable: true,
  get: function get() {
    return popover_2["default"];
  }
});
var tabs_2 = require("./components/tabs");
Object.defineProperty(exports, "Tabs", {
  enumerable: true,
  get: function get() {
    return tabs_2["default"];
  }
});
var tooltip_2 = require("./components/tooltip");
Object.defineProperty(exports, "Tooltip", {
  enumerable: true,
  get: function get() {
    return tooltip_2["default"];
  }
});
// export all types
__exportStar(require("./components/accordion/types"), exports);
__exportStar(require("./components/carousel/types"), exports);
__exportStar(require("./components/collapse/types"), exports);
__exportStar(require("./components/dial/types"), exports);
__exportStar(require("./components/dismiss/types"), exports);
__exportStar(require("./components/drawer/types"), exports);
__exportStar(require("./components/dropdown/types"), exports);
__exportStar(require("./components/modal/types"), exports);
__exportStar(require("./components/popover/types"), exports);
__exportStar(require("./components/tabs/types"), exports);
__exportStar(require("./components/tooltip/types"), exports);
// export all interfaces
__exportStar(require("./components/accordion/interface"), exports);
__exportStar(require("./components/carousel/interface"), exports);
__exportStar(require("./components/collapse/interface"), exports);
__exportStar(require("./components/dial/interface"), exports);
__exportStar(require("./components/dismiss/interface"), exports);
__exportStar(require("./components/drawer/interface"), exports);
__exportStar(require("./components/dropdown/interface"), exports);
__exportStar(require("./components/modal/interface"), exports);
__exportStar(require("./components/popover/interface"), exports);
__exportStar(require("./components/tabs/interface"), exports);
__exportStar(require("./components/tooltip/interface"), exports);
// export init functions
var accordion_3 = require("./components/accordion");
Object.defineProperty(exports, "initAccordions", {
  enumerable: true,
  get: function get() {
    return accordion_3.initAccordions;
  }
});
var carousel_3 = require("./components/carousel");
Object.defineProperty(exports, "initCarousels", {
  enumerable: true,
  get: function get() {
    return carousel_3.initCarousels;
  }
});
var collapse_3 = require("./components/collapse");
Object.defineProperty(exports, "initCollapses", {
  enumerable: true,
  get: function get() {
    return collapse_3.initCollapses;
  }
});
var dial_3 = require("./components/dial");
Object.defineProperty(exports, "initDials", {
  enumerable: true,
  get: function get() {
    return dial_3.initDials;
  }
});
var dismiss_3 = require("./components/dismiss");
Object.defineProperty(exports, "initDismisses", {
  enumerable: true,
  get: function get() {
    return dismiss_3.initDismisses;
  }
});
var drawer_3 = require("./components/drawer");
Object.defineProperty(exports, "initDrawers", {
  enumerable: true,
  get: function get() {
    return drawer_3.initDrawers;
  }
});
var dropdown_3 = require("./components/dropdown");
Object.defineProperty(exports, "initDropdowns", {
  enumerable: true,
  get: function get() {
    return dropdown_3.initDropdowns;
  }
});
var modal_3 = require("./components/modal");
Object.defineProperty(exports, "initModals", {
  enumerable: true,
  get: function get() {
    return modal_3.initModals;
  }
});
var popover_3 = require("./components/popover");
Object.defineProperty(exports, "initPopovers", {
  enumerable: true,
  get: function get() {
    return popover_3.initPopovers;
  }
});
var tabs_3 = require("./components/tabs");
Object.defineProperty(exports, "initTabs", {
  enumerable: true,
  get: function get() {
    return tabs_3.initTabs;
  }
});
var tooltip_3 = require("./components/tooltip");
Object.defineProperty(exports, "initTooltips", {
  enumerable: true,
  get: function get() {
    return tooltip_3.initTooltips;
  }
});

},{"./components/accordion":654,"./components/accordion/interface":655,"./components/accordion/types":656,"./components/carousel":657,"./components/carousel/interface":658,"./components/carousel/types":659,"./components/collapse":660,"./components/collapse/interface":661,"./components/collapse/types":662,"./components/dial":663,"./components/dial/interface":664,"./components/dial/types":665,"./components/dismiss":666,"./components/dismiss/interface":667,"./components/dismiss/types":668,"./components/drawer":669,"./components/drawer/interface":670,"./components/drawer/types":671,"./components/dropdown":672,"./components/dropdown/interface":673,"./components/dropdown/types":674,"./components/modal":675,"./components/modal/interface":676,"./components/modal/types":677,"./components/popover":678,"./components/popover/interface":679,"./components/popover/types":680,"./components/tabs":681,"./components/tabs/interface":682,"./components/tabs/types":683,"./components/tooltip":684,"./components/tooltip/interface":685,"./components/tooltip/types":686,"./dom/events":687}],689:[function(require,module,exports){
"use strict";

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}
(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  }
  // if setTimeout wasn't available but was latter defined
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  }
  // if clearTimeout wasn't available but was latter defined
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
};

// v8 likes predictible objects
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function (name) {
  return [];
};
process.binding = function (name) {
  throw new Error('process.binding is not supported');
};
process.cwd = function () {
  return '/';
};
process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};
process.umask = function () {
  return 0;
};

},{}],690:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _flowbite = require("flowbite");
Object.keys(_flowbite).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _flowbite[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _flowbite[key];
    }
  });
});

},{"flowbite":688}],691:[function(require,module,exports){
"use strict";

require("../libs/flowbite");
require("core-js/actual");
/* eslint-disable @typescript-eslint/no-unused-vars */

var mobile_icon = document.getElementById('mobile-icon');
var mobile_menu = document.getElementById('mobile-menu');
var hamburger_icon = document.querySelector('#mobile-icon i');
function openCloseMenu() {
  mobile_menu.classList.toggle('block');
  mobile_menu.classList.toggle('active');
}
function changeIcon(icon) {
  icon.classList.toggle('fa-xmark');
}
mobile_icon.addEventListener('click', openCloseMenu);

// disable submit form.ajax-handling

document.querySelectorAll('form.ajax-handling').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    return e.preventDefault();
  });
});

},{"../libs/flowbite":690,"core-js/actual":2}]},{},[691]);
