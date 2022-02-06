import * as _ from './core.js';
import { protocol, first as first$2, overload } from './core.js';
import * as $ from './reactives.js';
import * as mut from './transients.js';
export { after, append, before, empty, omit, prepend } from './transients.js';

const IContent = _.protocol({
  contents: null
});

function contents2(self, type) {
  return _.filter(function (node) {
    return node.nodeType === type;
  }, IContent.contents(self));
}

const contents$2 = _.overload(null, IContent.contents, contents2);

const IHideable = _.protocol({
  hide: null,
  show: null,
  toggle: null
});

const hide$1 = IHideable.hide;
const show$1 = IHideable.show;
const toggle$1 = IHideable.toggle;

const IHtml = _.protocol({
  html: null
});

const html$1 = IHtml.html;

const IEmbeddable = _.protocol({
  embeddables: null
});

const embeddables$2 = IEmbeddable.embeddables;

function embed3(add, parent, children) {
  var _ref, _ref2, _children, _embeddables, _$mapcat, _ref3, _parent$ownerDocument, _embeddables2, _param, _$each, _ref4;

  _ref = (_ref2 = (_children = children, _.flatten(_children)), (_ref3 = _, _$mapcat = _ref3.mapcat, _embeddables = (_embeddables2 = embeddables$2, _parent$ownerDocument = parent.ownerDocument, function embeddables(_argPlaceholder2) {
    return _embeddables2(_argPlaceholder2, _parent$ownerDocument);
  }), function mapcat(_argPlaceholder) {
    return _$mapcat.call(_ref3, _embeddables, _argPlaceholder);
  })(_ref2)), (_ref4 = _, _$each = _ref4.each, _param = function (child) {
    _.isFunction(child) ? child(parent, add) : add(parent, child);
  }, function each(_argPlaceholder3) {
    return _$each.call(_ref4, _param, _argPlaceholder3);
  })(_ref);
}

function embed2(parent, children) {
  embed3(function (parent, child) {
    parent.appendChild(child);
  }, parent, children);
}

const embed = _.overload(null, null, embed2, embed3);

const IMountable = _.protocol({});

var _IMountable, _$satisfies, _ref$3;
const isMountable = (_ref$3 = _, _$satisfies = _ref$3.satisfies, _IMountable = IMountable, function satisfies(_argPlaceholder) {
  return _$satisfies.call(_ref$3, _IMountable, _argPlaceholder);
});
function mounts(self) {
  _.specify(IMountable, {}, self);

  const parent = _.parent(self);

  if (parent) {
    _.each(function (key) {
      $.trigger(self, key, {
        bubbles: true,
        detail: {
          parent
        }
      });
    }, ["mounting", "mounted"]); //ensure hooks trigger even if already mounted

  }

  return self;
}

function sel1$2(self, selector) {
  return first$2(ISelectable.sel(self, selector));
}

const ISelectable = protocol({
  sel: null,
  sel1: sel1$2
});

const sel02 = _.pre(function sel02(selector, context) {
  return ISelectable.sel(context, selector);
}, _.isString);

function sel01(selector) {
  return sel02(selector, document);
}

const sel$2 = _.overload(null, sel01, sel02);

const sel12 = _.pre(function sel12(selector, context) {
  return ISelectable.sel1(context, selector);
}, _.isString);

function sel11(selector) {
  return sel12(selector, document);
}

const sel1$1 = _.overload(null, sel11, sel12);

const IText = _.protocol({
  text: null
});

const text$2 = IText.text;

const IValue = _.protocol({
  value: null
});

const value$2 = IValue.value;

function isHTMLDocument(self) {
  return _.is(self, HTMLDocument);
}

const element = _.assume(isHTMLDocument, document, _.curry(function element(document, name, ...contents) {
  var _contents, _embed;

  return _.doto(document.createElement(name), (_embed = embed, _contents = contents, function embed(_argPlaceholder) {
    return _embed(_argPlaceholder, _contents);
  }));
}, 2));
const elementns = _.assume(isHTMLDocument, document, _.curry(function elementns(document, ns, name, ...contents) {
  var _contents2, _embed2;

  return _.doto(document.createElementNS(ns, name), (_embed2 = embed, _contents2 = contents, function embed(_argPlaceholder2) {
    return _embed2(_argPlaceholder2, _contents2);
  }));
}, 3));
function isElement(self) {
  return _.ako(self, Element);
}

function Attrs(node) {
  this.node = node;
}
function attrs(node) {
  return new Attrs(node);
}

var _Array, _$array, _ref$2;

function count$2(self) {
  return self.node.attributes.length;
}

function lookup$4(self, key) {
  return self.node.getAttribute(key);
}

function assoc$3(self, key, value) {
  self.node.setAttribute(key, value);
}

function dissoc$3(self, key) {
  self.node.removeAttribute(key);
}

function seq$2(self) {
  return count$2(self) ? self : null;
}

function first$1(self) {
  return count$2(self) ? [self.node.attributes[0].name, self.node.attributes[0].value] : null;
}

function rest$1(self) {
  return next$1(self) || _.emptyList();
}

function next2(self, idx) {
  return idx < count$2(self) ? _.lazySeq(function () {
    return _.cons([self.node.attributes[idx].name, self.node.attributes[idx].value], next2(self, idx + 1));
  }) : null;
}

function next$1(self) {
  return next2(self, 1);
}

function keys$2(self) {
  return _.map(_.first, next2(self, 0));
}

function vals$2(self) {
  return _.map(_.second, next2(self, 0));
}

function contains$3(self, key) {
  return self.node.hasAttribute(key);
}

function includes$4(self, pair) {
  return lookup$4(self, _.key(pair)) == _.val(pair);
}

function empty$1(self) {
  while (self.node.attributes.length > 0) {
    self.node.removeAttribute(self.node.attributes[0].name);
  }
}

var behave$c = _.does(_.keying("Attrs"), _.ICoercible.addMethod((_ref$2 = _, _$array = _ref$2.array, _Array = Array, function array(_argPlaceholder) {
  return _$array.call(_ref$2, _argPlaceholder, _Array);
}), function (self) {
  return _.toArray(next2(self, 0));
}), _.implement(_.ICounted, {
  count: count$2
}), _.implement(_.ISeqable, {
  seq: seq$2
}), _.implement(_.INext, {
  next: next$1
}), _.implement(_.ISeq, {
  first: first$1,
  rest: rest$1
}), _.implement(_.IMap, {
  keys: keys$2,
  vals: vals$2
}), _.implement(_.IInclusive, {
  includes: includes$4
}), _.implement(_.IAssociative, {
  contains: contains$3
}), _.implement(_.ILookup, {
  lookup: lookup$4
}), _.implement(mut.ITransientMap, {
  dissoc: dissoc$3
}), _.implement(mut.ITransientEmptyableCollection, {
  empty: empty$1
}), _.implement(mut.ITransientAssociative, {
  assoc: assoc$3
}));

behave$c(Attrs);

function embeddables$1(self) {
  return [self];
}

var behave$b = _.does(_.keying("Attrs"), _.implement(IEmbeddable, {
  embeddables: embeddables$1
}));

const behaviors = {};

Object.assign(behaviors, {
  Comment: behave$b
});
behave$b(Comment);

function send2(self, message) {
  send3(self, message, "log");
}

function send3(self, message, address) {
  self[address](message);
}

const send = _.overload(null, null, send2, send3);

var behave$a = _.does(_.specify(_.ISend, {
  send
}));

behave$a(console);

const fragment = _.assume(isHTMLDocument, document, function fragment(document, ...contents) {
  var _contents, _embed;

  return _.doto(document.createDocumentFragment(), (_embed = embed, _contents = contents, function embed(_argPlaceholder) {
    return _embed(_argPlaceholder, _contents);
  }));
});

function NestedAttrs(element, key) {
  this.element = element;
  this.key = key;
}

function nestedAttrs2(element, key) {
  return new NestedAttrs(element, key);
}

function nestedAttrs1(key) {
  return function (element) {
    return nestedAttrs2(element, key);
  };
}

const nestedAttrs = _.overload(null, nestedAttrs1, nestedAttrs2);
const style = nestedAttrs1("style");

function InvalidHostElementError(el, selector) {
  this.el = el;
  this.selector = selector;
}

function toString() {
  return `Element "${this.el.tagName}" failed to match "${this.selector}".`;
}

InvalidHostElementError.prototype = Object.assign(new Error(), {
  toString
});

function check(self, selector) {
  return _.isString(selector);
}

const matches = _.pre(function matches(self, selector) {
  return self.matches ? self.matches(selector) : false; //e.g. HTMLDocument doesn't have `matches`
}, check);
function assert(el, selector) {
  if (!matches(el, selector)) {
    throw new InvalidHostElementError(el, selector);
  }
}

var _hides, _$includes, _ref$1, _nestedAttrs;
const hides = ["display", "none"];
const hidden = _.comp((_ref$1 = _, _$includes = _ref$1.includes, _hides = hides, function includes(_argPlaceholder) {
  return _$includes.call(_ref$1, _argPlaceholder, _hides);
}), (_nestedAttrs = nestedAttrs, function nestedAttrs(_argPlaceholder2) {
  return _nestedAttrs(_argPlaceholder2, "style");
}));

const toggle = _.partial(_.toggles, show, hide, hidden);

function hide(self) {
  mut.conj(nestedAttrs(self, "style"), hides);
}

function show(self) {
  mut.omit(nestedAttrs(self, "style"), hides); //TODO mut unconj
}

function embeddables(self) {
  function embed(parent, add) {
    if (isMountable(self)) {
      const detail = {
        parent
      };
      $.trigger(self, "mounting", {
        bubbles: true,
        detail
      });
      add(parent, self);
      $.trigger(self, "mounted", {
        bubbles: true,
        detail
      });
    } else {
      add(parent, self);
    }
  }

  return [embed];
}

function append(self, content) {
  embed(self, [content]);
}

function prepend(self, content) {
  embed(function (parent, child) {
    parent.insertBefore(child, parent.childNodes[0]);
  }, self, [content]);
}

function before(self, content) {
  embed(function (parent, child) {
    parent.insertBefore(child, self);
  }, _.parent(self), [content]);
}

function after(self, content) {
  const ref = _.nextSibling(self);

  embed(function (parent, child) {
    parent.insertBefore(child, ref);
  }, _.parent(self), [content]);
}

const conj$4 = append;

function isAttrs(self) {
  return !_.ako(self, Node) && _.descriptive(self);
}

const eventConstructors = {
  "click": MouseEvent,
  "mousedown": MouseEvent,
  "mouseup": MouseEvent,
  "mouseover": MouseEvent,
  "mousemove": MouseEvent,
  "mouseout": MouseEvent,
  "focus": FocusEvent,
  "blur": FocusEvent
};
const eventDefaults = {
  bubbles: true
};

function trigger(self, key, options) {
  options = Object.assign({}, eventDefaults, options || {});
  const Event = eventConstructors[key] || CustomEvent;
  let event = null;

  try {
    event = new Event(key, options);
  } catch (ex) {
    event = self.ownerDocument.createEvent('HTMLEvents');
    event.initEvent(key, options.bubbles || false, options.cancelable || false);
    event.detail = options.detail;
  }

  self.dispatchEvent(event);
  return self;
}

function contents$1(self) {
  return self.contentDocument || _.seq(self.childNodes);
}

function assoc$2(self, key, value) {
  self.setAttribute(key, _.str(value));
}

function dissoc$2(self, key) {
  self.removeAttribute(key);
}

function keys2(self, idx) {
  return idx < self.attributes.length ? _.lazySeq(function () {
    return _.cons(self.attributes[idx].name, keys2(self, idx + 1));
  }) : _.emptyList();
}

function keys$1(self) {
  return keys2(self, 0);
}

function vals2(self, idx) {
  return idx < self.attributes.length ? _.lazySeq(function () {
    return _.cons(self.attributes[idx].value, keys2(self, idx + 1));
  }) : _.emptyList();
}

function vals$1(self) {
  return vals2(self, 0);
}

function lookup$3(self, key) {
  return self.getAttribute(key);
}

function contains$2(self, key) {
  return self.hasAttribute(key);
}

function parent$1(self) {
  return self && self.parentNode;
}

const parents$1 = _.upward(function (self) {
  return self && self.parentElement;
});

const root = _.comp(_.last, _.upward(parent$1));

function closest$1(self, selector) {
  let target = self;

  while (target) {
    if (matches(target, selector)) {
      return target;
    }

    target = _.parent(target);
  }
}

function sel$1(self, selector) {
  return self.querySelectorAll(selector);
}

function sel1(self, selector) {
  return self.querySelector(selector);
}

function children$1(self) {
  return _.seq(self.children || _.filter(isElement, self.childNodes)); //IE has no children on document fragment
}

const descendants$1 = _.downward(_.children);

function nextSibling$1(self) {
  return self.nextElementSibling;
}

const nextSiblings$1 = _.upward(_.nextSibling);

function prevSibling$1(self) {
  return self.previousElementSibling;
}

const prevSiblings$1 = _.upward(_.prevSibling);

function siblings$1(self) {
  return _.concat(prevSiblings$1(self), nextSiblings$1(self));
}

function omit1(self) {
  omit2(parent$1(self), self);
}

function omit2(self, node) {
  if (isElement(node)) {
    self.removeChild(node);
  } else if (_.satisfies(_.ISequential, node)) {
    const keys = node;

    _.each(self.removeAttribute.bind(self), keys);
  } else if (isAttrs(node)) {
    const attrs = node;

    _.each(function (entry) {
      const key = entry[0],
            value = entry[1];
      let curr = lookup$3(self, key);

      if (_.isObject(curr)) {
        curr = mapa(function (pair) {
          return pair.join(": ") + "; ";
        }, _.toArray(curr)).join("").trim();
      }

      curr == value && dissoc$2(self, key);
    }, attrs);
  } else if (_.isString(node)) {
    node = includes$3(self, node);
    self.removeChild(node);
  }
}

const omit$3 = _.overload(null, omit1, omit2); //TODO too overloaded, impure protocol

function includes$3(self, target) {
  if (isElement(target)) {
    var _target, _$isIdentical, _ref2;

    return _.detect((_ref2 = _, _$isIdentical = _ref2.isIdentical, _target = target, function isIdentical(_argPlaceholder3) {
      return _$isIdentical.call(_ref2, _target, _argPlaceholder3);
    }), children$1(self));
  } else if (_.satisfies(_.ISequential, target)) {
    const keys = target;
    return _.reduce(function (memo, key) {
      return memo ? self.hasAttribute(key) : reduced(memo);
    }, true, keys);
  } else if (isAttrs(target)) {
    return _.reducekv(function (memo, key, value) {
      return memo ? lookup$3(self, key) == value : reduced(memo);
    }, true, target);
  } else {
    return _.detect(_.isString(target) ? function (node) {
      return node.nodeType === Node.TEXT_NODE && node.data === target;
    } : function (node) {
      return node === target;
    }, contents$1(self));
  }
}

function empty(self) {
  while (self.firstChild) {
    self.removeChild(self.firstChild);
  }
}

function clone(self) {
  return self.cloneNode(true);
}

function value1(self) {
  switch (self.getAttribute("type")) {
    case "checkbox":
      return self.checked;

    case "number":
    case "range":
      return _.maybe(self.value, _.blot, parseFloat);

    default:
      return "value" in self ? self.value : null;
  }
}

function value2(self, value) {
  switch (self.getAttribute("type")) {
    case "checkbox":
      self.checked = !!value;
      return;

    case "number":
    case "range":
      self.value = _.maybe(value, _.blot, parseFloat);
      return;

    default:
      if ("value" in self) {
        value = value == null ? "" : value;

        if (self.value != value) {
          self.value = value;
        }
      } else {
        throw new TypeError("Type does not support value property.");
      }

  }
}

const value$1 = _.overload(null, value1, value2);

function text1(self) {
  return self.textContent;
}

function text2(self, text) {
  self.textContent = text == null ? "" : text;
}

const text$1 = _.overload(null, text1, text2);

function html1(self) {
  return self.innerHTML;
}

function html2(self, html) {
  if (_.isString(html)) {
    self.innerHTML = html;
  } else {
    empty(self);
    embed(self, [html]);
  }

  return self;
}

const html = _.overload(null, html1, html2);

function reduce$1(self, f, init) {
  return _.reduce(f, init, _.descendants(self));
}

function chan2(el, key) {
  return $.observable(function (observer) {
    var _observer, _$$pub, _$;

    return on3(el, key, (_$ = $, _$$pub = _$.pub, _observer = observer, function pub(_argPlaceholder4) {
      return _$$pub.call(_$, _observer, _argPlaceholder4);
    }));
  });
}

function chan3(el, key, selector) {
  return $.observable(function (observer) {
    var _observer2, _$$pub2, _$2;

    return on4(el, key, selector, (_$2 = $, _$$pub2 = _$2.pub, _observer2 = observer, function pub(_argPlaceholder5) {
      return _$$pub2.call(_$2, _observer2, _argPlaceholder5);
    }));
  });
}

const chan = _.overload(null, null, chan2, chan3);

function on3(el, key, callback) {
  if (key.indexOf(" ") > -1) {
    var _el, _callback, _on;

    return _.does(..._.mapa((_on = on3, _el = el, _callback = callback, function on3(_argPlaceholder6) {
      return _on(_el, _argPlaceholder6, _callback);
    }), key.split(" ")));
  } else {
    el.addEventListener(key, callback);
    return function () {
      el.removeEventListener(key, callback);
    };
  }
}

function on4(el, key, selector, callback) {
  return on3(el, key, function (e) {
    if (e.target.matches(selector)) {
      callback.call(this, e);
    } else {
      const target = _.closest(e.target, selector);

      if (target && el.contains(target)) {
        callback.call(target, e);
      }
    }
  });
}

const on = _.overload(null, null, null, on3, on4);
const ihierarchy = _.implement(_.IHierarchy, {
  root,
  parent: parent$1,
  parents: parents$1,
  closest: closest$1,
  children: children$1,
  descendants: descendants$1,
  nextSibling: nextSibling$1,
  nextSiblings: nextSiblings$1,
  prevSibling: prevSibling$1,
  prevSiblings: prevSiblings$1,
  siblings: siblings$1
});
const icontents = _.implement(IContent, {
  contents: contents$1
});
const ievented = _.implement($.IEvented, {
  on,
  chan,
  trigger
});
const iselectable = _.implement(ISelectable, {
  sel: sel$1,
  sel1
});
var ielement = _.does(ihierarchy, icontents, ievented, iselectable, _.keying("Element"), _.implement(_.IReducible, {
  reduce: reduce$1
}), _.implement(IValue, {
  value: value$1
}), _.implement(IText, {
  text: text$1
}), _.implement(IHtml, {
  html
}), _.implement(IEmbeddable, {
  embeddables
}), _.implement(mut.ITransientEmptyableCollection, {
  empty
}), _.implement(mut.ITransientInsertable, {
  before,
  after
}), _.implement(_.IInclusive, {
  includes: includes$3
}), _.implement(IHideable, {
  show,
  hide,
  toggle
}), _.implement(mut.ITransientOmissible, {
  omit: omit$3
}), _.implement(_.IClonable, {
  clone
}), _.implement(mut.ITransientAppendable, {
  append
}), _.implement(mut.ITransientPrependable, {
  prepend
}), _.implement(mut.ITransientCollection, {
  conj: conj$4
}), _.implement(_.ILookup, {
  lookup: lookup$3
}), _.implement(_.IMap, {
  keys: keys$1,
  vals: vals$1
}), _.implement(mut.ITransientMap, {
  dissoc: dissoc$2
}), _.implement(_.IAssociative, {
  contains: contains$2
}), _.implement(mut.ITransientAssociative, {
  assoc: assoc$2
}));

var behave$9 = _.does(ielement, _.keying("DocumentFragment"), _.implement(_.IHierarchy, {
  nextSibling: _.constantly(null),
  nextSiblings: _.emptyList,
  prevSibling: _.constantly(null),
  prevSiblings: _.emptyList,
  siblings: _.emptyList,
  parent: _.constantly(null),
  parents: _.emptyList
}), _.implement(_.INext, {
  next: _.constantly(null)
}), _.implement(_.ISeq, {
  first: _.identity,
  rest: _.emptyList
}), _.implement(_.ISeqable, {
  seq: _.cons
}));

Object.assign(behaviors, {
  DocumentFragment: behave$9
});
behave$9(DocumentFragment);

function replaceWith(self, other) {
  const parent = _.parent(self),
        replacement = _.isString(other) ? self.ownerDocument.createTextNode(other) : other;

  parent.replaceChild(replacement, self);
}
function wrap(self, other) {
  replaceWith(self, other);
  mut.append(other, self);
}
function isVisible(el) {
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}
function enable(self, enabled) {
  self.disabled = !enabled;
  return self;
}

Object.assign(behaviors, {
  Window: ielement,
  Element: ielement,
  Text: ielement
});
ielement(Window);
ielement(Element);
ielement(Text);

function seq2(self, idx) {
  return idx < self.length ? _.lazySeq(function () {
    return _.cons(self.item(idx), seq2(self, idx + 1));
  }) : null;
}

function seq$1(self) {
  return seq2(self, 0);
}

function lookup$2(self, idx) {
  return self[idx];
}

const first = _.comp(_.first, seq$1);

const rest = _.comp(_.rest, seq$1);

const next = _.comp(_.next, seq$1);

const children = _.comp(_.children, seq$1);

const descendants = _.comp(_.descendants, seq$1);

const nextSibling = _.comp(_.nextSibling, seq$1);

const nextSiblings = _.comp(_.nextSiblings, seq$1);

const prevSibling = _.comp(_.prevSibling, seq$1);

const prevSiblings = _.comp(_.prevSiblings, seq$1);

const siblings = _.comp(_.siblings, seq$1);

const parent = _.comp(_.parent, seq$1);

const parents = _.comp(_.parents, seq$1);

const contents = _.comp(_.contents, seq$1);

function sel(self, selector) {
  var _matches, _$filter, _ref, _selector, _matches2;

  return _.maybe(self, seq$1, (_ref = _, _$filter = _ref.filter, _matches = (_matches2 = matches, _selector = selector, function matches(_argPlaceholder2) {
    return _matches2(_argPlaceholder2, _selector);
  }), function filter(_argPlaceholder) {
    return _$filter.call(_ref, _matches, _argPlaceholder);
  }));
}

function closest(self, selector) {
  var _selector2, _$closest, _ref2;

  return _.maybe(self, seq$1, (_ref2 = _, _$closest = _ref2.closest, _selector2 = selector, function closest(_argPlaceholder3) {
    return _$closest.call(_ref2, _argPlaceholder3, _selector2);
  }));
}

function reduce(self, f, init) {
  return _.reduce(f, init, seq$1(self));
}

function count$1(self) {
  return self.length;
}

var behave$8 = _.does(_.iterable, _.keying("NodeList"), _.implement(_.ILookup, {
  lookup: lookup$2
}), _.implement(_.IIndexed, {
  nth: lookup$2
}), _.implement(_.ICounted, {
  count: count$1
}), _.implement(_.ISeq, {
  first,
  rest
}), _.implement(_.IReducible, {
  reduce
}), _.implement(_.INext, {
  next
}), _.implement(_.IHierarchy, {
  parent,
  parents,
  closest,
  nextSiblings,
  nextSibling,
  prevSiblings,
  prevSibling,
  siblings,
  children,
  descendants
}), _.implement(_.ISequential), _.implement(_.ISeqable, {
  seq: seq$1
}), _.implement(IContent, {
  contents
}), _.implement(ISelectable, {
  sel
}));

Object.assign(behaviors, {
  HTMLCollection: behave$8
});
behave$8(HTMLCollection);

var behave$7 = _.does(ielement, _.keying("HTMLDocument"), _.implement(_.IHierarchy, {
  closest: _.constantly(null),
  nextSibling: _.constantly(null),
  nextSiblings: _.emptyList,
  prevSibling: _.constantly(null),
  prevSiblings: _.emptyList,
  siblings: _.emptyList,
  parent: _.constantly(null),
  parents: _.emptyList
}));

Object.assign(behaviors, {
  HTMLDocument: behave$7
});
behave$7(HTMLDocument);

var behave$6 = _.noop;

Object.assign(behaviors, {
  HTMLInputElement: behave$6
});
behave$6(HTMLInputElement);

var _$either, _ref2;

function conj$3(self, entry) {
  self.append(isElement(entry) ? entry : element("option", {
    value: _.key(entry)
  }, _.val(entry)));
}

function access(f) {
  function value1(self) {
    var _param, _$detect, _ref;

    return _.maybe(sel$2("option", self), (_ref = _, _$detect = _ref.detect, _param = function (option) {
      return option.selected;
    }, function detect(_argPlaceholder) {
      return _$detect.call(_ref, _param, _argPlaceholder);
    }), f);
  }

  function value2(self, value) {
    const options = sel$2("option", self);

    const chosen = _.detect(function (option) {
      return f(option) == value;
    }, options);

    if (chosen) {
      _.each(function (option) {
        const selected = f(option) == value;

        if (option.selected != selected) {
          option.selected = selected;
        }
      }, options);
    } else {
      throw new Error("Cannot set value — it is not an option.");
    }
  }

  return _.overload(null, value1, value2);
}

const text = _.comp((_ref2 = _, _$either = _ref2.either, function either(_argPlaceholder2) {
  return _$either.call(_ref2, _argPlaceholder2, "");
}), access(text$2)),
      value = access(value$2);

var behave$5 = _.does(_.keying("HTMLSelectElement"), _.implement(mut.ITransientCollection, {
  conj: conj$3
}), _.implement(mut.ITransientAppendable, {
  append: conj$3
}), _.implement(IValue, {
  value
}), _.implement(IText, {
  text
}));

Object.assign(behaviors, {
  HTMLSelectElement: behave$5
});
behave$5(HTMLSelectElement);

var behave$4 = _.keying("Location");

Object.assign(behaviors, {
  Location: behave$4
});
behave$4(Location);

function asText(obj) {
  return _.mapa(function (entry) {
    const key = entry[0],
          value = entry[1];
    return _.str(key, ": ", value, ";");
  }, _.seq(obj)).join(" ");
}

function deref$1(self) {
  const text = self.element.getAttribute(self.key);
  return text == null ? {} : _.reduce(function (memo, pair) {
    return _.conj(memo, pair);
  }, {}, _.mapa(function (text) {
    return _.mapa(_.trim, _.split(text, ":"));
  }, _.compact(_.split(text, ";"))));
}

function lookup$1(self, key) {
  return _.get(deref$1(self), key);
}

function contains$1(self, key) {
  return _.contains(deref$1(self), key);
}

function assoc$1(self, key, value) {
  self.element.setAttribute(self.key, asText(_.assoc(deref$1(self), key, value)));
}

function dissoc$1(self, key) {
  self.element.setAttribute(self.key, asText(_.dissoc(deref$1(self), key)));
}

function keys(self) {
  return _.keys(deref$1(self));
}

function vals(self) {
  return _.vals(deref$1(self));
}

function includes$2(self, pair) {
  return _.includes(deref$1(self), pair);
}

function omit$2(self, pair) {
  self.element.setAttribute(self.key, asText(_.omit(deref$1(self), pair)));
}

function conj$2(self, pair) {
  self.element.setAttribute(self.key, asText(_.conj(deref$1(self), pair)));
}

var behave$3 = _.does(_.keying("NestedAttrs"), _.implement(_.IDeref, {
  deref: deref$1
}), _.implement(_.IMap, {
  keys,
  vals
}), _.implement(_.IInclusive, {
  includes: includes$2
}), _.implement(_.IAssociative, {
  contains: contains$1
}), _.implement(_.ILookup, {
  lookup: lookup$1
}), _.implement(mut.ITransientMap, {
  dissoc: dissoc$1
}), _.implement(mut.ITransientAssociative, {
  assoc: assoc$1
}), _.implement(mut.ITransientOmissible, {
  omit: omit$2
}), _.implement(mut.ITransientCollection, {
  conj: conj$2
}));

behave$3(NestedAttrs);

Object.assign(behaviors, {
  NodeList: behave$8
});
behave$8(NodeList);

function Props(node) {
  this.node = node;
}
function props(node) {
  return new Props(node);
}

function lookup(self, key) {
  return self.node[key];
}

function contains(self, key) {
  return self.node.hasOwnProperty(key);
}

function assoc(self, key, value) {
  self.node[key] = value;
}

function dissoc(self, key) {
  delete self.node[key];
}

function includes$1(self, entry) {
  return self.node[_.key(entry)] === _.val(entry);
}

function omit$1(self, entry) {
  includes$1(self, entry) && _dissoc(self, _.key(entry));
}

function conj$1(self, entry) {
  assoc(self, _.key(entry), _.val(entry));
}

var behave$2 = _.does(_.keying("Props"), _.implement(_.IMap, {
  keys: Object.keys,
  vals: Object.values
}), _.implement(_.IInclusive, {
  includes: includes$1
}), _.implement(_.IAssociative, {
  contains
}), _.implement(_.ILookup, {
  lookup
}), _.implement(mut.ITransientAssociative, {
  assoc
}), _.implement(mut.ITransientMap, {
  dissoc
}), _.implement(mut.ITransientOmissible, {
  omit: omit$1
}), _.implement(mut.ITransientCollection, {
  conj: conj$1
}));

behave$2(Props);

function SpaceSeparated(element, key) {
  this.element = element;
  this.key = key;
}

function spaceSep2(element, key) {
  return new SpaceSeparated(element, key);
}

function spaceSep1(key) {
  return function (element) {
    return spaceSep2(element, key);
  };
}

const spaceSep = overload(null, spaceSep1, spaceSep2);
const classes = spaceSep1("class");

function seq(self) {
  const text = self.element.getAttribute(self.key);
  return text && text.length ? text.split(" ") : null;
}

function includes(self, text) {
  const xs = seq(self);
  return xs && _.filter(function (t) {
    return t == text;
  }, xs);
}

function conj(self, text) {
  self.element.setAttribute(self.key, deref(self).concat(text).join(" "));
}

function omit(self, text) {
  self.element.setAttribute(self.key, _.filtera(function (t) {
    return t !== text;
  }, seq(self)).join(" "));
}

function deref(self) {
  return seq(self) || [];
}

function count(self) {
  return deref(self).length;
}

var behave$1 = _.does(_.keying("SpaceSep"), _.implement(_.ISequential), _.implement(_.ISeqable, {
  seq
}), _.implement(_.IDeref, {
  deref
}), _.implement(_.IInclusive, {
  includes
}), _.implement(_.ICounted, {
  count
}), _.implement(mut.ITransientOmissible, {
  omit
}), _.implement(mut.ITransientCollection, {
  conj
}));

behave$1(SpaceSeparated);

Object.assign(behaviors, {
  XMLDocument: behave$7
});
behave$7(XMLDocument);

var _behaviors, _$behaves, _ref;
const behave = (_ref = _, _$behaves = _ref.behaves, _behaviors = behaviors, function behaves(_argPlaceholder) {
  return _$behaves.call(_ref, _behaviors, _argPlaceholder);
});
const ready = _.assume(isHTMLDocument, document, function ready(document, callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
});
const hash = $.shared($.cell, function (window) {
  return $.computed(function (e) {
    return window.location.hash;
  }, $.chan(window, "hashchange"));
});
const focus = $.shared($.cell, function (el) {
  return $.toggles(el, "focus", "blur", function () {
    return el === el.ownerDocument.activeElement;
  });
});
const click = $.shared($.subject, function (el) {
  return $.chan(el, "click");
});
const hover = $.shared($.cell, function (el) {
  return $.toggles(el, "mouseenter", "mouseleave", _.constantly(false));
});
const depressed = $.shared($.cell, function (el) {
  return $.seed(_.constantly([]), $.pipe($.chan(el, "keydown keyup"), t.scan(function (memo, e) {
    if (e.type === "keyup") {
      var _e$key, _$notEq, _ref2;

      memo = _.filtera((_ref2 = _, _$notEq = _ref2.notEq, _e$key = e.key, function notEq(_argPlaceholder2) {
        return _$notEq.call(_ref2, _e$key, _argPlaceholder2);
      }), memo);
    } else if (!_.includes(memo, e.key)) {
      memo = _.conj(memo, e.key);
    }

    return memo;
  }, []), t.dedupe()));
});

function attr2(self, key) {
  if (_.isString(key)) {
    return self.getAttribute(key);
  } else {
    var _self, _attr;

    const pairs = key;

    _.eachkv((_attr = attr3, _self = self, function attr3(_argPlaceholder3, _argPlaceholder4) {
      return _attr(_self, _argPlaceholder3, _argPlaceholder4);
    }), pairs);
  }
}

function attr3(self, key, value) {
  self.setAttribute(key, _.str(value));
}

function attrN(self, ...kvps) {
  const stop = kvps.length - 1;

  for (let i = 0; i <= stop; i += 2) {
    attr3(self, kvps[i], kvps[i + 1]);
  }
}

const attr = _.overload(null, null, attr2, attr3, attrN);

function removeAttr2(self, key) {
  self.removeAttribute(key);
}

const removeAttr = _.overload(null, null, removeAttr2, _.doing(removeAttr2));

function prop3(self, key, value) {
  self[key] = value;
}

function prop2(self, key) {
  return self[key];
}

const prop = _.overload(null, null, prop2, prop3);
function addStyle(self, key, value) {
  self.style[key] = value;
}

function removeStyle2(self, key) {
  self.style.removeProperty(key);
}

function removeStyle3(self, key, value) {
  if (self.style[key] === value) {
    self.style.removeProperty(key);
  }
}

const removeStyle = _.overload(null, null, removeStyle2, removeStyle3);
function addClass(self, name) {
  self.classList.add(name);
}
function removeClass(self, name) {
  self.classList.remove(name);
}

function toggleClass2(self, name) {
  toggleClass3(self, name, !self.classList.contains(name));
}

function toggleClass3(self, name, want) {
  self.classList[want ? "add" : "remove"](name);
}

const toggleClass = _.overload(null, null, toggleClass2, toggleClass3);
function hasClass(self, name) {
  return self.classList.contains(name);
}

function mount3(render, config, el) {
  return mount4(_.constantly(null), render, config, el);
}

function mount4(create, render, config, el) {
  var _el, _param, _$$on, _$, _el2, _config, _bus, _render, _el3;

  config.what && $.trigger(el, config.what + ":installing", {
    bubbles: true,
    detail: {
      config
    }
  });
  $.trigger(el, "installing", {
    bubbles: true,
    detail: {
      config
    }
  });
  const bus = create(config),
        detail = {
    config,
    bus
  };
  _el = el, (_$ = $, _$$on = _$.on, _param = function (e) {
    Object.assign(e.detail, detail);
  }, function on(_argPlaceholder5) {
    return _$$on.call(_$, _argPlaceholder5, "mounting mounted", _param);
  })(_el);
  _el2 = el, (_render = render, _config = config, _bus = bus, function render(_argPlaceholder6) {
    return _render(_argPlaceholder6, _config, _bus);
  })(_el2);
  _el3 = el, mounts(_el3);
  config.what && $.trigger(el, config.what + ":installed", {
    bubbles: true,
    detail
  });
  $.trigger(el, "installed", {
    bubbles: true,
    detail
  });
  return bus;
}

const mount = _.overload(null, null, null, mount3, mount4);
const markup = _.obj(function (name, ...contents) {
  const attrs = _.map(function (entry) {
    return _.template("{0}=\"{1}\"", _.key(entry), _.replace(_.val(entry), /"/g, '&quot;'));
  }, _.apply(_.merge, _.filter(_.isObject, contents)));

  const content = _.map(_.str, _.remove(_.isObject, contents));

  return _.join("", _.concat(["<" + name + " " + _.join(" ", attrs) + ">"], content, "</" + name + ">"));
}, Infinity);

function tags0() {
  return tags1(element(document));
}

const tags1 = _.factory;

function tags2(engine, keys) {
  return tags3(engine, _.identity, keys);
}

function tags3(engine, f, keys) {
  const tag = tags1(engine);
  return _.reduce(function (memo, key) {
    memo[key] = f(tag(key));
    return memo;
  }, {}, keys);
}

const tags = _.overload(tags0, tags1, tags2, tags3);
const tag = tags();
const option = _.assume(isHTMLDocument, document, _.overload(null, null, function option(document, entry) {
  return element(document, "option", {
    value: _.key(entry)
  }, _.val(entry));
}, function (document, key, value) {
  return element(document, "option", {
    value: key
  }, value);
}));
const select = _.called(_.assume(isHTMLDocument, document, function select(document, entries, ...args) {
  var _document, _option;

  return element(document, "select", _.map((_option = option, _document = document, function option(_argPlaceholder7) {
    return _option(_document, _argPlaceholder7);
  }), entries), ...args);
}), "`select` is deprecated — use `select` tag with `option(key, value),...` or `map(option, entries)`.");
const checkbox = _.called(_.assume(isHTMLDocument, document, function checkbox(document, ...args) {
  const el = element(document, 'input', {
    type: "checkbox"
  }, ...args);

  function value1(el) {
    return el.checked;
  }

  function value2(el, checked) {
    el.checked = checked;
  }

  const value = _.overload(null, value1, value2);

  return _.doto(el, _.specify(IValue, {
    value: value
  }));
}), "`checkbox` is deprecated — use `input` tag with {type: 'checkbox'} instead.");
const input = _.called(_.assume(isHTMLDocument, document, function input(document, ...args) {
  return element(document, 'input', {
    type: "text"
  }, ...args);
}), "`input` is deprecated — use `input` tag with {type: 'text'}.");
const textbox = input;

_.extend(_.ICoercible, {
  toFragment: null
});

const toFragment = _.toFragment;

(function () {
  function embeddables(self, doc) {
    return [(doc || document).createTextNode(self)];
  }

  function toFragment(self, doc) {
    return (doc || document).createRange().createContextualFragment(self);
  }

  _.doto(String, _.implement(_.ICoercible, {
    toFragment
  }), _.implement(IEmbeddable, {
    embeddables
  }));
})();

(function () {
  function embeddables(self, doc) {
    return [(doc || document).createTextNode(self)];
  }

  _.doto(Number, _.implement(IEmbeddable, {
    embeddables
  }));
})();

(function () {
  function embeddables(self, doc) {
    function embed(el) {
      _.each(function (entry) {
        mut.assoc(el, _.key(entry), _.val(entry)); //attributes
      }, self);
    }

    return [embed];
  }

  _.doto(Object, _.implement(IEmbeddable, {
    embeddables
  }));
})();

(function () {
  function toFragment(self, doc) {
    return (doc || document).createRange().createContextualFragment("");
  }

  _.doto(_.Nil, _.implement(_.ICoercible, {
    toFragment
  }), _.implement(IEmbeddable, {
    embeddables: _.emptyList
  }));
})();

_.ICoercible.addMethod([NodeList, Array], Array.from);

_.ICoercible.addMethod([SpaceSeparated, Array], _.comp(Array.from, _.seq));

_.ICoercible.addMethod([NestedAttrs, Object], _.deref);

function stylesheet2(href, document) {
  if (!sel1$1(`link[href='${href}']`, document)) {
    const stylesheet = element(document, "link", {
      type: "text/css",
      rel: "stylesheet",
      href
    });
    mut.append(document.body, stylesheet);
  }
}

function stylesheet1(href) {
  stylesheet2(href, document);
}

const stylesheet = _.overload(null, stylesheet1, stylesheet2);

export { Attrs, IContent, IEmbeddable, IHideable, IHtml, IMountable, ISelectable, IText, IValue, InvalidHostElementError, NestedAttrs, Props, SpaceSeparated, addClass, addStyle, assert, attr, attrs, behave, behaviors, checkbox, classes, click, contents$2 as contents, depressed, element, elementns, embed, embeddables$2 as embeddables, enable, focus, fragment, hasClass, hash, hide$1 as hide, hover, html$1 as html, input, isElement, isHTMLDocument, isMountable, isVisible, markup, matches, mount, mounts, nestedAttrs, option, prop, props, ready, removeAttr, removeClass, removeStyle, replaceWith, sel$2 as sel, sel1$1 as sel1, select, show$1 as show, spaceSep, style, stylesheet, tag, tags, text$2 as text, textbox, toFragment, toggle$1 as toggle, toggleClass, value$2 as value, wrap };
