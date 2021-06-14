define(['exports', 'atomic/core', 'atomic/transients', 'dom', 'atomic/reactives', 'promise'], function (exports, _, mut, dom, $, Promise$1) { 'use strict';

  var IEmbeddable = _.protocol({
    embed: null
  });
  function embeds(self) {
    var _self, _IEmbeddable$embed, _IEmbeddable;

    for (var _len = arguments.length, contents = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      contents[_key - 1] = arguments[_key];
    }

    _.each((_IEmbeddable = IEmbeddable, _IEmbeddable$embed = _IEmbeddable.embed, _self = self, function embed(_argPlaceholder) {
      return _IEmbeddable$embed.call(_IEmbeddable, _argPlaceholder, _self);
    }), contents);
  }

  function embed$2(self, parent, referenceNode) {
    if (_.satisfies(IEmbeddable, self)) {
      IEmbeddable.embed(self, parent, referenceNode);
    } else if (_.satisfies(_.ISequential, self)) {
      var _parent, _referenceNode, _embed;

      _.each((_embed = embed$2, _parent = parent, _referenceNode = referenceNode, function embed(_argPlaceholder) {
        return _embed(_argPlaceholder, _parent, _referenceNode);
      }), self);
    } else if (_.satisfies(_.IDescriptive, self)) {
      _.each(function (entry) {
        mut.assoc(parent, _.key(entry), _.val(entry));
      }, self);
    } else {
      IEmbeddable.embed(_.str(self), parent, referenceNode);
    }
  }

  function element(name) {
    var el = document.createElement(name);

    for (var _len = arguments.length, contents = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      contents[_key - 1] = arguments[_key];
    }

    _.apply(embeds, el, _.flatten(contents));
    return el;
  }
  function elementns(ns, name) {
    var el = document.createElementNS(ns, name);

    for (var _len2 = arguments.length, contents = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      contents[_key2 - 2] = arguments[_key2];
    }

    _.apply(embeds, el, _.flatten(contents));
    return el;
  }
  function isElement(self) {
    return self instanceof dom.Element;
  }

  var IMountable = _.protocol({});

  var _IMountable, _satisfies;
  var isMountable = (_satisfies = _.satisfies, _IMountable = IMountable, function satisfies(_argPlaceholder) {
    return _satisfies(_IMountable, _argPlaceholder);
  });
  function mounts(self) {
    _.specify(IMountable, {}, self);

    var parent = _.parent(self);

    if (parent) {
      _.each(function (key) {
        $.trigger(self, key, {
          bubbles: true,
          detail: {
            parent: parent
          }
        });
      }, ["mounting", "mounted"]); //ensure hooks trigger even if already mounted
    }

    return self;
  }

  function InvalidHostElementError(el, selector) {
    this.el = el;
    this.selector = selector;
  }

  function toString() {
    return "Element \"".concat(this.el.tagName, "\" failed to match \"").concat(this.selector, "\".");
  }

  InvalidHostElementError.prototype = Object.assign(new Error(), {
    toString: toString
  });

  var IValue = _.protocol({
    value: null
  });

  function Attrs(node) {
    this.node = node;
  }
  function attrs(node) {
    return new Attrs(node);
  }

  function toArray(self) {
    return _.ICoerceable.toArray(next2(self, 0));
  }

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

  var behaveAsAttrs = _.does(_.implement(mut.ITransientEmptyableCollection, {
    empty: empty$1
  }), _.implement(_.ICoerceable, {
    toArray: toArray
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
  }), _.implement(mut.ITransientMap, {
    dissoc: dissoc$3
  }), _.implement(_.IInclusive, {
    includes: includes$4
  }), _.implement(_.IAssociative, {
    contains: contains$3
  }), _.implement(mut.ITransientAssociative, {
    assoc: assoc$3
  }), _.implement(_.ILookup, {
    lookup: lookup$4
  }));

  behaveAsAttrs(Attrs);

  var IContent = _.protocol({
    contents: null
  });

  var IHideable = _.protocol({
    hide: null,
    show: null,
    toggle: null
  });

  var IHtml = _.protocol({
    html: null
  });

  var IText = _.protocol({
    text: null
  });

  function embed$1(self, parent) {
    parent.appendChild(self);
  }

  var behaveAsComment = _.does(_.implement(IEmbeddable, {
    embed: embed$1
  }));

  behaveAsComment(dom.Comment);

  function send2(self, message) {
    send3(self, message, "log");
  }

  function send3(self, message, address) {
    self[address](message);
  }

  var send = _.overload(null, null, send2, send3);
  var behaveAsConsole = _.does(_.specify(_.ISend, {
    send: send
  }));

  behaveAsConsole(console);

  function fragment() {
    var _frag, _embed;

    var frag = dom.document.createDocumentFragment();

    for (var _len = arguments.length, contents = new Array(_len), _key = 0; _key < _len; _key++) {
      contents[_key] = arguments[_key];
    }

    _.each((_embed = embed$2, _frag = frag, function embed(_argPlaceholder) {
      return _embed(_argPlaceholder, _frag);
    }), contents);
    return frag;
  }
  dom.DocumentFragment.create = fragment;
  function isDocumentFragment(self) {
    return self && self instanceof dom.DocumentFragment;
  }

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

  var nestedAttrs = _.overload(null, nestedAttrs1, nestedAttrs2);
  var style = nestedAttrs1("style");

  var _hides, _IInclusive$includes, _IInclusive, _nestedAttrs;
  var hides = ["display", "none"];
  var hidden = _.comp((_IInclusive = _.IInclusive, _IInclusive$includes = _IInclusive.includes, _hides = hides, function includes(_argPlaceholder) {
    return _IInclusive$includes.call(_IInclusive, _argPlaceholder, _hides);
  }), (_nestedAttrs = nestedAttrs, function nestedAttrs(_argPlaceholder2) {
    return _nestedAttrs(_argPlaceholder2, "style");
  }));
  var toggle$1 = _.partial(_.toggles, show$1, hide$1, hidden);

  function hide$1(self) {
    mut.ITransientCollection.conj(nestedAttrs(self, "style"), hides);
  }

  function show$1(self) {
    mut.ITransientYankable.yank(nestedAttrs(self, "style"), hides);
  }

  function embed(self, parent, referenceNode) {
    if (isMountable(self)) {
      var detail = {
        parent: parent
      };
      $.IEvented.trigger(self, "mounting", {
        bubbles: true,
        detail: detail
      });

      if (referenceNode) {
        parent.insertBefore(self, referenceNode);
      } else {
        parent.appendChild(self);
      }

      $.IEvented.trigger(self, "mounted", {
        bubbles: true,
        detail: detail
      });
    } else {
      if (referenceNode) {
        parent.insertBefore(self, referenceNode);
      } else {
        parent.appendChild(self);
      }
    }

    return self;
  }

  function append(self, content) {
    IEmbeddable.embed(content, self);
  }

  function prepend(self, content) {
    IEmbeddable.embed(content, self, self.childNodes[0]);
  }

  function before(self, content) {
    IEmbeddable.embed(content, _.IHierarchy.parent(self), self);
  }

  function after(self, content) {
    IEmbeddable.embed(content, _.IHierarchy.parent(self), _.IHierarchy.nextSibling(self));
  }

  var conj$3 = append;

  function matches$1(self, selector) {
    return _.isString(selector) && self.matches(selector) || _.isFunction(selector) && selector(self);
  }

  function isAttrs(self) {
    return !(self instanceof Node) && _.satisfies(_.IDescriptive, self);
  }

  function eventContext(catalog) {
    function on3(self, key, callback) {
      _.isString(key) ? _.each(function (key) {
        self.addEventListener(key, callback);
      }, _.compact(key.split(" "))) : self.addEventListener(key, callback);
      return self;
    }

    function on4(self, key, selector, callback) {
      var _catalog, _callback, _assoc2;

      on3(self, key, _.doto(function (e) {
        if (_.IMatchable.matches(e.target, selector)) {
          callback.call(e.target, e);
        } else {
          var found = closest$1(e.target, selector);

          if (found && self.contains(found)) {
            callback.call(found, e);
          }
        }
      }, (_assoc2 = _.assoc, _catalog = catalog, _callback = callback, function _assoc(_argPlaceholder3) {
        return _assoc2(_catalog, _callback, _argPlaceholder3);
      })));
      return self;
    }

    var on = _.overload(null, null, null, on3, on4);

    function off(self, key, callback) {
      self.removeEventListener(key, _.get(catalog, callback, callback));
      return self;
    }

    return {
      on: on,
      off: off
    };
  }

  var _eventContext = eventContext(_.weakMap()),
      on$1 = _eventContext.on,
      off = _eventContext.off;

  var eventConstructors = {
    "click": MouseEvent,
    "mousedown": MouseEvent,
    "mouseup": MouseEvent,
    "mouseover": MouseEvent,
    "mousemove": MouseEvent,
    "mouseout": MouseEvent,
    "focus": FocusEvent,
    "blur": FocusEvent
  };
  var eventDefaults = {
    bubbles: true
  };

  function trigger(self, key, options) {
    options = Object.assign({}, eventDefaults, options || {});
    var Event = eventConstructors[key] || CustomEvent;
    var event = null;

    try {
      event = new Event(key, options);
    } catch (ex) {
      event = document.createEvent('HTMLEvents');
      event.initEvent(key, options.bubbles || false, options.cancelable || false);
      event.detail = options.detail;
    }

    self.dispatchEvent(event);
    return self;
  }

  function contents$2(self) {
    return self.contentDocument || _.ISeqable.seq(self.childNodes);
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

  var parents$1 = _.upward(function (self) {
    return self && self.parentElement;
  });
  var root = _.comp(_.last, _.upward(parent$1));
  function closest$1(self, selector) {
    var target = self;

    while (target) {
      if (_.IMatchable.matches(target, selector)) {
        return target;
      }

      target = _.IHierarchy.parent(target);
    }
  }

  function query$1(self, selector) {
    var _selector, _IMatchable$matches, _IMatchable;

    return self.querySelectorAll && _.isString(selector) ? self.querySelectorAll(selector) : _.filter((_IMatchable = _.IMatchable, _IMatchable$matches = _IMatchable.matches, _selector = selector, function matches(_argPlaceholder4) {
      return _IMatchable$matches.call(_IMatchable, _argPlaceholder4, _selector);
    }), _.IHierarchy.descendants(self));
  }

  function locate$1(self, selector) {
    return _.isFunction(selector) ? _.ISeq.first(_.IQueryable.query(self, selector)) : self.querySelector(selector);
  }

  function children$1(self) {
    return _.ISeqable.seq(self.children || _.filter(isElement, self.childNodes)); //IE has no children on document fragment
  }

  var descendants$1 = _.downward(_.IHierarchy.children);

  function nextSibling$1(self) {
    return self.nextElementSibling;
  }

  var nextSiblings$1 = _.upward(_.IHierarchy.nextSibling);

  function prevSibling$1(self) {
    return self.previousElementSibling;
  }

  var prevSiblings$1 = _.upward(_.IHierarchy.prevSibling);
  function siblings$1(self) {
    return _.concat(prevSiblings$1(self), nextSiblings$1(self));
  }

  function yank1(self) {
    //no jokes, please!
    yank2(parent$1(self), self);
  }

  function yank2(self, node) {
    if (isElement(node)) {
      self.removeChild(node);
    } else if (_.satisfies(_.ISequential, node)) {
      var _keys = node;
      _.each(self.removeAttribute.bind(self), _keys);
    } else if (isAttrs(node)) {
      var attrs = node;
      _.each(function (entry) {
        var key = entry[0],
            value = entry[1];
        var curr = lookup$3(self, key);

        if (_.isObject(curr)) {
          curr = mapa(function (pair) {
            return pair.join(": ") + "; ";
          }, _.ICoerceable.toArray(curr)).join("").trim();
        }

        curr == value && dissoc$2(self, key);
      }, attrs);
    } else if (_.isString(node)) {
      node = includes$3(self, node);
      self.removeChild(node);
    }
  }

  var yank$3 = _.overload(null, yank1, yank2);

  function includes$3(self, target) {
    if (isElement(target)) {
      var _target, _isIdentical;

      return _.ILocate.locate(children$1(self), (_isIdentical = _.isIdentical, _target = target, function isIdentical(_argPlaceholder5) {
        return _isIdentical(_target, _argPlaceholder5);
      }));
    } else if (_.satisfies(_.ISequential, target)) {
      var _keys2 = target;
      return _.IReduce.reduce(_keys2, function (memo, key) {
        return memo ? self.hasAttribute(key) : reduced(memo);
      }, true);
    } else if (isAttrs(target)) {
      return IKVReduce.reducekv(target, function (memo, key, value) {
        return memo ? lookup$3(self, key) == value : reduced(memo);
      }, true);
    } else {
      return _.ILocate.locate(contents$2(self), _.isString(target) ? function (node) {
        return node.nodeType === Node.TEXT_NODE && node.data === target;
      } : function (node) {
        return node === target;
      });
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

  function text1(self) {
    return self.textContent;
  }

  function text2(self, text) {
    self.textContent = text == null ? "" : text;
  }

  var text$2 = _.overload(null, text1, text2);

  function html1(self) {
    return self.innerHTML;
  }

  function html2(self, html) {
    if (_.isString(html)) {
      self.innerHTML = html;
    } else {
      empty(self);

      embed$2(html, self);
    }

    return self;
  }

  var html$1 = _.overload(null, html1, html2);

  function value1(self) {
    return "value" in self ? self.value : null;
  }

  function value2(self, value) {
    if ("value" in self) {
      value = value == null ? "" : value;

      if (self.value != value) {
        self.value = value;
      }
    } else {
      throw new TypeError("Type does not support value property.");
    }
  }

  var value$2 = _.overload(null, value1, value2);

  function reduce$1(self, xf, init) {
    return _.IReduce.reduce(_.IHierarchy.descendants(self), xf, init);
  }

  var ihierarchy = _.implement(_.IHierarchy, {
    root: root,
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
  var icontents = _.implement(IContent, {
    contents: contents$2
  });
  var ievented = _.implement($.IEvented, {
    on: on$1,
    off: off,
    trigger: trigger
  });
  var ilocate = _.implement(_.ILocate, {
    locate: locate$1
  });
  var iquery = _.implement(_.IQueryable, {
    query: query$1
  });
  var behaveAsElement = _.does(ihierarchy, icontents, ievented, iquery, ilocate, _.implement(_.IReduce, {
    reduce: reduce$1
  }), _.implement(IText, {
    text: text$2
  }), _.implement(IHtml, {
    html: html$1
  }), _.implement(IValue, {
    value: value$2
  }), _.implement(IEmbeddable, {
    embed: embed
  }), _.implement(mut.ITransientEmptyableCollection, {
    empty: empty
  }), _.implement(mut.ITransientInsertable, {
    before: before,
    after: after
  }), _.implement(_.IInclusive, {
    includes: includes$3
  }), _.implement(IHideable, {
    show: show$1,
    hide: hide$1,
    toggle: toggle$1
  }), _.implement(mut.ITransientYankable, {
    yank: yank$3
  }), _.implement(_.IMatchable, {
    matches: matches$1
  }), _.implement(_.ICloneable, {
    clone: clone
  }), _.implement(mut.ITransientAppendable, {
    append: append
  }), _.implement(mut.ITransientPrependable, {
    prepend: prepend
  }), _.implement(mut.ITransientCollection, {
    conj: conj$3
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

  var behaveAsDocumentFragment = _.does(behaveAsElement, _.implement(_.IHierarchy, {
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

  behaveAsDocumentFragment(dom.DocumentFragment);

  function replaceWith(self, other) {
    var parent = _.IHierarchy.parent(self),
        replacement = _.isString(other) ? document.createTextNode(other) : other;
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

  behaveAsElement(dom.Window);
  behaveAsElement(dom.Element);
  behaveAsElement(dom.Text);

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

  var first = _.comp(_.ISeq.first, seq$1);
  var rest = _.comp(_.ISeq.rest, seq$1);
  var next = _.comp(_.INext.next, seq$1);
  var children = _.comp(_.IHierarchy.children, seq$1);
  var descendants = _.comp(_.IHierarchy.descendants, seq$1);
  var nextSibling = _.comp(_.IHierarchy.nextSibling, seq$1);
  var nextSiblings = _.comp(_.IHierarchy.nextSiblings, seq$1);
  var prevSibling = _.comp(_.IHierarchy.prevSibling, seq$1);
  var prevSiblings = _.comp(_.IHierarchy.prevSiblings, seq$1);
  var siblings = _.comp(_.IHierarchy.siblings, seq$1);
  var parent = _.comp(_.IHierarchy.parent, seq$1);
  var parents = _.comp(_.IHierarchy.parents, seq$1);
  var contents$1 = _.comp(IContent.contents, seq$1);

  function query(self, selector) {
    var _selector, _IQueryable$query, _IQueryable;

    return _.maybe(self, seq$1, (_IQueryable = _.IQueryable, _IQueryable$query = _IQueryable.query, _selector = selector, function query(_argPlaceholder) {
      return _IQueryable$query.call(_IQueryable, _argPlaceholder, _selector);
    })) || [];
  }

  function locate(self, selector) {
    var _selector2, _ILocate$locate, _ILocate;

    return _.maybe(self, seq$1, (_ILocate = _.ILocate, _ILocate$locate = _ILocate.locate, _selector2 = selector, function locate(_argPlaceholder2) {
      return _ILocate$locate.call(_ILocate, _argPlaceholder2, _selector2);
    }));
  }

  function closest(self, selector) {
    var _selector3, _IHierarchy$closest, _IHierarchy;

    return _.maybe(self, seq$1, (_IHierarchy = _.IHierarchy, _IHierarchy$closest = _IHierarchy.closest, _selector3 = selector, function closest(_argPlaceholder3) {
      return _IHierarchy$closest.call(_IHierarchy, _argPlaceholder3, _selector3);
    }));
  }

  function reduce(self, f, init) {
    return _.IReduce.reduce(seq$1(self), f, init);
  }

  function count$1(self) {
    return self.length;
  }

  var behaveAsNodeList = _.does(_.iterable, _.implement(_.ILookup, {
    lookup: lookup$2
  }), _.implement(_.IIndexed, {
    nth: lookup$2
  }), _.implement(_.ICounted, {
    count: count$1
  }), _.implement(_.ISeq, {
    first: first,
    rest: rest
  }), _.implement(_.IReduce, {
    reduce: reduce
  }), _.implement(_.INext, {
    next: next
  }), _.implement(IContent, {
    contents: contents$1
  }), _.implement(_.ICoerceable, {
    toArray: Array.from
  }), _.implement(_.IQueryable, {
    query: query
  }), _.implement(_.ILocate, {
    locate: locate
  }), _.implement(_.IHierarchy, {
    parent: parent,
    parents: parents,
    closest: closest,
    nextSiblings: nextSiblings,
    nextSibling: nextSibling,
    prevSiblings: prevSiblings,
    prevSibling: prevSibling,
    siblings: siblings,
    children: children,
    descendants: descendants
  }), _.implement(_.ISequential), _.implement(_.ISeqable, {
    seq: seq$1
  }));

  behaveAsNodeList(dom.HTMLCollection);

  function isHTMLDocument(self) {
    return self instanceof dom.HTMLDocument;
  }

  var behaveAsHTMLDocument = _.does(behaveAsElement, _.implement(_.IMatchable, {
    matches: _.constantly(false)
  }), _.implement(_.IHierarchy, {
    closest: _.constantly(null),
    nextSibling: _.constantly(null),
    nextSiblings: _.emptyList,
    prevSibling: _.constantly(null),
    prevSiblings: _.emptyList,
    siblings: _.emptyList,
    parent: _.constantly(null),
    parents: _.emptyList
  }));

  behaveAsHTMLDocument(dom.HTMLDocument);

  var _either;

  function access(f, g) {
    function _value1(self) {
      var _param, _locate;

      return _.maybe(_.query(self, "option"), (_locate = _.locate, _param = function _param(option) {
        return option.selected;
      }, function locate(_argPlaceholder) {
        return _locate(_argPlaceholder, _param);
      }), f);
    }

    var value1 = g ? _.comp(g, _value1) : _value1;

    function value2(self, value) {
      _.each(function (option) {
        var selected = f(option) == value;

        if (option.selected != selected) {
          option.selected = selected;
        }
      }, _.query(self, "option"));
    }

    return _.overload(null, value1, value2);
  }

  var text$1 = access(IText.text, (_either = _.either, function either(_argPlaceholder2) {
    return _either(_argPlaceholder2, "");
  })),
      value$1 = access(IValue.value);
  var behaveAsHTMLSelectElement = _.does(_.implement(IValue, {
    value: value$1
  }), _.implement(IText, {
    text: text$1
  }));

  behaveAsHTMLSelectElement(dom.HTMLSelectElement);

  function isLocation(self) {
    return self instanceof dom.Location;
  }

  function matches(self, pattern) {
    if (_.isRegExp(pattern)) {
      return _.test(pattern, decodeURI(self.pathname));
    } else if (_.isString(pattern)) {
      return matches(self, new RegExp(pattern, "i"));
    }
  }

  function on(self, pattern, callback) {
    var matched = matches(self, pattern);

    if (matched) {
      callback(matched);
    }
  }

  var behaveAsLocation = _.does(_.specify($.IEvented, {
    on: on
  }), _.specify(_.IMatchable, {
    matches: matches
  }));

  behaveAsLocation(location);

  function asText(obj) {
    return _.mapa(function (entry) {
      var key = entry[0],
          value = entry[1];
      return _.str(key, ": ", value, ";");
    }, _.ISeqable.seq(obj)).join(" ");
  }

  function deref$1(self) {
    var text = self.element.getAttribute(self.key);
    return text == null ? {} : _.IReduce.reduce(_.mapa(function (text) {
      return _.mapa(_.trim, _.split(text, ":"));
    }, _.compact(_.split(text, ";"))), function (memo, pair) {
      return _.ICollection.conj(memo, pair);
    }, {});
  }

  function lookup$1(self, key) {
    return _.ILookup.lookup(deref$1(self), key);
  }

  function contains$1(self, key) {
    return _.IAssociative.contains(deref$1(self), key);
  }

  function assoc$1(self, key, value) {
    self.element.setAttribute(self.key, asText(_.IAssociative.assoc(deref$1(self), key, value)));
  }

  function dissoc$1(self, key) {
    self.element.setAttribute(self.key, asText(_.IMap.dissoc(deref$1(self), key)));
  }

  function keys(self) {
    return _.IMap.keys(deref$1(self));
  }

  function vals(self) {
    return _.IMap.vals(deref$1(self));
  }

  function includes$2(self, pair) {
    return _.IInclusive.includes(deref$1(self), pair);
  }

  function yank$2(self, pair) {
    self.element.setAttribute(self.key, asText(_.IYankable.yank(deref$1(self), pair)));
  }

  function conj$2(self, pair) {
    self.element.setAttribute(self.key, asText(_.ICollection.conj(deref$1(self), pair)));
  }

  var behaveAsNestedAttrs = _.does(_.implement(_.IDescriptive), _.implement(_.IDeref, {
    deref: deref$1
  }), _.implement(_.IMap, {
    keys: keys,
    vals: vals
  }), _.implement(mut.ITransientMap, {
    dissoc: dissoc$1
  }), _.implement(_.IInclusive, {
    includes: includes$2
  }), _.implement(_.IAssociative, {
    contains: contains$1
  }), _.implement(mut.ITransientAssociative, {
    assoc: assoc$1
  }), _.implement(_.ILookup, {
    lookup: lookup$1
  }), _.implement(mut.ITransientYankable, {
    yank: yank$2
  }), _.implement(mut.ITransientCollection, {
    conj: conj$2
  }), _.implement(_.ICoerceable, {
    toObject: deref$1
  }));

  behaveAsNestedAttrs(NestedAttrs);

  function isNodeList(self) {
    return self.constructor === dom.NodeList;
  }

  behaveAsNodeList(dom.NodeList);

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

  function yank$1(self, entry) {
    includes$1(self, entry) && _dissoc(self, _.key(entry));
  }

  function conj$1(self, entry) {
    assoc(self, _.key(entry), _.val(entry));
  }

  var behaveAsProps = _.does(_.implement(_.IDescriptive), _.implement(mut.ITransientMap, {
    dissoc: dissoc
  }), _.implement(_.IMap, {
    keys: Object.keys,
    vals: Object.values
  }), _.implement(_.IInclusive, {
    includes: includes$1
  }), _.implement(mut.ITransientAssociative, {
    assoc: assoc
  }), _.implement(_.IAssociative, {
    contains: contains
  }), _.implement(_.ILookup, {
    lookup: lookup
  }), _.implement(mut.ITransientYankable, {
    yank: yank$1
  }), _.implement(mut.ITransientCollection, {
    conj: conj$1
  }));

  behaveAsProps(Props);

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

  var spaceSep = _.overload(null, spaceSep1, spaceSep2);
  var classes = spaceSep1("class");

  function seq(self) {
    var text = self.element.getAttribute(self.key);
    return text && text.length ? text.split(" ") : null;
  }

  function includes(self, text) {
    var xs = seq(self);
    return xs && _.locate(xs, function (t) {
      return t == text;
    });
  }

  function conj(self, text) {
    self.element.setAttribute(self.key, deref(self).concat(text).join(" "));
  }

  function yank(self, text) {
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

  var behaveAsSpaceSeparated = _.does(_.implement(_.ISequential), _.implement(_.ISeq, {
    seq: seq
  }), _.implement(_.IDeref, {
    deref: deref
  }), _.implement(_.IInclusive, {
    includes: includes
  }), _.implement(mut.ITransientYankable, {
    yank: yank
  }), _.implement(_.ICounted, {
    count: count
  }), _.implement(mut.ITransientCollection, {
    conj: conj
  }), _.implement(_.ICoerceable, {
    toArray: deref
  }));

  behaveAsSpaceSeparated(SpaceSeparated);

  function isXMLDocument(self) {
    return self instanceof dom.XMLDocument;
  }

  behaveAsHTMLDocument(dom.XMLDocument);

  function contents2(self, type) {
    return _.filter(function (node) {
      return node.nodeType === type;
    }, IContent.contents(self));
  }

  var contents = _.overload(null, IContent.contents, contents2);

  var hide = IHideable.hide;
  var show = IHideable.show;
  var toggle = IHideable.toggle;

  var html = IHtml.html;

  var text = IText.text;

  var value = IValue.value;

  function ready(callback) {
    if (dom.document.readyState !== 'loading') {
      callback(null);
    } else {
      dom.document.addEventListener("DOMContentLoaded", callback);
    }
  }

  function attr2(self, key) {
    if (_.isString(key)) {
      return self.getAttribute(key);
    } else {
      var _self, _attr;

      var pairs = key;
      _.eachkv((_attr = attr3, _self = self, function attr3(_argPlaceholder, _argPlaceholder2) {
        return _attr(_self, _argPlaceholder, _argPlaceholder2);
      }), pairs);
    }
  }

  function attr3(self, key, value) {
    self.setAttribute(key, _.str(value));
  }

  function attrN(self) {
    var stop = (arguments.length <= 1 ? 0 : arguments.length - 1) - 1;

    for (var i = 0; i <= stop; i += 2) {
      attr3(self, i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1], i + 1 + 1 < 1 || arguments.length <= i + 1 + 1 ? undefined : arguments[i + 1 + 1]);
    }
  }

  var attr = _.overload(null, null, attr2, attr3, attrN);

  function removeAttr2(self, key) {
    self.removeAttribute(key);
  }

  var removeAttr = _.overload(null, null, removeAttr2, _.doing(removeAttr2));

  function prop3(self, key, value) {
    self[key] = value;
  }

  function prop2(self, key) {
    return self[key];
  }

  var prop = _.overload(null, null, prop2, prop3);
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

  var removeStyle = _.overload(null, null, removeStyle2, removeStyle3);
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

  var toggleClass = _.overload(null, null, toggleClass2, toggleClass3);
  function hasClass(self, name) {
    return self.classList.contains(name);
  }
  function assert(el, selector) {
    if (!_.matches(el, selector)) {
      throw new InvalidHostElementError(el, selector);
    }
  }

  function mount3(render, config, el) {
    return mount4(_.constantly(null), render, config, el);
  }

  function mount4(create, render, config, el) {
    var _el, _param, _$$on, _$, _el2, _config, _bus, _render, _el3;

    config.what && $.trigger(el, config.what + ":installing", {
      bubbles: true,
      detail: {
        config: config
      }
    });
    $.trigger(el, "installing", {
      bubbles: true,
      detail: {
        config: config
      }
    });
    var bus = create(config),
        detail = {
      config: config,
      bus: bus
    };
    _el = el, (_$ = $, _$$on = _$.on, _param = function _param(e) {
      Object.assign(e.detail, detail);
    }, function on(_argPlaceholder3) {
      return _$$on.call(_$, _argPlaceholder3, "mounting mounted", _param);
    })(_el);
    _el2 = el, (_render = render, _config = config, _bus = bus, function render(_argPlaceholder4) {
      return _render(_argPlaceholder4, _config, _bus);
    })(_el2);
    _el3 = el, mounts(_el3);
    config.what && $.trigger(el, config.what + ":installed", {
      bubbles: true,
      detail: detail
    });
    $.trigger(el, "installed", {
      bubbles: true,
      detail: detail
    });
    return bus;
  }

  var mount = _.overload(null, null, null, mount3, mount4);
  var markup = _.obj(function (name) {
    for (var _len = arguments.length, contents = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      contents[_key - 1] = arguments[_key];
    }

    var attrs = _.map(function (entry) {
      return _.template("{0}=\"{1}\"", _.key(entry), _.replace(_.val(entry), /"/g, '&quot;'));
    }, _.apply(_.merge, _.filter(_.isObject, contents)));
    var content = _.map(_.str, _.remove(_.isObject, contents));
    return _.join("", _.concat(["<" + name + " " + _.join(" ", attrs) + ">"], content, "</" + name + ">"));
  }, Infinity);
  function tag() {
    return _.apply(_.partial, element, _.slice(arguments));
  }

  function sel02(selector, context) {
    return _.query(context, context.querySelectorAll ? selector : function (v) {
      return _.matches(v, selector);
    });
  }

  function sel01(selector) {
    return sel02(selector, dom.document);
  }

  function sel00() {
    return _.descendants(dom.document);
  }

  var sel = _.overload(sel00, sel01, sel02);

  function sel12(selector, context) {
    return _.locate(context, selector);
  }

  function sel11(selector) {
    return sel12(selector, dom.document);
  }

  function sel10() {
    return _.first(_.descendants(dom.document));
  }

  var sel1 = _.overload(sel10, sel11, sel12);
  function checkbox() {
    var checkbox = tag('input', {
      type: "checkbox"
    });

    function value1(el) {
      return el.checked;
    }

    function value2(el, checked) {
      el.checked = checked;
    }

    var value = _.overload(null, value1, value2);
    return _.doto(checkbox.apply(void 0, arguments), _.specify(IValue, {
      value: value
    }));
  }
  function select(options) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var select = tag('select'),
        option = tag('option'),
        el = select.apply(void 0, args);
    _.each(function (entry) {
      mut.append(el, option({
        value: _.key(entry)
      }, _.val(entry)));
    }, options);
    return el;
  }
  var textbox = tag('input', {
    type: "text"
  });
  _.extend(_.ICoerceable, {
    toFragment: null
  });
  var toFragment = _.ICoerceable.toFragment;

  (function () {
    function embed(self, parent, nextSibling) {
      IEmbeddable.embed(dom.document.createTextNode(self), parent, nextSibling);
    }

    function toFragment(self) {
      return dom.document.createRange().createContextualFragment(self);
    }

    _.doto(String, _.implement(_.ICoerceable, {
      toFragment: toFragment
    }), _.implement(IEmbeddable, {
      embed: embed
    }));
  })();

  (function () {
    function embed(self, parent, nextSibling) {
      IEmbeddable.embed(dom.document.createTextNode(_.str(self)), parent, nextSibling);
    }

    _.doto(Number, _.implement(IEmbeddable, {
      embed: embed
    }));
  })();

  (function () {
    function embed(self, parent) {
      _.each(function (entry) {
        mut.assoc(parent, _.key(entry), _.val(entry));
      }, self);
    }

    _.doto(Object, _.implement(IEmbeddable, {
      embed: embed
    }));
  })();

  (function () {
    function toFragment(_) {
      return dom.document.createRange().createContextualFragment("");
    }

    _.doto(_.Nil, _.implement(_.ICoerceable, {
      toFragment: toFragment
    }), _.implement(IEmbeddable, {
      embed: _.identity
    }));
  })();

  Object.defineProperty(exports, 'after', {
    enumerable: true,
    get: function () {
      return mut.after;
    }
  });
  Object.defineProperty(exports, 'append', {
    enumerable: true,
    get: function () {
      return mut.append;
    }
  });
  Object.defineProperty(exports, 'before', {
    enumerable: true,
    get: function () {
      return mut.before;
    }
  });
  Object.defineProperty(exports, 'empty', {
    enumerable: true,
    get: function () {
      return mut.empty;
    }
  });
  Object.defineProperty(exports, 'prepend', {
    enumerable: true,
    get: function () {
      return mut.prepend;
    }
  });
  Object.defineProperty(exports, 'yank', {
    enumerable: true,
    get: function () {
      return mut.yank;
    }
  });
  exports.Attrs = Attrs;
  exports.IContent = IContent;
  exports.IEmbeddable = IEmbeddable;
  exports.IHideable = IHideable;
  exports.IHtml = IHtml;
  exports.IMountable = IMountable;
  exports.IText = IText;
  exports.IValue = IValue;
  exports.InvalidHostElementError = InvalidHostElementError;
  exports.NestedAttrs = NestedAttrs;
  exports.Props = Props;
  exports.SpaceSeparated = SpaceSeparated;
  exports.addClass = addClass;
  exports.addStyle = addStyle;
  exports.assert = assert;
  exports.attr = attr;
  exports.attrs = attrs;
  exports.checkbox = checkbox;
  exports.classes = classes;
  exports.contents = contents;
  exports.element = element;
  exports.elementns = elementns;
  exports.embeds = embeds;
  exports.enable = enable;
  exports.fragment = fragment;
  exports.hasClass = hasClass;
  exports.hide = hide;
  exports.html = html;
  exports.isDocumentFragment = isDocumentFragment;
  exports.isElement = isElement;
  exports.isHTMLDocument = isHTMLDocument;
  exports.isLocation = isLocation;
  exports.isMountable = isMountable;
  exports.isNodeList = isNodeList;
  exports.isVisible = isVisible;
  exports.isXMLDocument = isXMLDocument;
  exports.markup = markup;
  exports.mount = mount;
  exports.mounts = mounts;
  exports.nestedAttrs = nestedAttrs;
  exports.prop = prop;
  exports.props = props;
  exports.ready = ready;
  exports.removeAttr = removeAttr;
  exports.removeClass = removeClass;
  exports.removeStyle = removeStyle;
  exports.replaceWith = replaceWith;
  exports.sel = sel;
  exports.sel1 = sel1;
  exports.select = select;
  exports.show = show;
  exports.spaceSep = spaceSep;
  exports.style = style;
  exports.tag = tag;
  exports.text = text;
  exports.textbox = textbox;
  exports.toFragment = toFragment;
  exports.toggle = toggle;
  exports.toggleClass = toggleClass;
  exports.value = value;
  exports.wrap = wrap;

  Object.defineProperty(exports, '__esModule', { value: true });

});
