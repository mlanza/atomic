(function () {
  'use strict';

  var unbind = Function.call.bind(Function.bind, Function.call);

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

  var assign$1 = Object.assign; //TODO polyfill
  var keys = Object.keys;

  function identity(value) {
    return value;
  }

  function is(value, constructor) {
    return value != null && value.constructor === constructor;
  }

  function append$1(self, obj) {
    return assign$1({}, self, obj);
  }

  function prepend(self, obj) {
    return assign$1({}, obj, self);
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

  var slice = unbind(Array.prototype.slice);
  var splice = unbind(Array.prototype.splice);
  var reverse = unbind(Array.prototype.reverse);
  var join = unbind(Array.prototype.join);
  var concat = unbind(Array.prototype.concat);

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

  function first(self, len) {
    return len ? slice(self, 0, len) : self[0];
  }

  function last(self, len) {
    return len ? slice(self, self.length - len) : self[self.length - 1];
  }

  function initial(self, offset) {
    return slice(self, 0, self.length - (offset || 1));
  }

  function rest(self, idx) {
    return slice(self, idx || 1);
  }

  function noop() {}

  function curry(self, len, applied) {
    if (arguments.length === 1) len = self.length;
    return function () {
      //a call without args applies a single undefined arg potentially allowing the curried function to substitute a default value.
      var args = (applied || []).concat(arguments.length === 0 ? [undefined] : slice(arguments));
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
    return assign$1(function () {
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
      var tail = first(arguments, at),
          head = rest(arguments, at),
          args = concat(head, tail);
      return self.apply(this, args);
    };
  }

  function subj(self, len) {
    var length = len || self.length;
    return length > 1 ? curry(flip(self, length), length) : self;
  }

  function pipe() {
    var fs = slice(arguments); //TODO could slice be part of the Seq protocol?
    return function (value) {
      return reduce$1(fs, function (value, self) {
        return self(value);
      }, value);
    };
  }

  function chain(target) {
    return pipe.apply(this, rest(arguments))(target);
  }

  function compose() {
    return pipe.apply(this, reverse(slice(arguments)));
  }

  function invokeWith() {
    var args = arguments;
    return function (self) {
      return self.apply(this, args);
    };
  }

  function doto() {
    var fs = arguments;
    return fs.length === 0 ? noop : fs.length === 1 ? fs[0] : function () {
      each$1(fs, invokeWith.apply(this, arguments).bind(this));
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
      return dispatcher.get(constructs(value)) || defaultFn;
    };
    return assign$1(multimethod(dispatch), { dispatcher: dispatcher, dispatch: dispatch });
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

  function partial(f) {
    var applied = rest(arguments);
    return function () {
      return f.apply(this, concat(applied, slice(arguments)));
    };
  }

  //TODO implement Extend protocol?

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

  var slice$1 = subj(slice, 3);
  var join$1 = subj(join, 2);
  var append$3 = subj(append$2);
  var prepend$2 = subj(prepend$1);
  var each$2 = subj(each$1);
  var reduce$2 = subj(reduce$1);
  var first$1 = subj(first); //TODO consider affect of optional params: i.e. chain(["larry", "moe"], first()) vs chain(["larry", "moe"], first);
  var last$1 = subj(last);
  var initial$1 = subj(initial);
  var rest$1 = subj(rest);

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

  function find(el, selector) {
    return el.querySelectorAll(selector);
  }

  function first$2(el, selector) {
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

  var append$4 = subj(Extend.append, 2);
  var prepend$3 = subj(Extend.prepend, 2);

  function Cons(head, tail) {
    this.head = head;
    this.tail = tail;
  }

  function cons(head, tail) {
    return new Cons(head, tail || constantly(EMPTY));
  }

  var EMPTY = cons(null);
  function isEmpty$3(self) {
    return self === EMPTY;
  }

  function each$6(self, f) {
    var result = null,
        next = self;
    while (next !== EMPTY && !(result instanceof Reduced)) {
      result = f(next.head);
      next = next.tail();
    }
  }

  function reduce$6(self, f, init) {
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

  function rest$2(self) {
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

  function remove(pred, coll) {
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

  var Seq = chain(protocol({
    each: each$4,
    reduce: reduce$4,
    first: null,
    rest: null
  }), extend(String, {
    each: each$3,
    reduce: reduce$3,
    first: first,
    rest: rest
  }), extend(Cons, {
    each: each$6,
    reduce: reduce$6,
    first: first$3,
    rest: rest$2
  }), extend(Array, {
    each: each$1,
    reduce: reduce$1,
    first: first,
    rest: rest
  }), extend(Object, {
    each: each,
    reduce: reduce,
    first: null,
    rest: null
  }));

  var each$5 = subj(Seq.each, 2); //TODO don't export as curried at this time -- do above as other top-level modules do.
  var reduce$5 = subj(Seq.reduce, 3);

  var log = console.log.bind(console);

  var append$7 = subj(append$6);
  var prepend$6 = subj(prepend$5);
  var getAttr$1 = subj(getAttr);
  var setAttr$1 = subj(setAttr);
  var hasClass$1 = subj(hasClass);
  var addClass$1 = subj(addClass);
  var removeClass$1 = subj(removeClass);
  var closest$1 = subj(closest);
  var find$1 = subj(find);
  var first$4 = subj(first$2);
  var style$1 = subj(style);
  var show = style$1(["display", "inherit"]);
  var hide = style$1(["display", "none"]);

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

  var remove$1 = compose(filter$1, complement);

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

  var map$2 = multiarity(map$1, map);
  var filter$2 = multiarity(filter$1, filter);
  var remove$2 = multiarity(remove$1, remove);
  var take$2 = multiarity(take$1, take);
  var takeWhile$2 = multiarity(takeWhile$1, takeWhile);
  var takeNth$2 = multiarity(takeNth$1, takeNth);
  var drop$2 = multiarity(drop$1, drop);
  var dropWhile$2 = multiarity(dropWhile$1, dropWhile);
  var property = curry(function (key, obj) {
    return obj[key];
  });

  var attr = curry(function (key, el) {
    return el.attributes.getNamedItem(key);
  });

  var assign = curry(function assign(key, value, obj) {
    obj[key] = value;
    return obj;
  });

  var value = assign("value");

  window.onload = function () {
    var div = tag('div'),
        span = tag('span'),
        body = first$4("body", document);
    append$4(div({ id: 'branding' }, span("Greetings!")), body);
    chain(document, first$4("#branding"), attr("id"), value("brand"), partial(log, "attributes"));
    hide(body);
    each$5(log, ["ace", "king", "queen"]);
    chain(body, doto(setAttr$1(['id', 'main']), setAttr$1(['id', 'main']), addClass$1('post'), addClass$1('entry'), removeClass$1('entry')));
    chain(body, getAttr$1('id'), eq('main'), log);
    chain(body, closest$1("html"), log);
    chain(["Moe"], append$4("Howard"), join$1(" "), log);
    chain(["Curly"], append$4("Howard"), join$1(" "), log);
    log(append$4({ fname: "Moe" }, { lname: "Howard" }));
    log(append$4(3, [1, 2]));
    log(prepend$3(0, [1, 2]));
    chain(into([], "Polo"), log);
    chain(into("Marco ", "Polo"), log);
    chain(into([], repeat(5, "X")), log);
    chain(some(gt(5), range(10)), log);
    chain(isEvery(gt(5), range(10)), log);
    chain(transduce(takeNth$2(2), Extend.append, [], range(10)), partial(log, "take-nth"));
    chain(into([], repeatedly(0, constantly(1))), log);
    chain(into([], repeatedly(10, constantly(2))), log);
    chain(into([], take$2(5, range(10))), partial(log, "take"));
    chain(into([], filter$2(gt(5), range(10))), partial(log, "filter > 5"));
    chain(into([], remove$2(gt(5), range(10))), partial(log, "remove > 5"));
    chain(into([], takeWhile$2(lt(5), range(10))), partial(log, "takeWhile < 5"));
    chain(into([], dropWhile$2(gt(5), range(10))), partial(log, "dropWhile > 5"));
    chain(transduce(take$2(5), Extend.append, [], increasingly(0)), log);
    chain(into([], map$2(inc, range(1, 5))), partial(log, "map"));
    chain(transduce(map$2(inc), Extend.append, [], [10, 11, 12]), log);
    chain(transduce(filter$2(gt(6)), Extend.append, "", [5, 6, 7, 8, 9]), log);
    chain(transduce(compose(filter$2(gt(6)), map$2(inc), take$2(2)), Extend.append, [], [5, 6, 7, 8, 9]), log);
    chain(transduce(take$2(10), Extend.append, [], range(7, 15)), log);
    chain(into([], range(5)), log);
    show(body);
    chain(body, first$4("span"), text, log);
  };

}());