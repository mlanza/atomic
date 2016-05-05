(function (exports) {
  'use strict';

  var unbind = Function.call.bind(Function.bind, Function.call);
  function isIdentical(a, b) {
    return a === b;
  }

  function Reduced(value) {
    this.value = value;
  }

  Reduced.prototype.valueOf = function () {
    //TODO Deref protocol?
    return this.value;
  };

  function reduced(value) {
    return new Reduced(value);
  }

  /*TODO consider that slice takes from, to args and that both are optional: slice(arr, from, to) in curried form slice (from, to, arr)
    as such an alternative to curry/subj would be config where all configurations are provided in the first call, thus...
      slice(1, 2, ["manny", "moe", "jack"]) invokes immediately as before
      slice(1, 2) awaits payload as usual
      slice(1) also awaits payload, not `to` as one might expect
    another alternative it to require configurations passed in as an object: 
      slice({from: 1, to: 2}, ["manny", "moe", "jack"]) invokes immediately as before
      slice({from: 1, to: 2}) awaits payload as usual
      slice({from: 1}) awaits payload as usual
    Both styles means that we cannot add additional options later as the last entry in both styles is missing the `to` arg.  With that being
    the case I prefer the former. We could make all options required:
      slice(1, 2, ["manny", "moe", "jack"]) invokes immediately as before
      slice(1, 2) awaits payload as usual
      slice(1) expects to option
      slice(1, null) uses default `to` value
    This is the trouble with currying variadic functions.  Another option is to create two versions of the curried function:
      slice(from, to, arr)
      through(from, arr);
    The main thing for curried functions is they must have a fixed number of arguments.  An options argument could be last.
    Another option is to allow partial with placeholders.
      through = partial(slice, _, null);
    Now what about options?  How do they work with currying?
  */

  var slice$1 = unbind(Array.prototype.slice);
  var splice = unbind(Array.prototype.splice);
  var reverse = unbind(Array.prototype.reverse);
  var join = unbind(Array.prototype.join);
  var concat = unbind(Array.prototype.concat);

  function empty$1() {
    return [];
  }

  function isEmpty$1(self) {
    return self.length === 0;
  }

  function append$2(self, item) {
    return self.concat([item]);
  }

  function prepend$1(self, item) {
    return [item].concat(self);
  }

  function each$1(self, f) {
    var len = self.length,
        i = 0,
        result = null;
    while (i < len && !(result instanceof Reduced)) {
      result = f(self[i++]);
    }
  }

  function reduce$1(self, f, init) {
    var len = self.length,
        i = 0,
        memo = init;
    while (i < len && !(memo instanceof Reduced)) {
      memo = f(memo, self[i++]);
    }
    return memo instanceof Reduced ? memo.valueOf() : memo;
  }

  function first$1(self, len) {
    return len ? slice$1(self, 0, len) : self[0];
  }

  function last(self, len) {
    return len ? slice$1(self, self.length - len) : self[self.length - 1];
  }

  function initial(self, offset) {
    return slice$1(self, 0, self.length - (offset || 1));
  }

  function rest$1(self, idx) {
    return slice$1(self, idx || 1);
  }

  function assoc$1(arr, idx, value) {
    var result = slice$1(arr);
    result.splice(idx, 1, value);
    return result;
  }

  function hasKey$1(arr, idx) {
    return idx > -1 && idx < arr.length;
  }

  var assign = Object.assign; //TODO polyfill
  var keys = Object.keys;

  function empty() {
    return {};
  }

  function isEmpty(self) {
    return keys(self).length === 0;
  }

  function identity(value) {
    return value;
  }

  function is(value, constructor) {
    return value != null && value.constructor === constructor;
  }

  function append$1(self, obj) {
    return assign({}, self, obj);
  }

  function prepend(self, obj) {
    return assign({}, obj, self);
  }

  function each(self, f) {
    var ks = keys(self),
        l = ks.length,
        i = 0,
        result = null;
    while (i < l && !(result instanceof Reduced)) {
      var key = ks[i++];
      result = f([key, self[key]]);
    }
  }

  function reduce(self, f, init) {
    var ks = keys(self),
        l = ks.length,
        i = 0,
        memo = init;
    while (i < l && !(result instanceof Reduced)) {
      var key = ks[i++];
      memo = f(memo, [key, self[key]]);
    }
    return memo instanceof Reduced ? memo.valueOf() : memo;
  }

  function constructs(value) {
    return value.constructor;
  }

  function assoc(obj, key, value) {
    var add = {};
    add[key] = value;
    return assign({}, obj, add);
  }

  function hasKey(obj, key) {
    return obj.hasOwnProperty(key);
  }

  function first(obj) {
    var ks = keys(obj).sort(),
        key = ks[0];
    return ks.length ? [key, obj[key]] : null;
  }

  function rest(obj) {
    return reduce$1(keys(obj).sort().slice(1), function (memo, key) {
      memo[key] = obj[key];
      return memo;
    }, {});
  }

  function curry(self, len, applied) {
    if (arguments.length === 1) len = self.length;
    return function () {
      //a call without args applies a single undefined arg potentially allowing the curried function to substitute a default value.
      var args = (applied || []).concat(arguments.length === 0 ? [undefined] : slice$1(arguments));
      if (args.length >= len) {
        return self.apply(this, args);
      } else {
        return curry(self, len, args);
      }
    };
  }

  function complement(f) {
    return function () {
      return !f.apply(this, arguments);
    };
  }

  function arities(lkp, fallback) {
    return assign(function () {
      var f = lkp[arguments.length] || fallback;
      return f.apply(this, arguments);
    }, lkp);
  }

  function multiarity() {
    return arities(reduce$1(arguments, function (memo, f) {
      memo[f.length] = f;
      return memo;
    }, {}));
  }

  function overload() {
    return arities(arguments, last(arguments));
  }

  function flip(self, len) {
    var at = (len || 2) - 1;
    return function () {
      var args = concat(slice$1(arguments, at, len), concat(first$1(arguments, at), rest$1(arguments, len)));
      return self.apply(this, args);
    };
  }

  function subj(self, len) {
    var length = len || self.length;
    return length > 1 ? curry(flip(self, length), length) : self;
  }

  function pipe() {
    var fs = slice$1(arguments); //TODO could slice be part of the Seq protocol?
    return function (value) {
      return reduce$1(fs, function (value, self) {
        return self(value);
      }, value);
    };
  }

  function chain(target) {
    return pipe.apply(this, rest$1(arguments))(target);
  }

  function compose() {
    return pipe.apply(this, reverse(slice$1(arguments)));
  }

  function multimethod(dispatch) {
    return function () {
      var f = dispatch.apply(this, arguments);
      return f.apply(this, arguments);
    };
  }

  function method(defaultFn) {
    var dispatcher = new Map(),
        dispatch = function dispatch(value) {
      if (value == null) return defaultFn;
      return dispatcher.get(constructs(value)) || defaultFn;
    };
    return assign(multimethod(dispatch), { dispatcher: dispatcher, dispatch: dispatch });
  }

  function _extend(self, constructor, f) {
    self.dispatcher.set(constructor, f);
    return self;
  }

  var handles = method(function (c, f) {
    return f.dispatcher.get(c);
  });

  function constantly(value) {
    return function () {
      return value;
    };
  }

  function eq$1(a, b) {
    return a == b;
  }

  function gt$1(a, b) {
    return a > b;
  }

  function gte$1(a, b) {
    return a >= b;
  }

  function lt$1(a, b) {
    return a < b;
  }

  function lte$1(a, b) {
    return a <= b;
  }

  var eq = subj(eq$1);
  var gt = subj(gt$1);
  var gte = subj(gte$1);
  var lte = subj(lte$1);
  var lt = subj(lt$1);

  var slice$2 = subj(slice$1, 3);
  var join$1 = subj(join, 2);
  var append$3 = subj(append$2);
  var prepend$2 = subj(prepend$1);
  var each$2 = subj(each$1);
  var reduce$2 = subj(reduce$1);
  var first$2 = subj(first$1); //TODO consider affect of optional params: i.e. chain(["larry", "moe"], first()) vs chain(["larry", "moe"], first);
  var last$1 = subj(last);
  var initial$1 = subj(initial);
  var rest$2 = subj(rest$1);

  function def$1(self, template) {
    for (var key in template) {
      self[key] = method(template[key]);
    }
    return self;
  }

  function Protocol(template) {
    def$1(this, template);
  }

  function create(template) {
    return new Protocol(template);
  }

  function extend$1(self, constructor, template) {
    for (var key in template) {
      _extend(self[key], constructor, template[key]);
    }
    return self;
  }

  function satisfies$1(self, value) {
    for (var key in self) {
      var f = self[key];
      if (!f.dispatch(value)) return false;
    }
    return true;
  }

  var def = subj(def$1);
  var satisfies = subj(satisfies$1);
  var extend = subj(extend$1);
  var protocol = create;

  var Deref = protocol({
    deref: function deref(obj) {
      return obj.valueOf();
    }
  });

  var toUpperCase = unbind(String.prototype.toUpperCase);
  var toLowerCase = unbind(String.prototype.toLowerCase);

  function empty$2() {
    return "";
  }

  function isEmpty$2(str) {
    return str === "";
  }

  function append$5(str, suffix) {
    return str + suffix;
  }

  function prepend$4(str, prefix) {
    return prefix + str;
  }

  function each$3(str, f) {
    var len = str.length,
        i = 0,
        result = null;
    while (i < len && !(result instanceof Reduced)) {
      result = f(str[i++]);
    }
    return str;
  }

  function reduce$3(str, f, init) {
    var len = str.length,
        i = 0,
        memo = init;
    while (i < len && !(memo instanceof Reduced)) {
      memo = f(memo, str[i++]);
    }
    return memo instanceof Reduced ? memo.valueOf() : memo;
  }

  function assoc$2(str, idx, ch) {
    return slice(str).splice(idx, 1, ch).join("");
  }

  function hasKey$2(str, idx) {
    return idx > -1 && idx < str.length;
  }

  function empty$3() {
    return {};
  }

  function each$4(self, f) {
    var ks = keys(self),
        l = ks.length,
        i = 0,
        result = null;
    while (i < l && !(memo instanceof Reduced)) {
      var key = ks[i++];
      result = f(self[key]);
    }
  }

  function reduce$4(self, f, init) {
    var ks = keys(self),
        len = ks.length,
        i = 0,
        memo = init;
    while (i < len && !(memo instanceof Reduced)) {
      var key = ks[i++];
      memo = f(memo, self[key]);
    }
    return memo instanceof Reduced ? memo.valueOf() : memo;
  }

  //TODO use get/assoc protocol with attributes

  function append$6(el, child) {
    el.appendChild(is(child, String) ? document.createTextNode(child) : child);
    return el;
  }

  function prepend$5(el, child) {
    el.insertBefore(is(child, String) ? document.createTextNode(child) : child, el.firstChild);
    return el;
  }

  function getAttr(el, key) {
    var attr = el.attributes.getNamedItem(key);
    return attr && attr.value;
  }

  function setAttr(el, pair) {
    var key = pair[0],
        value = pair[1],
        attr = document.createAttribute(key);
    attr.value = value;
    el.attributes.setNamedItem(attr);
    return el;
  }

  function hasClass(el, str) {
    return el.classList.contains(str);
  }

  function addClass(el, str) {
    el.classList.add(str);
    return el;
  }

  function removeClass(el, str) {
    el.classList.remove(str);
    return el;
  }

  function parent(el) {
    return el.parentNode;
  }

  function query(el, selector) {
    return el.querySelectorAll(selector);
  }

  function find(el, selector) {
    return el.querySelector(selector);
  }

  function style(el, pair) {
    var key = pair[0],
        value = pair[1];
    el.style[key] = value;
    return el;
  }

  function text(el) {
    return el.textContent;
  }

  function remove(el) {
    el.parentElement.removeChild(el);
    return el;
  }

  //TODO use lazy list of parents -- also create lazy seq of nextSibling and previousSibling
  function closest(el, selector) {
    var node = el;
    while (node) {
      if (node.matches(selector)) return node;
      node = node.parentNode;
    }
    return node;
  }
  //TODO extract logic in util.js tag for passing in unrealized functions until non-functions are passed in and all results are fully resolved
  function tag(name) {
    return function () {
      var el = document.createElement(name);
      each$1(arguments, function (item) {
        is(item, Object) ? each(item, function (pair) {
          setAttr(el, pair);
        }) : append$6(el, item);
      });
      return el;
    };
  }

  /*

  export function attrs(el){
    return index.reduce(el.attributes, function(memo, attr){
      memo[attr.nodeName] = attr.nodeValue;
      return memo;
    }, {});
  }*/

  function fail(target) {
    throw new Error("Cannot resolve protocol for target: " + target);
  }

  function whenElement(f) {
    return function (target) {
      return target instanceof HTMLElement ? f : fail;
    };
  }

  var Extend = chain(protocol({ //TODO protocol should provide secondary means of dynamically extending -- use multimethod as defaultFn
    append: multimethod(whenElement(append$6)), //TODO provide a dynamic means of setting defaultFn of protocol.
    prepend: multimethod(whenElement(prepend$5)) //TODO alternately, provide a way of wrapping an existing function with an alternative handler -- this mechanism doesn't make a multimethod easy to extend (or unextend) and it should be
  }), extend(String, {
    append: append$5,
    prepend: prepend$4
  }), extend(Array, {
    append: append$2,
    prepend: prepend$1
  }), extend(Object, {
    append: append$1,
    prepend: prepend
  }));

  var log = console.log.bind(console);

  var append$7 = subj(append$6);
  var prepend$6 = subj(prepend$5);
  var getAttr$1 = subj(getAttr);
  var setAttr$1 = subj(setAttr);
  var hasClass$1 = subj(hasClass);
  var addClass$1 = subj(addClass);
  var removeClass$1 = subj(removeClass);
  var closest$1 = subj(closest);
  var query$1 = subj(query);
  var find$1 = subj(find);
  var style$1 = subj(style);
  var remove$1 = remove;
  var show = style$1(["display", "inherit"]);
  var hide = style$1(["display", "none"]);

var dom$1 = Object.freeze({
  	append: append$7,
  	prepend: prepend$6,
  	getAttr: getAttr$1,
  	setAttr: setAttr$1,
  	hasClass: hasClass$1,
  	addClass: addClass$1,
  	removeClass: removeClass$1,
  	closest: closest$1,
  	query: query$1,
  	find: find$1,
  	style: style$1,
  	remove: remove$1,
  	show: show,
  	hide: hide,
  	parent: parent,
  	text: text,
  	tag: tag
  });

  var Seq = chain(protocol({
    each: each$4,
    reduce: reduce$4,
    first: function first(value) {
      return value;
    },
    rest: function rest(value) {
      return value;
    }
  }), extend(String, {
    each: each$3,
    reduce: reduce$3,
    first: first$1,
    rest: rest$1
  }), extend(Cons, {
    each: each$5,
    reduce: reduce$5,
    first: first$3,
    rest: rest$3
  }), extend(Array, {
    each: each$1,
    reduce: reduce$1,
    first: first$1,
    rest: rest$1
  }), extend(Object, {
    each: each,
    reduce: reduce,
    first: first,
    rest: rest
  }));

  function Cons(head, tail) {
    this.head = head;
    this.tail = tail;
  }

  function cons(head, tail) {
    return new Cons(head, tail || constantly(EMPTY));
  }

  var EMPTY = cons(null);
  var empty$4 = constantly(EMPTY);

  function isEmpty$3(self) {
    return self === EMPTY;
  }

  function each$5(self, f) {
    var result = null,
        next = self;
    while (next !== EMPTY && !(result instanceof Reduced)) {
      result = f(next.head);
      next = next.tail();
    }
  }

  function reduce$5(self, f, init) {
    var memo = init,
        next = self;
    while (next !== EMPTY && !(memo instanceof Reduced)) {
      memo = f(memo, next.head);
      next = next.tail();
    }
    return memo instanceof Reduced ? memo.valueOf() : memo;
  }

  function seq(coll) {
    return isEmpty$3(coll) ? EMPTY : cons(Seq.first(coll), function () {
      return seq(Seq.rest(coll));
    });
  }

  function iterate(generate, seed) {
    return cons(seed, function () {
      return iterate(generate, generate(seed));
    });
  }

  var repeatedly = multiarity(function (f) {
    return iterate(f, f());
  }, function (n, f) {
    return n > 0 ? cons(f(), function () {
      return repeatedly(n - 1, f);
    }) : EMPTY;
  });

  var repeat = overload(null, function (value) {
    return repeatedly(constantly(value));
  }, function (n, value) {
    return repeatedly(n, constantly(value));
  });

  function first$3(self) {
    return self === EMPTY ? null : self.head;
  }

  function rest$3(self) {
    return self === EMPTY ? EMPTY : self.tail();
  }

  function map(f, coll) {
    return isEmpty$3(coll) ? EMPTY : cons(f(Seq.first(coll)), function () {
      return map(f, Seq.rest(coll));
    });
  }

  function filter(pred, coll) {
    if (isEmpty$3(coll)) return EMPTY;
    var item;
    do {
      item = Seq.first(coll), coll = Seq.rest(coll);
    } while (!pred(item));
    return item != null ? cons(item, function () {
      return filter(pred, coll);
    }) : EMPTY;
  }

  function remove$2(pred, coll) {
    return filter(complement(pred), coll);
  }

  function take(n, coll) {
    return n && !isEmpty$3(coll) ? cons(Seq.first(coll), function () {
      return take(n - 1, Seq.rest(coll));
    }) : EMPTY;
  }

  function takeWhile(pred, coll) {
    if (isEmpty$3(coll)) return EMPTY;
    var item = Seq.first(coll),
        coll = Seq.rest(coll);
    return pred(item) ? cons(item, function () {
      return takeWhile(pred, coll);
    }) : EMPTY;
  }

  function takeNth(n, coll) {
    if (isEmpty$3(coll)) return EMPTY;
    var s = seq(coll);
    return cons(Seq.first(s), function () {
      return takeNth(n, drop(n, s));
    });
  }

  function drop(n, coll) {
    var remaining = n;
    return dropWhile(function () {
      return remaining-- > 0;
    }, coll);
  }

  function dropWhile(pred, coll) {
    if (isEmpty$3(coll)) return EMPTY;
    do {
      var item = Seq.first(coll);
      if (!pred(item)) break;
      coll = Seq.rest(coll);
    } while (true);
    return seq(coll);
  }

  function some(pred, coll) {
    return Seq.reduce(coll, function (memo, value) {
      return pred(value) ? reduced(value) : memo;
    }, null);
  }

  function isEvery(pred, coll) {
    return Seq.reduce(coll, function (memo, value) {
      return !pred(value) ? reduced(false) : memo;
    }, true);
  }

  function add$1(x, y) {
    return x + y;
  }

  function subtract$1(x, y) {
    return x - y;
  }

  var iterate$1 = curry(iterate);

  var add = subj(add$1);
  var subtract = subj(subtract$1);
  var inc = add(1);
  var dec = subtract(1);
  var increasingly = iterate$1(inc);
  var decreasingly = iterate$1(dec);

  var range = multiarity(function () {
    //TODO number range, date range, string range, etc.
    return iterate$1(inc, 0);
  }, function (end) {
    return range(0, end, 1);
  }, function (start, end) {
    return range(start, end, 1);
  }, function (start, end, step) {
    var next = start + step;
    return next >= end ? cons(start) : cons(start, function () {
      return range(next, end, step);
    });
  });

  function seeding(f, init) {
    return overload(init, identity, f);
  }

  var transduce = multiarity(function (xform, f, coll) {
    var xf = xform(f);
    return xf(Seq.reduce(coll, xf, f()));
  }, function (xform, f, seed, coll) {
    return transduce(xform, seeding(f, constantly(seed)), coll);
  });

  var into = multiarity(function (to, from) {
    return Seq.reduce(from, Extend.append, to);
  }, function (to, xform, from) {
    return transduce(xform, append, to, from);
  });

  /*export function tap(f){
    return function(xf){
      return overload(xf, xf, function(memo, value){
        f(value);
        return xf(memo, value);
      });
    }
  }*/

  function map$1(f) {
    return function (xf) {
      return overload(xf, xf, function (memo, value) {
        return xf(memo, f(value));
      });
    };
  }

  function filter$1(pred) {
    return function (xf) {
      return overload(xf, xf, function (memo, value) {
        return pred(value) ? xf(memo, value) : memo;
      });
    };
  }

  var remove$3 = compose(filter$1, complement);

  function take$1(n) {
    return function (xf) {
      var taking = n;
      return overload(xf, xf, function (memo, value) {
        return taking-- > 0 ? xf(memo, value) : reduced(memo);
      });
    };
  }

  function takeWhile$1(pred) {
    return function (xf) {
      return overload(xf, xf, function (memo, value) {
        return pred(value) ? xf(memo, value) : reduced(memo);
      });
    };
  }

  function takeNth$1(n) {
    return function (xf) {
      var x = -1;
      return overload(xf, xf, function (memo, value) {
        x++;
        return x === 0 || x % n === 0 ? xf(memo, value) : memo;
      });
    };
  }

  function drop$1(n) {
    return function (xf) {
      var dropping = n;
      return overload(xf, xf, function (memo, value) {
        return dropping-- > 0 ? memo : xf(memo, value);
      });
    };
  }

  function dropWhile$1(pred) {
    return function (xf) {
      var dropping = true;
      return overload(xf, xf, function (memo, value) {
        !dropping || (dropping = pred(value));
        return dropping ? memo : xf(memo, value);
      });
    };
  }

  var Empty = chain(protocol({
    empty: empty$3,
    isEmpty: null
  }), extend(Cons, {
    empty: empty$4,
    isEmpty: isEmpty$3
  }), extend(String, {
    empty: empty$2,
    isEmpty: isEmpty$2
  }), extend(Array, {
    empty: empty$1,
    isEmpty: isEmpty$1
  }), extend(Object, {
    empty: empty,
    isEmpty: isEmpty
  }));

  var isEmpty$4 = Empty.isEmpty;

  var Seq$1 = chain(protocol({
    each: each$4,
    reduce: reduce$4,
    first: function first(value) {
      return value;
    },
    rest: function rest(value) {
      return value;
    }
  }), extend(String, {
    each: each$3,
    reduce: reduce$3,
    first: first$1,
    rest: rest$1
  }), extend(Cons, {
    each: each$5,
    reduce: reduce$5,
    first: first$3,
    rest: rest$3
  }), extend(Array, {
    each: each$1,
    reduce: reduce$1,
    first: first$1,
    rest: rest$1
  }), extend(Object, {
    each: each,
    reduce: reduce,
    first: first,
    rest: rest
  }));

  var rest$5 = Seq$1.rest;
  var first$5 = Seq$1.first;

  function sameContent(self, other) {
    if (self == null || other == null) return self == other;
    return isEmpty$4(self) && isEmpty$4(other) || eq$3(first$5(self), first$5(other)) && sameContent(rest$5(self), rest$5(other));
  }

  var Eq = chain(protocol({
    eq: sameContent
  }), extend(Cons, {
    eq: sameContent
  }), extend(Number, {
    eq: isIdentical
  }), extend(String, {
    eq: isIdentical
  }), extend(Array, {
    eq: function eq(self, other) {
      return self.constructor === self.constructor && self.length === self.length && sameContent(self, other);
    }
  }));

  var eq$3 = Eq.eq;

  var Get = protocol({
    get: function get(self, key) {
      return self instanceof HTMLElement ? getAttr(self, key) : self[key];
    }
  });

  function fail$1() {
    throw "fail";
  }

  var Assoc = chain(protocol({
    assoc: function assoc(self, key, value) {
      return self instanceof HTMLElement ? dom.setAttr(self, key, value) : fail$1();
    },
    hasKey: null
  }), extend(String, {
    assoc: assoc$2,
    hasKey: hasKey$2
  }), extend(Array, {
    assoc: assoc$1,
    hasKey: hasKey$1
  }), extend(Object, {
    assoc: assoc,
    hasKey: hasKey
  }));

  var each$7 = subj(Seq.each, 2);
  var reduce$7 = subj(Seq.reduce, 3);
  var get = subj(Get.get, 2);
  var assoc$3 = subj(Assoc.assoc, 3);
  var hasKey$3 = subj(Assoc.hasKey, 2);
  var eq$2 = subj(Eq.eq, 2);
  var append$8 = subj(Extend.append, 2);
  var prepend$7 = subj(Extend.prepend, 2);
  var map$2 = multiarity(map$1, map);
  var filter$2 = multiarity(filter$1, filter);
  var remove$4 = multiarity(remove$3, remove$2);
  var take$2 = multiarity(take$1, take);
  var takeWhile$2 = multiarity(takeWhile$1, takeWhile);
  var takeNth$2 = multiarity(takeNth$1, takeNth);
  var drop$2 = multiarity(drop$1, drop);
  var dropWhile$2 = multiarity(dropWhile$1, dropWhile);

  var div = tag('div');
  var span = tag('span');
  //chain(body, doto(dom.setAttr(['id', 'main']), dom.setAttr(['id', 'main']), dom.addClass('post'), dom.addClass('entry'), dom.removeClass('entry')));
  //chain(body, dom.getAttr('id'), eq('main'), log);
  //chain(body, dom.closest("html"), log);
  //dom.show(body);
  //chain(body, dom.find("span"), dom.text, log);
  QUnit.test("Traverse and manipulate the dom", function (assert) {
    var body = find$1("body", document);
    assert.ok(body instanceof HTMLBodyElement, "Found by tag");
    append$8(div({ id: 'branding' }, span("Greetings!")), body);
    assert.ok(find$1("#branding", body) instanceof HTMLDivElement, "Found by id");
    assert.ok(chain(find$1("#branding span", body), text, eq$2("Greetings!")), "Read text content");
    var greeting = find$1("#branding span", document);
    hide(greeting);
    var hidden = getAttr$1("style", greeting);
    assert.ok(hidden == "display: none;", "Hidden");
    show(greeting);
    var shown = getAttr$1("style", greeting);
    assert.ok(shown == "display: inherit;", "Shown");
    var branding = find$1("#branding", body);
    remove$1(branding);
    assert.ok(branding.parentElement == null, "Removed");
  });

  QUnit.test("Append/Prepend", function (assert) {
    assert.equal(chain(["Moe"], append$8("Howard"), join$1(" ")), "Moe Howard", "String append");
    var moe = append$8({ fname: "Moe" }, { lname: "Howard" }),
        ks = Object.keys(moe);
    assert.ok(ks.length === 2 && ks.indexOf("fname") > -1 && ks.indexOf("lname") > -1, "Object append");
    assert.deepEqual(append$8(3, [1, 2]), [1, 2, 3]);
    assert.deepEqual(prepend$7(0, [1, 2]), [0, 1, 2]);
  });

  QUnit.test("Assoc", function (assert) {
    assert.deepEqual(chain({ lname: "Howard" }, assoc$3("fname", "Moe")), { fname: "Moe", lname: "Howard" });
    assert.deepEqual(chain([1, 2, 3], assoc$3(1, 0)), [1, 0, 3]);
  });

  QUnit.test("Get", function (assert) {
    assert.equal(chain({ fname: "Moe", lname: "Howard" }, get("fname")), "Moe");
    assert.equal(chain(["ace", "king", "queen"], get(2)), "queen");
  });

  QUnit.test("Equality", function (assert) {
    assert.ok(eq$2("Curly", "Curly"), "Equal strings");
    assert.notOk(eq$2("Curly", "Curlers"), "Unequal strings");
    assert.ok(eq$2(45, 45), "Equal numbers");
    assert.ok(eq$2([1, 2, 3], [1, 2, 3]), "Equal arrays");
    assert.notOk(eq$2([1, 2, 3], [2, 3]), "Unequal arrays");
    assert.notOk(eq$2([1, 2, 3], [3, 2, 1]), "Unequal arrays");
    assert.ok(eq$2({ fname: "Moe", lname: "Howard" }, { fname: "Moe", lname: "Howard" }), "Equal objects");
    assert.notOk(eq$2({ fname: "Moe", middle: "Harry", lname: "Howard" }, { fname: "Moe", lname: "Howard" }), "Unequal objects");
  });

  QUnit.test("Into", function (assert) {
    assert.deepEqual(into([], "Polo"), ["P", "o", "l", "o"]);
    assert.equal(into("Marco ", "Polo"), "Marco Polo");
  });

  QUnit.test("Transducers", function (assert) {
    assert.deepEqual(into([], repeat(5, "X")), ["X", "X", "X", "X", "X"]);
    assert.equal(some(gt(5), range(10)), 6);
    assert.notOk(isEvery(gt(5), range(10)));
    assert.deepEqual(transduce(takeNth$2(2), Extend.append, [], range(10)), [0, 2, 4, 6, 8]);
    assert.deepEqual(into([], repeatedly(0, constantly(1))), []);
    assert.deepEqual(into([], repeatedly(10, constantly(2))), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
    assert.deepEqual(into([], take$2(5, range(10))), [0, 1, 2, 3, 4]);
    assert.deepEqual(into([], filter$2(gt(5), range(10))), [6, 7, 8, 9]);
    assert.deepEqual(into([], remove$4(gt(5), range(10))), [0, 1, 2, 3, 4, 5]);
    assert.deepEqual(into([], takeWhile$2(lt(5), range(10))), [0, 1, 2, 3, 4]);
    assert.deepEqual(into([], dropWhile$2(gt(5), range(10))), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert.deepEqual(transduce(take$2(5), Extend.append, [], increasingly(0)), [0, 1, 2, 3, 4]);
    assert.deepEqual(into([], map$2(inc, range(1, 5))), [2, 3, 4, 5]);
    assert.deepEqual(transduce(map$2(inc), Extend.append, [], [10, 11, 12]), [11, 12, 13]);
    assert.deepEqual(transduce(filter$2(gt(6)), Extend.append, "", [5, 6, 7, 8, 9]), "789");
    assert.deepEqual(transduce(compose(filter$2(gt(6)), map$2(inc), take$2(2)), Extend.append, [], [5, 6, 7, 8, 9]), [8, 9]);
    assert.deepEqual(transduce(take$2(10), Extend.append, [], range(7, 15)), [7, 8, 9, 10, 11, 12, 13, 14]);
    assert.deepEqual(into([], range(5)), [0, 1, 2, 3, 4]);
  });

  exports.dom = dom$1;
  exports.get = get;
  exports.chain = chain;

}((this.App = this.App || {})));