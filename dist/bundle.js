(function () {
  'use strict';

  var unbind = Function.call.bind(Function.bind, Function.call);

  function isIdentical(a, b) {
    return a === b;
  }
  function identity(value) {
    return value;
  }
  function constructs(value) {
    return value.constructor;
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

  //import {cons, EMPTY} from "./cons.js";

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

  function each(self, f) {
    var len = self.length,
        i = 0,
        result = null;
    while (i < len && !(result instanceof Reduced)) {
      result = f(self[i++]);
    }
  }
  function reduce(self, f, init) {
    var len = self.length,
        i = 0,
        memo = init;
    while (i < len && !(memo instanceof Reduced)) {
      memo = f(memo, self[i++]);
    }
    return memo instanceof Reduced ? memo.valueOf() : memo;
  }

  function empty() {
    return [];
  }

  function isEmpty(self) {
    return self.length === 0;
  }

  function append$1(self, item) {
    return self.concat([item]);
  }

  function prepend$1(self, item) {
    return [item].concat(self);
  }

  function first(self, len) {
    return len ? slice$1(self, 0, len) : self[0];
  }

  function last(self, len) {
    return len ? slice$1(self, self.length - len) : self[self.length - 1];
  }

  function initial(self, offset) {
    return slice$1(self, 0, self.length - (offset || 1));
  }

  function rest(self, idx) {
    return slice$1(self, idx || 1);
  }

  function assoc(arr, idx, value) {
    var result = slice$1(arr);
    result.splice(idx, 1, value);
    return result;
  }

  function hasKey(arr, idx) {
    return idx > -1 && idx < arr.length;
  }

  var assign = Object.assign;

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
    return arities(reduce(arguments, function (memo, f) {
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
      var args = concat(slice$1(arguments, at, len), concat(first(arguments, at), rest(arguments, len)));
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
      return reduce(fs, function (value, self) {
        return self(value);
      }, value);
    };
  }

  function chain(target) {
    return pipe.apply(this, rest(arguments))(target);
  }

  function compose() {
    return pipe.apply(this, reverse(slice$1(arguments)));
  }

  function tap() {
    var f = pipe.apply(this, arguments);
    return function (value) {
      f(value);
      return value;
    };
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

  var assign$1 = Object.assign; //TODO polyfill
  var keys = Object.keys;

  function empty$1() {
    return {};
  }

  function isEmpty$1(self) {
    return keys(self).length === 0;
  }

  function is(value, constructor) {
    return value != null && value.constructor === constructor;
  }

  function append$3(self, obj) {
    return assign$1({}, self, obj);
  }

  function prepend$3(self, obj) {
    return assign$1({}, obj, self);
  }

  function each$1(self, f) {
    var ks = keys(self),
        l = ks.length,
        i = 0,
        result = null;
    while (i < l && !(result instanceof Reduced)) {
      var key = ks[i++];
      result = f([key, self[key]]);
    }
  }

  function reduce$1(self, f, init) {
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

  function assoc$1(obj, key, value) {
    var add = {};
    add[key] = value;
    return assign$1({}, obj, add);
  }

  function hasKey$1(obj, key) {
    return obj.hasOwnProperty(key);
  }

  function first$1(obj) {
    var ks = keys(obj),
        key = ks[0];
    return ks.length ? [key, obj[key]] : null;
  }

  function rest$1(obj) {
    return reduce(keys(obj).slice(1), function (memo, key) {
      memo[key] = obj[key];
      return memo;
    }, {});
  }

  function empty$2() {
    return {};
  }

  function isEmpty$2(index) {
    return !index.length;
  }

  function each$2(self, f) {
    var ks = keys(self),
        l = ks.length,
        i = 0,
        result = null;
    while (i < l && !(result instanceof Reduced)) {
      var key = ks[i++];
      result = f(self[key]);
    }
  }

  function reduce$2(self, f, init) {
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

  function append$2(el, child) {
    el.appendChild(is(child, String) ? document.createTextNode(child) : child);
    return el;
  }

  function prepend$2(el, child) {
    el.insertBefore(is(child, String) ? document.createTextNode(child) : child, el.firstChild);
    return el;
  }

  function getAttr$1(el, key) {
    var attr = el.attributes.getNamedItem(key);
    return attr && attr.value;
  }

  function setAttr$1(el, pair) {
    var key = pair[0],
        value = pair[1],
        attr = document.createAttribute(key);
    attr.value = value;
    el.attributes.setNamedItem(attr);
    return el;
  }

  function hasClass$1(el, str) {
    return el.classList.contains(str);
  }

  function addClass$1(el, str) {
    el.classList.add(str);
    return el;
  }

  function removeClass$1(el, str) {
    el.classList.remove(str);
    return el;
  }

  function query$1(el, selector) {
    return el.querySelectorAll(selector);
  }

  function find$1(el, selector) {
    return el.querySelector(selector);
  }

  function style$1(el, pair) {
    var key = pair[0],
        value = pair[1];
    el.style[key] = value;
    return el;
  }

  function text(el) {
    return el.textContent;
  }

  function remove$1(el) {
    el.parentElement.removeChild(el);
    return el;
  }

  //TODO use lazy list of parents -- also create lazy seq of nextSibling and previousSibling
  function closest$1(el, selector) {
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
      each(arguments, function (item) {
        is(item, Object) ? each$1(item, function (pair) {
          setAttr$1(el, pair);
        }) : append$2(el, item);
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

  var append = subj(append$2);
  var prepend = subj(prepend$2);
  var getAttr = subj(getAttr$1);
  var setAttr = subj(setAttr$1);
  var hasClass = subj(hasClass$1);
  var addClass = subj(addClass$1);
  var removeClass = subj(removeClass$1);
  var closest = subj(closest$1);
  var query = subj(query$1);
  var find = subj(find$1);
  var style = subj(style$1);
  var remove = remove$1;
  var show = style(["display", "inherit"]);
  var hide = style(["display", "none"]);

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

  var toUpperCase = unbind(String.prototype.toUpperCase);
  var toLowerCase = unbind(String.prototype.toLowerCase);

  function empty$4() {
    return "";
  }

  function isEmpty$4(str) {
    return str === "";
  }

  function append$5(str, suffix) {
    return str + suffix;
  }

  function prepend$5(str, prefix) {
    return prefix + str;
  }

  function each$4(str, f) {
    var len = str.length,
        i = 0,
        result = null;
    while (i < len && !(result instanceof Reduced)) {
      result = f(str[i++]);
    }
    return str;
  }

  function reduce$4(str, f, init) {
    var len = str.length,
        i = 0,
        memo = init;
    while (i < len && !(memo instanceof Reduced)) {
      memo = f(memo, str[i++]);
    }
    return memo instanceof Reduced ? memo.valueOf() : memo;
  }

  function assoc$3(str, idx, ch) {
    return slice(str).splice(idx, 1, ch).join("");
  }

  function hasKey$3(str, idx) {
    return idx > -1 && idx < str.length;
  }

  function Cons(head, tail) {
    this.head = head;
    this.tail = tail;
  }

  function cons$1(head, tail) {
    return new Cons(head, tail || constantly(EMPTY$1));
  }

  var EMPTY$1 = cons$1(null);
  var empty$5 = constantly(EMPTY$1);

  function isEmpty$5(self) {
    return self === EMPTY$1;
  }

  function each$5(self, f) {
    var result = null,
        next = self;
    while (next !== EMPTY$1 && !(result instanceof Reduced)) {
      result = f(next.head);
      next = next.tail();
    }
  }

  function reduce$5(self, f, init) {
    var memo = init,
        next = self;
    while (next !== EMPTY$1 && !(memo instanceof Reduced)) {
      memo = f(memo, next.head);
      next = next.tail();
    }
    return memo instanceof Reduced ? memo.valueOf() : memo;
  }

  function iterate(generate, seed) {
    return cons$1(seed, function () {
      return iterate(generate, generate(seed));
    });
  }

  var repeatedly = multiarity(function (f) {
    return iterate(f, f());
  }, function (n, f) {
    return n > 0 ? cons$1(f(), function () {
      return repeatedly(n - 1, f);
    }) : EMPTY$1;
  });

  var repeat = overload(null, function (value) {
    return repeatedly(constantly(value));
  }, function (n, value) {
    return repeatedly(n, constantly(value));
  });

  function first$3(self) {
    return self === EMPTY$1 ? null : self.head;
  }

  function rest$3(self) {
    return self === EMPTY$1 ? EMPTY$1 : self.tail();
  }

  var Empty = chain(protocol({
    empty: empty$2,
    isEmpty: isEmpty$2
  }), extend(Cons, {
    empty: empty$5,
    isEmpty: isEmpty$5
  }), extend(String, {
    empty: empty$4,
    isEmpty: isEmpty$4
  }), extend(Array, {
    empty: empty,
    isEmpty: isEmpty
  }), extend(Object, {
    empty: empty$1,
    isEmpty: isEmpty$1
  }));

  var isEmpty$3 = Empty.isEmpty;

  var Seq = chain(protocol({
    first: first, //TODO fix first & rest
    rest: rest
  }), extend(String, {
    first: first,
    rest: rest
  }), extend(Cons, {
    first: first$3,
    rest: rest$3
  }), extend(Array, {
    first: first,
    rest: rest
  }), extend(Object, {
    first: first$1,
    rest: rest$1
  }));

  var rest$4 = Seq.rest;
  var first$4 = Seq.first;

  function sameContent(self, other) {
    if (self == null || other == null) return self == other;
    return isEmpty$3(self) && isEmpty$3(other) || eq$1(first$4(self), first$4(other)) && sameContent(rest$4(self), rest$4(other));
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

  var eq$1 = Eq.eq;

  var Each = chain(protocol({
    each: each$2
  }), extend(Cons, {
    each: each$5
  }), extend(String, {
    each: each$4
  }), extend(Array, {
    each: each
  }), extend(Object, {
    each: each$1
  }));

  var Reduce = chain(protocol({
    reduce: reduce$2
  }), extend(Cons, {
    reduce: reduce$5
  }), extend(String, {
    reduce: reduce$4
  }), extend(Array, {
    reduce: reduce
  }), extend(Object, {
    reduce: reduce$1
  }));

  var reduce$6 = Reduce.reduce;

  function fail(target) {
    throw new Error("Cannot resolve protocol for target: " + target);
  }

  function whenElement(f) {
    return function (target) {
      return target instanceof HTMLElement ? f : fail;
    };
  }

  var Extend = chain(protocol({ //TODO protocol should provide secondary means of dynamically extending -- use multimethod as defaultFn
    append: multimethod(whenElement(append$2)), //TODO provide a dynamic means of setting defaultFn of protocol.
    prepend: multimethod(whenElement(prepend$2)) //TODO alternately, provide a way of wrapping an existing function with an alternative handler -- this mechanism doesn't make a multimethod easy to extend (or unextend) and it should be
  }), extend(String, {
    append: append$5,
    prepend: prepend$5
  }), extend(Array, {
    append: append$1,
    prepend: prepend$1
  }), extend(Object, {
    append: append$3,
    prepend: prepend$3
  }));

  var append$6 = Extend.append;

  var Get = protocol({
    get: function get(self, key) {
      return self instanceof HTMLElement ? getAttr$1(self, key) : self[key];
    }
  });

  function fail$1() {
    throw "fail";
  }

  var Assoc = chain(protocol({
    assoc: function assoc(self, key, value) {
      return self instanceof HTMLElement ? setAttr$1(self, [key, value]) : fail$1();
    },
    hasKey: null
  }), extend(String, {
    assoc: assoc$3,
    hasKey: hasKey$3
  }), extend(Array, {
    assoc: assoc,
    hasKey: hasKey
  }), extend(Object, {
    assoc: assoc$1,
    hasKey: hasKey$1
  }));

  function seq$2(coll) {
    return isEmpty$5(coll) ? EMPTY$1 : cons$1(first$4(coll), function () {
      return seq$2(rest$4(coll));
    });
  }

  function map$1(f, coll) {
    return isEmpty$5(coll) ? EMPTY$1 : cons$1(f(first$4(coll)), function () {
      return map$1(f, rest$4(coll));
    });
  }

  function filter$1(pred, coll) {
    if (isEmpty$5(coll)) return EMPTY$1;
    var item;
    do {
      item = first$4(coll), coll = rest$4(coll);
    } while (!pred(item));
    return item != null ? cons$1(item, function () {
      return filter$1(pred, coll);
    }) : EMPTY$1;
  }

  function remove$3(pred, coll) {
    return filter$1(complement(pred), coll);
  }

  function take$1(n, coll) {
    return n && !isEmpty$5(coll) ? cons$1(first$4(coll), function () {
      return take$1(n - 1, rest$4(coll));
    }) : EMPTY$1;
  }

  function takeWhile$1(pred, coll) {
    if (isEmpty$5(coll)) return EMPTY$1;
    var item = first$4(coll),
        coll = rest$4(coll);
    return pred(item) ? cons$1(item, function () {
      return takeWhile$1(pred, coll);
    }) : EMPTY$1;
  }

  function takeNth$1(n, coll) {
    if (isEmpty$5(coll)) return EMPTY$1;
    var s = seq$2(coll);
    return cons$1(first$4(s), function () {
      return takeNth$1(n, drop$1(n, s));
    });
  }

  function drop$1(n, coll) {
    var remaining = n;
    return dropWhile$1(function () {
      return remaining-- > 0;
    }, coll);
  }

  function dropWhile$1(pred, coll) {
    if (isEmpty$5(coll)) return EMPTY$1;
    do {
      var item = first$4(coll);
      if (!pred(item)) break;
      coll = rest$4(coll);
    } while (true);
    return seq$2(coll);
  }

  function some(pred, coll) {
    return reduce$6(coll, function (memo, value) {
      return pred(value) ? reduced(value) : memo;
    }, null);
  }

  function isEvery(pred, coll) {
    return reduce$6(coll, function (memo, value) {
      return !pred(value) ? reduced(false) : memo;
    }, true);
  }

  function seeding(f, init) {
    return overload(init, identity, f);
  }

  var transduce = multiarity(function (xform, f, coll) {
    var xf = xform(f);
    return xf(reduce$6(coll, xf, f()));
  }, function (xform, f, seed, coll) {
    return transduce(xform, seeding(f, constantly(seed)), coll);
  });

  var into = multiarity(function (to, from) {
    return reduce$6(from, append$6, to);
  }, function (to, xform, from) {
    return transduce(xform, append$6, to, from);
  });

  function map$2(f) {
    return function (xf) {
      return overload(xf, xf, function (memo, value) {
        return xf(memo, f(value));
      });
    };
  }

  function filter$2(pred) {
    return function (xf) {
      return overload(xf, xf, function (memo, value) {
        return pred(value) ? xf(memo, value) : memo;
      });
    };
  }

  var remove$4 = compose(filter$2, complement);

  function take$2(n) {
    return function (xf) {
      var taking = n;
      return overload(xf, xf, function (memo, value) {
        return taking-- > 0 ? xf(memo, value) : reduced(memo);
      });
    };
  }

  function takeWhile$2(pred) {
    return function (xf) {
      return overload(xf, xf, function (memo, value) {
        return pred(value) ? xf(memo, value) : reduced(memo);
      });
    };
  }

  function takeNth$2(n) {
    return function (xf) {
      var x = -1;
      return overload(xf, xf, function (memo, value) {
        x++;
        return x === 0 || x % n === 0 ? xf(memo, value) : memo;
      });
    };
  }

  function drop$2(n) {
    return function (xf) {
      var dropping = n;
      return overload(xf, xf, function (memo, value) {
        return dropping-- > 0 ? memo : xf(memo, value);
      });
    };
  }

  function dropWhile$2(pred) {
    return function (xf) {
      var dropping = true;
      return overload(xf, xf, function (memo, value) {
        !dropping || (dropping = pred(value));
        return dropping ? memo : xf(memo, value);
      });
    };
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
    return next >= end ? cons$1(start) : cons$1(start, function () {
      return range(next, end, step);
    });
  });

  var log = console.log.bind(console);

  function eq$3(a, b) {
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

  var eq$2 = subj(eq$3);
  var gt = subj(gt$1);
  var gte = subj(gte$1);
  var lte = subj(lte$1);
  var lt = subj(lt$1);

  var slice$2 = subj(slice$1, 3);
  var join$1 = subj(join, 2);
  var last$1 = subj(last);
  var initial$1 = subj(initial);

  var first$2 = subj(Seq.first); //TODO consider affect of optional params: i.e. chain(["larry", "moe"], first()) vs chain(["larry", "moe"], first);
  var rest$2 = subj(Seq.rest);
  var each$3 = subj(Each.each, 2);
  var reduce$3 = subj(Reduce.reduce, 3);
  var get = subj(Get.get, 2);
  var assoc$2 = subj(Assoc.assoc, 3);
  var hasKey$2 = subj(Assoc.hasKey, 2);
  var eq = subj(Eq.eq, 2);
  var append$4 = subj(Extend.append, 2);
  var prepend$4 = subj(Extend.prepend, 2);
  var map = multiarity(map$2, map$1);
  var filter = multiarity(filter$2, filter$1);
  var remove$2 = multiarity(remove$4, remove$3);
  var take = multiarity(take$2, take$1);
  var takeWhile = multiarity(takeWhile$2, takeWhile$1);
  var takeNth = multiarity(takeNth$2, takeNth$1);
  var drop = multiarity(drop$2, drop$1);
  var dropWhile = multiarity(dropWhile$2, dropWhile$1);

  QUnit.test("Traverse and manipulate the dom", function (assert) {
    var ul = tag('ul'),
        li = tag('li');
    var stooges = ul(li({ id: 'moe' }, "Moe Howard"), li({ id: 'curly' }, "Curly Howard"), li({ id: 'larry' }, "Larry Fine"));
    var div = tag('div'),
        span = tag('span');
    var body = find("body", document);
    chain(stooges, tap(query("li"), each$3(addClass("stooge"))), log);
    assert.equal(chain(body, addClass("main"), assoc$2("data-tagged", "tests"), get("data-tagged")), "tests");
    assert.ok(body instanceof HTMLBodyElement, "Found by tag");
    append$4(div({ id: 'branding' }, span("Greetings!")), body);
    assert.ok(find("#branding", body) instanceof HTMLDivElement, "Found by id");
    assert.ok(chain(find("#branding span", body), text, eq("Greetings!")), "Read text content");
    var greeting = find("#branding span", document);
    hide(greeting);
    var hidden = getAttr("style", greeting);
    assert.ok(hidden == "display: none;", "Hidden");
    show(greeting);
    var shown = getAttr("style", greeting);
    assert.ok(shown == "display: inherit;", "Shown");
    var branding = find("#branding", body);
    remove(branding);
    assert.ok(branding.parentElement == null, "Removed");
  });

  QUnit.test("Append/Prepend", function (assert) {
    assert.equal(chain(["Moe"], append$4("Howard"), join$1(" ")), "Moe Howard", "String append");
    var moe = append$4({ fname: "Moe" }, { lname: "Howard" }),
        ks = Object.keys(moe);
    assert.ok(ks.length === 2 && ks.indexOf("fname") > -1 && ks.indexOf("lname") > -1, "Object append");
    assert.deepEqual(append$4(3, [1, 2]), [1, 2, 3]);
    assert.deepEqual(prepend$4(0, [1, 2]), [0, 1, 2]);
  });

  QUnit.test("Assoc", function (assert) {
    assert.deepEqual(chain({ lname: "Howard" }, assoc$2("fname", "Moe")), { fname: "Moe", lname: "Howard" });
    assert.deepEqual(chain([1, 2, 3], assoc$2(1, 0)), [1, 0, 3]);
  });

  QUnit.test("Get", function (assert) {
    assert.equal(chain({ fname: "Moe", lname: "Howard" }, get("fname")), "Moe");
    assert.equal(chain(["ace", "king", "queen"], get(2)), "queen");
  });

  QUnit.test("Equality", function (assert) {
    assert.ok(eq("Curly", "Curly"), "Equal strings");
    assert.notOk(eq("Curly", "Curlers"), "Unequal strings");
    assert.ok(eq(45, 45), "Equal numbers");
    assert.ok(eq([1, 2, 3], [1, 2, 3]), "Equal arrays");
    assert.notOk(eq([1, 2, 3], [2, 3]), "Unequal arrays");
    assert.notOk(eq([1, 2, 3], [3, 2, 1]), "Unequal arrays");
    assert.ok(eq({ fname: "Moe", lname: "Howard" }, { fname: "Moe", lname: "Howard" }), "Equal objects");
    assert.notOk(eq({ fname: "Moe", middle: "Harry", lname: "Howard" }, { fname: "Moe", lname: "Howard" }), "Unequal objects");
  });

  QUnit.test("Into", function (assert) {
    assert.equal(into("Marco ", "Polo"), "Marco Polo");
    assert.deepEqual(into([], "Polo"), ["P", "o", "l", "o"]);
    assert.deepEqual(into([], takeNth(2), range(10)), [0, 2, 4, 6, 8]);
    assert.deepEqual(into([], repeatedly(0, constantly(1))), []);
    assert.deepEqual(into([], repeatedly(10, constantly(2))), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
    assert.deepEqual(into([], take(5, range(10))), [0, 1, 2, 3, 4]);
    assert.deepEqual(into([], filter(gt(5), range(10))), [6, 7, 8, 9]);
    assert.deepEqual(into([], remove$2(gt(5), range(10))), [0, 1, 2, 3, 4, 5]);
    assert.deepEqual(into([], takeWhile(lt(5), range(10))), [0, 1, 2, 3, 4]);
    assert.deepEqual(into([], dropWhile(gt(5), range(10))), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert.deepEqual(into([], take(5), increasingly(0)), [0, 1, 2, 3, 4]);
    assert.deepEqual(into([], map(inc, range(1, 5))), [2, 3, 4, 5]);
    assert.deepEqual(into([], map(inc), [10, 11, 12]), [11, 12, 13]);
    assert.deepEqual(into([], compose(filter(gt(6)), map(inc), take(2)), [5, 6, 7, 8, 9]), [8, 9]);
    assert.deepEqual(into([], take(10), range(7, 15)), [7, 8, 9, 10, 11, 12, 13, 14]);
    assert.deepEqual(into([], range(5)), [0, 1, 2, 3, 4]);
    assert.deepEqual(into("", filter(gt(6)), [5, 6, 7, 8, 9]), "789");
    assert.deepEqual(into([], repeat(5, "X")), ["X", "X", "X", "X", "X"]);
  });

  QUnit.test("Sequences", function (assert) {
    assert.equal(some(gt(5), range(10)), 6);
    assert.notOk(isEvery(gt(5), range(10)));
  });

}());