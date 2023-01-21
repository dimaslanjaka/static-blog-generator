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
},{"_process":37}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{}],4:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],5:[function(require,module,exports){
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
      item.el.classList.add('absolute', 'inset-0', 'transition-all', 'transform');
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

},{}],6:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],7:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],8:[function(require,module,exports){
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
        _this._visible ? _this.collapse() : _this.expand();
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

},{}],9:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],10:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],11:[function(require,module,exports){
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
      triggerEventTypes.show.forEach(function (ev) {
        _this._triggerEl.addEventListener(ev, function () {
          _this.show();
        });
        _this._targetEl.addEventListener(ev, function () {
          _this.show();
        });
      });
      triggerEventTypes.hide.forEach(function (ev) {
        _this._parentEl.addEventListener(ev, function () {
          setTimeout(function () {
            if (!_this._parentEl.matches(':hover')) {
              _this.hide();
            }
          }, 100);
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
          show: ['mouseenter', 'focus'],
          hide: ['mouseleave', 'blur']
        };
      case 'click':
        return {
          show: ['click', 'focus'],
          hide: ['focusout', 'blur']
        };
      default:
        return {
          show: ['mouseenter', 'focus'],
          hide: ['mouseleave', 'blur']
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

},{}],12:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],13:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],16:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],19:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],20:[function(require,module,exports){
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
  onShow: function onShow() {},
  onHide: function onHide() {}
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
    var _this = this;
    if (this._triggerEl) {
      this._triggerEl.addEventListener('click', function () {
        _this.toggle();
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
    if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && this._visible) {
      this.hide();
    }
  };
  Dropdown.prototype.toggle = function () {
    if (this._visible) {
      this.hide();
    } else {
      this.show();
    }
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
      new Dropdown($dropdownEl, $triggerEl, {
        placement: placement ? placement : Default.placement,
        offsetSkidding: offsetSkidding ? parseInt(offsetSkidding) : Default.offsetSkidding,
        offsetDistance: offsetDistance ? parseInt(offsetDistance) : Default.offsetDistance
      });
    } else {
      console.error("The dropdown element with id \"".concat(dropdownId, "\" does not exist. Please check the data-dropdown-toggle attribute."));
    }
  });
}
exports.initDropdowns = initDropdowns;
exports["default"] = Dropdown;

},{"@popperjs/core":1}],21:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],22:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],23:[function(require,module,exports){
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
      this._setupModalCloseEventListeners();
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
      this._removeModalCloseEventListeners();
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

},{}],24:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],25:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],26:[function(require,module,exports){
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
  onHide: function onHide() {}
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
    this._init();
  }
  Popover.prototype._init = function () {
    var _this = this;
    if (this._triggerEl) {
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
    }
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
      default:
        return {
          showEvents: ['mouseenter', 'focus'],
          hideEvents: ['mouseleave', 'blur']
        };
    }
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
    // Update its position
    this._popperInstance.update();
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

},{"@popperjs/core":1}],27:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],28:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],31:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],32:[function(require,module,exports){
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
  onHide: function onHide() {}
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
    this._init();
  }
  Tooltip.prototype._init = function () {
    var _this = this;
    if (this._triggerEl) {
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
    }
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
      default:
        return {
          showEvents: ['mouseenter', 'focus'],
          hideEvents: ['mouseleave', 'blur']
        };
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
    // Update its position
    this._popperInstance.update();
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

},{"@popperjs/core":1}],33:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],34:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{"./components/accordion":2,"./components/accordion/interface":3,"./components/accordion/types":4,"./components/carousel":5,"./components/carousel/interface":6,"./components/carousel/types":7,"./components/collapse":8,"./components/collapse/interface":9,"./components/collapse/types":10,"./components/dial":11,"./components/dial/interface":12,"./components/dial/types":13,"./components/dismiss":14,"./components/dismiss/interface":15,"./components/dismiss/types":16,"./components/drawer":17,"./components/drawer/interface":18,"./components/drawer/types":19,"./components/dropdown":20,"./components/dropdown/interface":21,"./components/dropdown/types":22,"./components/modal":23,"./components/modal/interface":24,"./components/modal/types":25,"./components/popover":26,"./components/popover/interface":27,"./components/popover/types":28,"./components/tabs":29,"./components/tabs/interface":30,"./components/tabs/types":31,"./components/tooltip":32,"./components/tooltip/interface":33,"./components/tooltip/types":34,"./dom/events":35}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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

},{"flowbite":36}],39:[function(require,module,exports){
"use strict";

require("../libs/flowbite");
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

},{"../libs/flowbite":38}]},{},[39]);
