(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global._ = {})));
}(this, (function (exports) { 'use strict';

  function boolean() {
    return Boolean.apply(undefined, arguments);
  }
  var bool = boolean;

  //import behave from "./boolean/behave";
  //behave(Boolean);

  function isBoolean(self) {
    return Boolean(self) === self;
  }

  function not(x) {
    return !x;
  }

  var unbind = Function.call.bind(Function.bind, Function.call);
  var log = console.log.bind(console);

  function noop() {}

  function counter(init) {
    var memo = init || 0;
    return function () {
      return memo++;
    };
  }

  function type$1(self) {
    return self == null ? null : self.constructor;
  }

  function overload() {
    var fs = arguments,
        fallback = fs[fs.length - 1];
    return function () {
      var f = fs[arguments.length] || fallback;
      return f.apply(this, arguments);
    };
  }

  function identity$1(x) {
    return x;
  }

  function constantly(x) {
    return function () {
      return x;
    };
  }

  function effect() {
    for (var _len = arguments.length, effects = Array(_len), _key = 0; _key < _len; _key++) {
      effects[_key] = arguments[_key];
    }

    return function (obj) {
      effects.forEach(function (effect) {
        effect(obj);
      }, effects);
      return obj;
    };
  }

  function doto(obj) {
    for (var _len2 = arguments.length, effects = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      effects[_key2 - 1] = arguments[_key2];
    }

    return effect.apply(undefined, effects)(obj);
  }

  function isInstance(x, constructor) {
    return x instanceof constructor;
  }

  var test = unbind(RegExp.prototype.test);

  function Nil() {}

  function nil() {
    return null;
  }

  var REGISTRY = window.Symbol ? Symbol("Registry") : "_registry";
  var TEMPLATE = window.Symbol ? Symbol("Template") : "_template";

  function ProtocolLookupError(registry, subject, named, args) {
    this.registry = registry;
    this.subject = subject;
    this.named = named;
    this.args = args;
  }

  ProtocolLookupError.prototype = new Error();
  ProtocolLookupError.prototype.toString = function () {
    return "Protocol lookup for " + this.named + " failed.";
  };

  function constructs(self) {
    return self == null ? Nil : self.constructor;
  }

  function Protocol(template) {
    this[REGISTRY] = new WeakMap();
    this[TEMPLATE] = template;
    extend(this, template);
  }

  function create(registry, template, named) {
    return function (self) {
      var f = (registry.get(self) || {})[named] || (registry.get(constructs(self)) || {})[named] || template[named];
      if (!f) {
        throw new ProtocolLookupError(registry, self, named, arguments);
      }
      return f.apply(this, arguments);
    };
  }

  function extend(self, template) {
    for (var key in template) {
      self[key] = create(self[REGISTRY], self[TEMPLATE], key).bind(self);
    }
  }

  function mark(protocol) {
    return function (type) {
      implement3(protocol, type, {}); //marker interface
    };
  }

  function implement2(protocol, behavior) {
    return function (type) {
      implement3(protocol, type, behavior);
    };
  }

  function implement3(protocol, type, behavior) {
    protocol[REGISTRY].set(type, behavior);
  }

  function cease(protocol, type) {
    protocol[REGISTRY].delete(type);
  }

  var implement = overload(null, mark, implement2, implement3);

  function protocol(template) {
    return new Protocol(template);
  }

  function satisfies1(protocol) {
    return function (obj) {
      return satisfies2(protocol, obj);
    };
  }

  function satisfies2(protocol, obj) {
    var reg = protocol[REGISTRY];
    return reg.has(constructs(obj)) || reg.has(obj);
  }

  var satisfies = overload(null, satisfies1, satisfies2);

  var IArr = protocol({
    toArray: null
  });
  var toArray$1 = IArr.toArray;
  var isArr = satisfies(IArr);

  var IObj = protocol({
    toObject: null
  });
  var toObject = IObj.toObject;
  var isObj = satisfies(IObj);

  var IAppendable = protocol({
    append: null
  });
  var append = IAppendable.append;
  var isAppendable = satisfies(IAppendable);

  function _appendTo(child, parent) {
    parent.appendChild(child);
  }
  var IElementContent = protocol({
    appendTo: _appendTo
  });
  var appendTo = IElementContent.appendTo;
  var isElementContent = satisfies(IElementContent);

  function appendChild(parent, child) {
    appendTo(child, parent);
    return parent;
  }

  var IPrependable = protocol({
    prepend: null
  });
  var prepend = IPrependable.prepend;
  var isPrependable = satisfies(IPrependable);

  var IInclusive = protocol({
    includes: null
  });
  var includes = IInclusive.includes;
  var isInclusive = satisfies(IInclusive);

  var ISeq = protocol({
    first: null,
    rest: null
  });
  var first = ISeq.first;
  var rest = ISeq.rest;
  var isSeq = satisfies(ISeq);

  var ISeqable = protocol({
    seq: null
  });
  var seq = ISeqable.seq;
  var isSeqable = satisfies(ISeqable);

  var ICollection = protocol({
    conj: null
  });
  var conj = ICollection.conj;

  var IEmptyableCollection = protocol({
    empty: null
  });
  var empty = IEmptyableCollection.empty;
  var isEmptyableCollection = satisfies(IEmptyableCollection);

  var ILookup = protocol({
    lookup: null
  });
  var lookup = ILookup.lookup;

  var IAssociative = protocol({
    assoc: null,
    contains: null
  });
  var assoc = IAssociative.assoc;
  var contains = IAssociative.contains;
  var isAssociative = satisfies(IAssociative);

  var INext = protocol({
    next: null
  });
  var next = INext.next;

  var IIndexed = protocol({
    nth: null
  });
  var nth = IIndexed.nth;
  var isIndexed = satisfies(IIndexed);

  var IShow = protocol({
    show: null
  });
  var show = IShow.show;
  var isShow = satisfies(IShow);

  var IFn = protocol({
    invoke: null
  });
  var invoke = IFn.invoke;
  var isFn = satisfies(IFn);

  function _deref(self) {
    return self == null ? null : self.valueOf();
  }
  var IDeref = protocol({
    deref: _deref
  });
  var deref = IDeref.deref;

  var ICounted = protocol({
    count: null
  });
  var count = ICounted.count;
  var isCounted = satisfies(ICounted);

  var IReduce = protocol({
    _reduce: null
  });

  function reduce2(xf, coll) {
    return IReduce._reduce(coll, xf, xf());
  }

  function reduce3(xf, init, coll) {
    return IReduce._reduce(coll, xf, init);
  }

  var reduce = overload(null, null, reduce2, reduce3);

  var IKVReduce = protocol({
    _reducekv: null
  });
  function reducekv(xf, init, coll) {
    return IKVReduce._reducekv(coll, xf, init);
  }

  var IMap = protocol({
    _dissoc: null
  });

  var dissoc2 = IMap._dissoc;

  function dissocN(obj) {
    for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      keys[_key - 1] = arguments[_key];
    }

    return reduce(dissoc2, obj, keys);
  }

  var dissoc = overload(null, identity$1, dissoc2, dissocN);
  var isMap = satisfies(IMap);

  var ISequential = protocol({});
  var isSequential = satisfies(ISequential);

  var IComparable = protocol({
    _compare: function _compare(x, y) {
      return x > y ? 1 : x < y ? -1 : 0;
    }
  });
  var _compare = IComparable._compare;
  var isComparable = satisfies(IComparable);

  var IPublish = protocol({
    pub: null
  });
  var pub = IPublish.pub;
  var isPublish = satisfies(IPublish);

  var ISubscribe = protocol({
    sub: null
  });
  var sub = ISubscribe.sub;
  var isSubscribe = satisfies(ISubscribe);

  var IReset = protocol({
    reset: null
  });
  var reset = IReset.reset;
  var isReset = satisfies(IReset);

  var ISwap = protocol({
    _swap: null
  });

  function swap3(self, f, a) {
    return ISwap._swap(null, function (state) {
      return f(state, a);
    });
  }

  function swap4(self, f, a, b) {
    return ISwap._swap(null, function (state) {
      return f(state, a, b);
    });
  }

  function swapN(self, f, a, b, cs) {
    return ISwap._swap(null, function (state) {
      return f.apply(null, [state, a, b].concat(cs));
    });
  }

  var swap = overload(null, null, ISwap._swap, swap3, swap4, swapN);
  var isSwap = satisfies(ISwap);

  var IRecord = protocol({});
  var isRecord = satisfies(IRecord);

  var IDisposable = protocol({
    dispose: null
  });
  var dispose = IDisposable.dispose;
  var isDisposable = satisfies(IDisposable);

  var ICloneable = protocol({
    clone: null
  });
  var clone = ICloneable.clone;
  var isCloneable = satisfies(ICloneable);

  var IFind = protocol({
    find: null
  });
  var find = IFind.find;
  var isFindable = satisfies(IFind);

  var IUnit = protocol({
    unit: null
  });
  var unit = IUnit.unit;
  var isUnit = satisfies(IUnit);

  var ISteppable = protocol({
    step: null,
    converse: null
  });
  var step = ISteppable.step;
  var converse = ISteppable.converse;
  var isSteppable = satisfies(ISteppable);

  function Empty() {}
  var EMPTY = Empty.EMPTY = new Empty();
  //export const empty = constantly(EMPTY);

  function array() {
    return Array.apply(undefined, arguments);
  }
  var EMPTY_ARRAY = Object.freeze([]);

  var behave = effect(implement(IEmptyableCollection, { empty: identity$1 }), implement(IArr, { toArray: constantly(EMPTY_ARRAY) }), implement(ISeq, { first: constantly(null), rest: constantly(EMPTY) }), implement(INext, { next: constantly(null) }), implement(ISeqable, { seq: constantly(null) }), implement(IShow, { show: constantly("[]") }));

  behave(Empty);

  function assoc$1(self, key, value) {
    var obj = {};
    obj[key] = value;
    return obj;
  }

  function _reduce(self, xf, init) {
    return init;
  }

  var behave$1 = effect(implement(IEmptyableCollection, { empty: identity$1 }), implement(ILookup, { lookup: constantly(null) }), implement(IAssociative, { assoc: assoc$1, contains: constantly(false) }), implement(INext, { next: identity$1 }), implement(IArr, { toArray: constantly(EMPTY_ARRAY) }), implement(ISeq, { first: identity$1, rest: constantly(EMPTY) }), implement(ISeqable, { seq: identity$1 }), implement(IIndexed, { nth: identity$1 }), implement(ICounted, { count: constantly(0) }), implement(IReduce, { _reduce: _reduce }), implement(IShow, { show: constantly("null") }));

  behave$1(Nil);

  function isNil(x) {
    return x == null;
  }

  function isSome(x) {
    return x != null;
  }

  function Reduced$1(value) {
    this.value = value;
  }

  Reduced$1.prototype.valueOf = function () {
    return this.value;
  };

  function reduced(value) {
    return new Reduced$1(value);
  }

  function isReduced(value) {
    return value instanceof Reduced$1;
  }

  function deref$1(self) {
    return self.valueOf();
  }

  var behave$2 = effect(implement(IDeref, { deref: deref$1 }));

  behave$2(Reduced$1);

  function reduce3$1(xs, xf, init) {
    var memo = init,
        to = xs.length - 1;
    for (var i = 0; i <= to; i++) {
      if (memo instanceof Reduced$1) break;
      memo = xf(memo, xs[i]);
    }
    return memo instanceof Reduced$1 ? memo.valueOf() : memo;
  }

  function reduce4(xs, xf, init, from) {
    return reduce5(xs, xf, init, from, xs.length - 1);
  }

  function reduce5(xs, xf, init, from, to) {
    var memo = init;
    if (from <= to) {
      for (var i = from; i <= to; i++) {
        if (memo instanceof Reduced$1) break;
        memo = xf(memo, xs[i]);
      }
    } else {
      for (var i = from; i >= to; i--) {
        if (memo instanceof Reduced$1) break;
        memo = xf(memo, xs[i]);
      }
    }
    return memo instanceof Reduced$1 ? memo.valueOf() : memo;
  }

  var reduce$1 = overload(null, null, null, reduce3$1, reduce4, reduce5);

  function reducekv$1(xs, xf, init, from) {
    var memo = init,
        len = xs.length;
    for (var i = from || 0; i < len; i++) {
      if (memo instanceof Reduced$1) break;
      memo = xf(memo, i, xs[i]);
    }
    return memo instanceof Reduced$1 ? memo.valueOf() : memo;
  }

  function reducing(rf) {
    return function r(x) {
      for (var _len = arguments.length, tail = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        tail[_key - 1] = arguments[_key];
      }

      return tail.length ? rf(x, r.apply(null, tail)) : x;
    };
  }

  function IndexedSeq(arr, start) {
    this.arr = arr;
    this.start = start;
  }

  function indexedSeq(arr, start) {
    return start < arr.length ? new IndexedSeq(arr, start) : EMPTY;
  }

  function iterate(self) {
    var state = self;
    return {
      next: function next$$1() {
        var result = ISeqable.seq(state) ? { value: ISeq.first(state), done: false } : { done: true };
        state = INext.next(state);
        return result;
      }
    };
  }

  function iterator() {
    return iterate(this);
  }

  function iterable(Type) {
    Type.prototype[Symbol.iterator] = iterator;
  }

  function find$1(coll, key) {
    return reducekv$2(coll, function (memo, k, v) {
      return key === k ? reduced([k, v]) : memo;
    }, null);
  }

  function first$1(self) {
    return self.head;
  }

  function rest$1(self) {
    return self.tail();
  }

  function next$1(self) {
    return ISeqable.seq(ISeq.rest(self));
  }

  function show$1(self) {
    var xs = IArr.toArray(ISeqable.seq(self));
    return "#" + self.constructor.name + " [" + xs.map(IShow.show).join(", ") + "]";
  }

  function reduce$2(xs, xf, init) {
    var memo = init,
        ys = ISeqable.seq(xs);
    while (ys && !(memo instanceof Reduced$1)) {
      memo = xf(memo, ISeq.first(ys));
      ys = next$1(ys);
    }
    return memo instanceof Reduced$1 ? memo.valueOf() : memo;
  }

  function reducekv$2(xs, xf, init) {
    var memo = init,
        ys = ISeqable.seq(xs);
    while (ys && !(memo instanceof Reduced$1)) {
      var pair = ISeq.first(ys);
      memo = xf(memo, pair[0], pair[1]);
      ys = next$1(ys);
    }
    return memo instanceof Reduced$1 ? memo.valueOf() : memo;
  }

  function toArray2(xs, ys) {
    if (ISeqable.seq(xs) != null) {
      ys.push(ISeq.first(xs));
      return toArray2(ISeq.rest(xs), ys);
    }
    return ys;
  }

  function toArray1(xs) {
    return toArray2(xs, []);
  }

  var toArray$2 = overload(null, toArray1, toArray2);

  var showable = implement(IShow, { show: show$1 });
  var reduceable = effect(implement(IReduce, { _reduce: reduce$2 }), implement(IKVReduce, { _reducekv: reducekv$2 }));

  var behave$3 = effect(iterable, showable, reduceable, implement(IFind, { find: find$1 }), implement(ISequential), implement(IEmptyableCollection, { empty: EMPTY }), implement(IArr, { toArray: toArray$2 }), implement(ISeq, { first: first$1, rest: rest$1 }), implement(ISeqable, { seq: identity$1 }), implement(INext, { next: next$1 }));

  function find$2(self, key) {
    return IAssociative.contains(self, key) ? [key, ILookup.lookup(self, key)] : null;
  }

  function contains$1(self, idx) {
    return idx < self.arr.length - self.start;
  }

  function lookup$1(self, key) {
    return self.arr[self.start + key];
  }

  function append$1(self, x) {
    return toArray$3(self).concat([x]);
  }

  function prepend$1(self, x) {
    return [x].concat(toArray$3(self));
  }

  function next$2(self) {
    var pos = self.start + 1;
    return pos < self.arr.length ? indexedSeq(self.arr, pos) : null;
  }

  function first$2(self) {
    return self.arr[self.start];
  }

  function rest$2(self) {
    return indexedSeq(self.arr, self.start + 1);
  }

  function toArray$3(self) {
    return self.arr.slice(self.start);
  }

  function count$1(self) {
    return self.length - self.start;
  }

  function _reduce$1(self, xf, init) {
    return reduce$1(self.arr, xf, init, self.start);
  }

  function _reducekv(self, xf, init) {
    return reducekv$1(self.arr, function (memo, k, v) {
      return xf(memo, k - self.start, v);
    }, init, self.start);
  }

  function includes$1(self, x) {
    return self.arr.indexOf(x, self.start) > -1;
  }

  var behave$4 = effect(showable, iterable, implement(ISequential), implement(IInclusive, { includes: includes$1 }), implement(IFind, { find: find$2 }), implement(IAssociative, { contains: contains$1 }), implement(IAppendable, { append: append$1 }), implement(IPrependable, { prepend: prepend$1 }), implement(IEmptyableCollection, { empty: constantly(EMPTY_ARRAY) }), implement(IReduce, { reduce: _reduce$1 }), implement(IKVReduce, { _reducekv: _reducekv }), implement(IFn, { invoke: lookup$1 }), implement(ILookup, { lookup: lookup$1 }), implement(ICollection, { conj: append$1 }), implement(INext, { next: next$2 }), implement(IArr, { toArray: toArray$3 }), implement(ISeq, { first: first$2, rest: rest$2 }), implement(ISeqable, { seq: identity$1 }), implement(ICounted, { count: count$1 }));

  behave$4(IndexedSeq);

  function find$3(self, key) {
    return IAssociative.contains(self, key) ? [key, ILookup.lookup(self, key)] : null;
  }

  function lookup$2(self, key) {
    return self[key];
  }

  function assoc$2(self, key, value) {
    var arr = Array.from(self);
    arr.splice(key, 1, value);
    return arr;
  }

  function contains$2(self, key) {
    return key > -1 && key < self.length;
  }

  function seq$1(self) {
    return self.length ? self : null;
  }

  function append$2(self, x) {
    return self.concat([x]);
  }

  function prepend$2(self, x) {
    return [x].concat(self);
  }

  function next$3(self) {
    return self.length > 1 ? ISeq.rest(self) : null;
  }

  function first$3(self) {
    return self[0] || null;
  }

  function rest$3(self) {
    return indexedSeq(self, 1);
  }

  function includes$2(self, x) {
    return self.indexOf(x) > -1;
  }

  function length(self) {
    return self.length;
  }

  function nth$1(coll, idx, notFound) {
    return coll[idx] || notFound || null;
  }

  var indexed = effect(implement(IIndexed, { nth: nth$1 }), implement(ICounted, { count: length }));

  var behave$5 = effect(showable, indexed, implement(ISequential), implement(IFind, { find: find$3 }), implement(IInclusive, { includes: includes$2 }), implement(IAppendable, { append: append$2 }), implement(IPrependable, { prepend: prepend$2 }), implement(ICloneable, { clone: Array.from }), implement(IFn, { invoke: lookup$2 }), implement(IEmptyableCollection, { empty: constantly(EMPTY_ARRAY) }), implement(IReduce, { _reduce: reduce$1 }), implement(IKVReduce, { _reducekv: reducekv$1 }), implement(ILookup, { lookup: lookup$2 }), implement(IAssociative, { assoc: assoc$2, contains: contains$2 }), implement(ISeqable, { seq: seq$1 }), implement(ICollection, { conj: append$2 }), implement(INext, { next: next$3 }), implement(IArr, { toArray: identity$1 }), implement(ISeq, { first: first$3, rest: rest$3 }));

  behave$5(Array);

  var isArray = Array.isArray.bind(Array);
  var slice = unbind(Array.prototype.slice);

  function invoke$1(self) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return self.apply(null, args);
  }

  var behave$6 = effect(implement(IFn, { invoke: invoke$1 }));

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  behave$6(Function);

  function comp() {
    for (var _len = arguments.length, fs = Array(_len), _key = 0; _key < _len; _key++) {
      fs[_key] = arguments[_key];
    }

    var last = fs.length - 1;
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return reduce$1(fs, function (memo, f) {
        return f(memo);
      }, apply$1(fs[last], args), last - 1, 0);
    };
  }

  function partial(f) {
    for (var _len3 = arguments.length, applied = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      applied[_key3 - 1] = arguments[_key3];
    }

    return function () {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return f.apply(this, applied.concat(args));
    };
  }

  function partially(f) {
    return function () {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return apply$1(partial, f, args);
    };
  }

  function curry1(f) {
    return curry2(f, f.length);
  }

  function curry2(f, minimum) {
    return function () {
      for (var _len6 = arguments.length, applied = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        applied[_key6] = arguments[_key6];
      }

      if (applied.length >= minimum) {
        return f.apply(this, applied);
      } else {
        return curry2(function () {
          for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
          }

          return f.apply(this, applied.concat(args));
        }, minimum - applied.length);
      }
    };
  }

  var curry = overload(null, curry1, curry2);

  function juxt() {
    for (var _len8 = arguments.length, fs = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      fs[_key8] = arguments[_key8];
    }

    return function () {
      for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      return reduce$1(fs, function (memo, f) {
        return memo.concat([f.apply(this, args)]);
      }, []);
    };
  }

  function multimethod(dispatch) {
    return function () {
      for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }

      var f = apply$1(dispatch, args);
      return apply$1(f, args);
    };
  }

  function complement(f) {
    return function () {
      return !f.apply(this, arguments);
    };
  }

  function tap(f) {
    return function (value) {
      f(value);
      return value;
    };
  }

  function see(about) {
    return tap(partial(log, about));
  }

  function reversed(f) {
    return function () {
      for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
      }

      return f.apply(this, args.reverse());
    };
  }

  function subj(f) {
    return function () {
      for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
      }

      return function (obj) {
        return apply$1(f, obj, args);
      };
    };
  }

  function apply2(f, args) {
    return f.apply(null, toArray$1(args));
  }

  function apply3(f, a, args) {
    return f.apply(null, [a].concat(toArray$1(args)));
  }

  function apply4(f, a, b, args) {
    return f.apply(null, [a, b].concat(toArray$1(args)));
  }

  function apply5(f, a, b, c, args) {
    return f.apply(null, [a, b, c].concat(toArray$1(args)));
  }

  function applyN(f, a, b, c, d, args) {
    return f.apply(null, [a, b, c, d].concat(toArray$1(args)));
  }

  var apply$1 = overload(null, null, apply2, apply3, apply4, apply5, applyN);

  function spread(f) {
    return function (args) {
      return f.apply(undefined, toConsumableArray(args));
    };
  }

  function unspread(f) {
    return function () {
      for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        args[_key13] = arguments[_key13];
      }

      return f(args);
    };
  }

  function nullary(f) {
    return function () {
      return f();
    };
  }

  function unary(f) {
    return function (a) {
      return f(a);
    };
  }

  function binary(f) {
    return function (a, b) {
      return f(a, b);
    };
  }

  function ternary(f) {
    return function (a, b, c) {
      return f(a, b, c);
    };
  }

  function quaternary(f) {
    return function (a, b, c, d) {
      return f(a, b, c, d);
    };
  }

  function nary(f, length) {
    return function () {
      return f.apply(undefined, toConsumableArray(slice(arguments, 0, length)));
    };
  }

  function arity(f, length) {
    return ([nullary, unary, binary, ternary, quaternary][length] || nary)(f, length);
  }

  function constructs$1(Type) {
    return function () {
      for (var _len16 = arguments.length, args = Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
        args[_key16] = arguments[_key16];
      }

      return new (Function.prototype.bind.apply(Type, [null].concat(args)))();
    };
  }

  var EMPTY_OBJECT = Object.freeze({});

  function ObjectSelection(obj, keys) {
    this.obj = obj;
    this.keys = keys;
  }

  function objectSelection(obj, keys) {
    return new ObjectSelection(obj, seq(keys) ? keys : EMPTY);
  }

  function LazySeq(head, tail) {
    this.head = head;
    this.tail = tail;
  }

  function lazySeq(head, tail) {
    return new LazySeq(head, tail);
  }

  function appendTo$1(self, parent) {
    IKVReduce._reducekv(self, function (memo, key, value) {
      var f = typeof value === "function" ? memo.addEventListener : memo.setAttribute;
      f.call(parent, key, value);
      return memo;
    }, parent, self);
  }

  function toObject$1(self) {
    return reduce$1(self.keys, function (memo, key) {
      memo[key] = lookup$3(self, key);
      return memo;
    }, {});
  }

  function find$4(self, key) {
    return self.keys.indexOf(key) > -1 ? [key, self.obj[key]] : null;
  }

  function lookup$3(self, key) {
    return self.keys.indexOf(key) > -1 ? self.obj[key] : null;
  }

  function _dissoc(self, key) {
    var keys = toArray(self.keys).filter(function (k) {
      return k !== key;
    });
    return objectSelection(self, keys);
  }

  function seq$2(self) {
    var key = ISeq.first(self.keys);
    return lazySeq([key, self.obj[key]], function () {
      return objectSelection(self.obj, ISeq.rest(self.keys));
    });
  }

  function count$2(self) {
    return self.keys.length;
  }

  function clone$1(self) {
    return reduce$1(IArr.toArray(seq$2(self)), function (memo, pair) {
      memo[pair[0]] = pair[1];
      return memo;
    }, {});
  }

  function _reduce$2(self, xf, init) {
    var memo = init;
    Object.keys(obj).forEach(function (key) {
      memo = xf(memo, [key, self.obj[key]]);
    });
    return memo;
  }

  function _reducekv$1(self, xf, init) {
    var memo = init;
    self.keys.forEach(function (key) {
      memo = xf(memo, key, self.obj[key]);
    });
    return memo;
  }

  function show$2(self) {
    var pairs = IArr.toArray(seq$2(self));
    return "#object-selection {" + pairs.map(function (pair) {
      return show$2(pair[0]) + ": " + show$2(pair[1]);
    }).join(", ") + "}";
  }

  var behave$7 = effect(implement(IElementContent, { appendTo: appendTo$1 }), implement(IObj, { toObject: toObject$1 }), implement(IFind, { find: find$4 }), implement(IMap, { _dissoc: _dissoc }), implement(IReduce, { _reduce: _reduce$2 }), implement(IKVReduce, { _reducekv: _reducekv$1 }), implement(ICloneable, { clone: clone$1 }), implement(IEmptyableCollection, { empty: constantly(EMPTY_OBJECT) }), implement(IFn, { invoke: lookup$3 }), implement(ILookup, { lookup: lookup$3 }), implement(ISeqable, { seq: seq$2 }), implement(ICounted, { count: count$2 }), implement(IShow, { show: show$2 }));

  behave$7(ObjectSelection);

  behave$3(LazySeq);

  function juxts(f) {
    for (var _len = arguments.length, fs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      fs[_key - 1] = arguments[_key];
    }

    return arguments.length ? function (x) {
      return lazySeq(f(x), function () {
        return apply$1(juxts, fs)(x);
      });
    } : constantly(EMPTY);
  }

  function appendTo$2(self, parent) {
    IKVReduce._reducekv(self, function (memo, key, value) {
      var f = typeof value === "function" ? memo.addEventListener : memo.setAttribute;
      f.call(parent, key, value);
      return memo;
    }, parent, self);
  }

  function find$5(self, key) {
    return IAssociative.contains(self, key) ? [key, ILookup.lookup(self, key)] : null;
  }

  function includes$3(superset, subset) {
    return reducekv(function (memo, key, value) {
      return memo ? get(superset, key) === value : new Reduced(memo);
    }, true, seq$3(subset));
  }

  function lookup$4(self, key) {
    return self[key];
  }

  function seqObject(self, keys) {
    var key = ISeq.first(keys);
    return ISeqable.seq(keys) ? lazySeq([key, self[key]], function () {
      return seqObject(self, ISeq.rest(keys));
    }) : EMPTY;
  }

  function _dissoc$1(obj, key) {
    var result = Object.assign({}, obj);
    delete result[key];
    return result;
  }

  function assoc$3(self, key, value) {
    var obj = Object.assign({}, self);
    obj[key] = value;
    return obj;
  }

  function contains$3(self, key) {
    return self.hasOwnProperty(key);
  }

  function seq$3(self) {
    return seqObject(self, Object.keys(self));
  }

  function count$3(self) {
    return ICounted.count(Object.keys(self));
  }

  function clone$2(self) {
    return Object.assign({}, self);
  }

  function _reduce$3(self, xf, init) {
    var memo = init;
    Object.keys(self).forEach(function (key) {
      memo = xf(memo, [key, self[key]]);
    });
    return memo;
  }

  function _reducekv$2(self, xf, init) {
    var memo = init;
    Object.keys(self).forEach(function (key) {
      memo = xf(memo, key, self[key]);
    });
    return memo;
  }

  function show$3(self) {
    var xs = IArr.toArray(seq$3(self));
    return "{" + xs.map(function (pair) {
      return show$3(pair[0]) + ": " + show$3(pair[1]);
    }).join(", ") + "}";
  }

  var behave$8 = effect(implement(IElementContent, { appendTo: appendTo$2 }), implement(IObj, { toObject: identity$1 }), implement(IFind, { find: find$5 }), implement(IInclusive, { includes: includes$3 }), implement(ICloneable, { clone: clone$2 }), implement(IReduce, { _reduce: _reduce$3 }), implement(IKVReduce, { _reducekv: _reducekv$2 }), implement(IMap, { _dissoc: _dissoc$1 }), implement(IFn, { invoke: lookup$4 }), implement(ILookup, { lookup: lookup$4 }), implement(IEmptyableCollection, { empty: constantly(EMPTY_OBJECT) }), implement(IAssociative, { assoc: assoc$3, contains: contains$3 }), implement(ISeqable, { seq: seq$3 }), implement(ICounted, { count: count$3 }), implement(IShow, { show: show$3 }));

  behave$8(Object);

  function selectKeys(self, keys) {
    return reduce(function (memo, key) {
      memo[key] = lookup(self, key);
      return memo;
    }, {}, keys);
  }

  function defaults2(self, defaults) {
    return Object.assign({}, defaults, self);
  }

  var defaults$1 = overload(null, curry(defaults2, 2), defaults2, reducing(defaults2));

  function branch3(obj, pred, yes) {
    return branch4(obj, pred, yes, constantly(null));
  }

  function branch4(obj, pred, yes, no) {
    return pred(obj) ? yes(obj) : no(obj);
  }

  var branch = overload(null, null, null, branch3, branch4);

  function compile(self) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return apply$1(invoke, self, args);
    };
  }

  var EMPTY_STRING = "";

  function appendTo$3(self, parent) {
    parent.appendChild(document.createTextNode(self));
  }

  function seq$4(self) {
    return self.length ? self : null;
  }

  function lookup$5(self, key) {
    return self[key];
  }

  function first$4(self) {
    return self[0];
  }

  function rest$4(self) {
    return self.substring(1);
  }

  function toArray$5(self) {
    return self.split('');
  }

  function show$4(self) {
    return "\"" + self + "\"";
  }

  function append$3(self, tail) {
    return self + tail;
  }

  function prepend$3(self, head) {
    return head + self;
  }

  function includes$4(self, str) {
    return self.indexOf(str) > -1;
  }

  var behave$9 = effect(indexed, implement(IElementContent, { appendTo: appendTo$3 }), implement(IInclusive, { includes: includes$4 }), implement(IAppendable, { append: append$3 }), implement(IPrependable, { prepend: prepend$3 }), implement(IEmptyableCollection, { empty: constantly(EMPTY_STRING) }), implement(IFn, { invoke: lookup$5 }), implement(ILookup, { lookup: lookup$5 }), implement(IArr, { toArray: toArray$5 }), implement(ISeqable, { seq: seq$4 }), implement(ISeq, { first: first$4, rest: rest$4 }), implement(IShow, { show: show$4 }));

  behave$9(String);

  function isString(s) {
    return typeof s === "string";
  }

  function isBlank(str) {
    return str == null || typeof str === "string" && str.trim().length === 0;
  }

  function str1(x) {
    return x == null ? "" : x.toString();
  }

  function str2(x, y) {
    return str1(x) + str1(y);
  }

  function template(template, obj) {
    return reducekv(function (text, key, value) {
      return replace$1(text, new RegExp("\\{" + key + "\\}", 'ig'), value);
    }, template, obj);
  }

  function inject(template) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return template(template, args);
  }

  var startsWith = unbind(String.prototype.startsWith);
  var endsWith = unbind(String.prototype.endsWith);
  var replace$1 = unbind(String.prototype.replace);
  var subs$1 = unbind(String.prototype.substring);
  var lowerCase = unbind(String.prototype.toLowerCase);
  var upperCase = unbind(String.prototype.toUpperCase);
  var trim = unbind(String.prototype.trim);
  var str = overload(constantly(EMPTY_STRING), str1, str2, reducing(str2));

  function step$1(amount, target) {
    return target + amount;
  }

  function converse$1(amount) {
    return amount * -1;
  }

  function show$5(n) {
    return n.toString();
  }

  function unit2(self, amount) {
    return amount;
  }

  var behave$10 = effect(implement(ISteppable, { step: step$1, converse: converse$1 }), implement(IUnit, { unit: overload(null, constantly(1), unit2) }), implement(IShow, { show: show$5 }));

  behave$10(Number);

  var int = parseInt;
  var float = parseFloat;
  function number() {
    return Number.apply(undefined, arguments);
  }

  function isNumber(n) {
    return Number(n) === n;
  }

  function isInteger(n) {
    return Number(n) === n && n % 1 === 0;
  }

  var isInt = isInteger;

  function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }

  function mod(n, div) {
    return n % div;
  }

  function add2(x, y) {
    return x + y;
  }

  function subtract1(x) {
    return subtract2(0, x);
  }

  function subtract2(x, y) {
    return x - y;
  }

  function multiply2(x, y) {
    return x * y;
  }

  function divide1(x) {
    return divide2(1, x);
  }

  function divide2(x, y) {
    return x / y;
  }

  var add = overload(constantly(0), identity$1, add2, reducing(add2));
  var subtract = overload(constantly(0), subtract1, subtract2, reducing(subtract2));
  var multiply = overload(constantly(1), identity$1, multiply2, reducing(multiply2));
  var divide = overload(null, divide1, divide2, reducing(divide2));
  var inc = partial(add2, +1);
  var dec = partial(add2, -1);

  function isZero(x) {
    return x === 0;
  }

  function isPos(x) {
    return x > 0;
  }

  function isNeg(x) {
    return x < 0;
  }

  function isOdd(n) {
    return n % 2;
  }

  var isEven = complement(isOdd);

  function rand0() {
    return Math.random();
  }

  function rand1(n) {
    return Math.random() * n;
  }

  var rand = overload(rand0, rand1);

  function randInt(n) {
    return Math.floor(rand(n));
  }

  function Duration(milliseconds) {
    this.milliseconds = milliseconds;
  }

  function duration(milliseconds) {
    return new Duration(milliseconds);
  }

  function isDuration(self) {
    return self instanceof Duration;
  }

  var milliseconds = duration;

  function seconds(n) {
    return duration(n * 1000);
  }

  function minutes(n) {
    return duration(n * 1000 * 60);
  }

  function hours(n) {
    return duration(n * 1000 * 60 * 60);
  }

  function days(n) {
    return duration(n * 1000 * 60 * 60 * 24);
  }

  function weeks(n) {
    return duration(n * 1000 * 60 * 60 * 24 * 7);
  }

  function time(f) {
    var start = Date.now();
    return Promise.resolve(f()).then(function () {
      var end = Date.now();
      return milliseconds(end - start);
    });
  }

  function step$2(self, dt) {
    return new Date(dt.valueOf() + self.milliseconds);
  }

  function converse$2(self) {
    return new self.constructor(self.milliseconds * -1);
  }

  var behave$11 = effect(implement(ISteppable, { step: step$2, converse: converse$2 }));

  behave$11(Duration);

  function lookup$6(self, key) {
    switch (key) {
      case "year":
        return self.getFullYear();
      case "month":
        return self.getMonth() + 1;
      case "day":
        return self.getDate();
      case "hour":
        return self.getHours();
      case "minute":
        return self.getMinutes();
      case "second":
        return self.getSeconds();
      case "millisecond":
        return self.getMilliseconds();
    }
  }

  function InvalidKeyError(key, target) {
    this.key = key;
    this.target = target;
  }

  function contains$4(self, key) {
    return ["year", "month", "day", "hour", "minute", "second", "millisecond"].indexOf(key) > -1;
  }

  //the benefit of exposing internal state as a map is assocIn and updateIn
  function assoc$4(self, key, value) {
    var dt = new Date(self.valueOf());
    switch (key) {
      case "year":
        dt.setFullYear(value);
        break;
      case "month":
        dt.setMonth(value - 1); //abstract away javascript's base 0 months!
        break;
      case "day":
        dt.setDate(value);
        break;
      case "hour":
        dt.setHours(value);
        break;
      case "minute":
        dt.setMinutes(value);
        break;
      case "second":
        dt.setSeconds(value);
        break;
      case "millisecond":
        dt.setMilliseconds(value);
        break;
      default:
        throw new InvalidKeyError(key, self);
    }
    return dt;
  }

  function clone$3(self) {
    return new Date(self.valueOf());
  }

  function show$6(self) {
    return "\"" + self.toISOString() + "\"";
  }

  function unit2$1(self, amount) {
    return isNumber(amount) ? days(amount) : amount;
  }

  var behave$12 = effect(implement(IUnit, { unit: overload(null, constantly(days(1)), unit2$1) }), implement(IAssociative, { assoc: assoc$4, contains: contains$4 }), implement(ILookup, { lookup: lookup$6 }), implement(ICloneable, { clone: clone$3 }), implement(IShow, { show: show$6 }));

  behave$12(Date);

  function List(head, tail) {
    this.head = head;
    this.tail = tail;
  }

  function cons2(head, tail) {
    return new List(head, tail || EMPTY);
  }

  var _consN = reducing(cons2);

  function consN() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _consN.apply(this, args.concat([EMPTY]));
  }

  var cons = overload(constantly(EMPTY), cons2, cons2, consN);

  function first$5(self) {
    return self.head;
  }

  function rest$5(self) {
    return self.tail;
  }

  var behave$13 = effect(behave$3, implement(ISeq, { first: first$5, rest: rest$5 }));

  behave$13(List);

  function Concatenated(colls) {
    this.colls = colls;
  }

  function concatenated(colls) {
    return seq(colls) ? new Concatenated(colls) : EMPTY;
  }

  var concat = overload(constantly(EMPTY), seq, unspread(concatenated));

  function conj$1(self, x) {
    return concatenated(ICollection.conj(self.colls, [x]));
  }

  function next$4(self) {
    var tail = ISeq.rest(self);
    return tail === EMPTY ? null : tail;
  }

  function first$6(self) {
    return ISeq.first(ISeq.first(self.colls));
  }

  function rest$6(self) {
    var tail = INext.next(ISeq.first(self.colls));
    var colls = IArr.toArray(ISeq.rest(self.colls));
    if (tail) {
      colls = [tail].concat(colls);
    }
    return concatenated(colls);
  }

  function toArray$6(self) {
    return reduce(function (memo, xs) {
      return reduce(function (memo, x) {
        memo.push(x);
        return memo;
      }, memo, xs);
    }, [], self.colls);
  }

  function count$4(self) {
    return IArr.toArray(self).length;
  }

  var behave$14 = effect(iterable, reduceable, showable, implement(ICollection, { conj: conj$1 }), implement(INext, { next: next$4 }), implement(ISeq, { first: first$6, rest: rest$6 }), implement(IArr, { toArray: toArray$6 }), implement(ISeqable, { seq: identity$1 }), implement(ICounted, { count: count$4 }));

  behave$14(Concatenated);

  function Months(n) {
    this.n = n;
  }

  function months(n) {
    return new Months(n);
  }

  function step$3(self, dt) {
    var d = new Date(dt.valueOf());
    d.setMonth(d.getMonth() + self.n);
    return d;
  }

  function converse$3(self) {
    return months(self.n * -1);
  }

  var behave$15 = effect(implement(ISteppable, { step: step$3, converse: converse$3 }));

  behave$15(Months);

  function Years(n) {
    this.n = n;
  }

  function years(n) {
    return new Years(n);
  }

  function step$4(self, dt) {
    var d = new Date(dt.valueOf());
    d.setFullYear(d.getFullYear() + self.n);
    return d;
  }

  function converse$4(self) {
    return years(self.n * -1);
  }

  var behave$16 = effect(implement(ISteppable, { step: step$4, converse: converse$4 }));

  behave$16(Years);

  function toObject$2(self) {
    return self.attrs;
  }

  function contains$5(self, key) {
    return self.attrs.hasOwnProperty(key);
  }

  function lookup$7(self, key) {
    return self.attrs[key];
  }

  function seq$5(self) {
    return ISeqable.seq(self.attrs);
  }

  function count$5(self) {
    return Object.keys(self.attrs).length;
  }

  function first$7(self) {
    return ISeq.first(seq$5(self));
  }

  function rest$7(self) {
    return ISeq.rest(seq$5(self));
  }

  function extend$1(Type) {

    function assoc$$1(self, key, value) {
      return Type.from(IAssociative.assoc(self.attrs, key, value));
    }

    function _dissoc(self, key) {
      return Type.from(IMap.dissoc(self.attrs, key));
    }

    doto(Type, implement(IRecord), implement(IObj, { toObject: toObject$2 }), implement(IAssociative, { assoc: assoc$$1, contains: contains$5 }), implement(ILookup, { lookup: lookup$7 }), implement(IMap, { _dissoc: _dissoc }), implement(ISeq, { first: first$7, rest: rest$7 }), implement(ICounted, { count: count$5 }), implement(ISeqable, { seq: seq$5 }));

    Type.create = constructs$1(Type);
    Type.from = function (attrs) {
      return Object.assign(Object.create(Type.prototype), { attrs: attrs });
    };
  }

  function body(keys) {
    return "this.attrs = {" + keys.map(function (key) {
      return "'" + key + "': " + key;
    }).join(", ") + "};";
  }

  function record1(a) {
    return doto(Function(a, body([a])), extend$1);
  }

  function record2(a, b) {
    return doto(Function(a, b, body([a, b])), extend$1);
  }

  function record3(a, b, c) {
    return doto(Function(a, b, c, body([a, b, c])), extend$1);
  }

  function record4(a, b, c, d) {
    return doto(Function(a, b, c, d, body([a, b, c, d])), extend$1);
  }

  function record5(a, b, c, d, e) {
    return doto(Function(a, b, c, d, e, body([a, b, c, d, e])), extend$1);
  }

  function recordN() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return doto(Function.apply(null, args.concat([body(args)])), extend$1);
  }

  var record$1 = overload(null, record1, record2, record3, record4, record5, recordN);

  function Publisher(subscribers, seed) {
    this.subscribers = subscribers;
    this.seed = seed;
  }

  function publisher() {
    return new Publisher({}, counter());
  }

  function sub$1(self, callback) {
    var id = self.seed();
    self.subscribers[id] = callback;
    return function () {
      delete self.subscribers[id];
    };
  }

  function pub$1(self, message) {
    Object.values(self.subscribers).forEach(function (callback) {
      callback(message);
    });
  }

  var behave$17 = effect(implement(ISubscribe, { sub: sub$1 }), implement(IPublish, { pub: pub$1 }));

  behave$17(Publisher);

  function Observable(state, publisher$$1) {
    this.state = state;
    this.publisher = publisher$$1;
  }

  function observable(init, pub) {
    return new Observable(init, pub || publisher());
  }

  function deref$2(self) {
    return self.state;
  }

  function reset$1(self, value) {
    if (value !== self.state) {
      self.state = value;
      IPublish.pub(self.publisher, value);
    }
    return self.state;
  }

  function _swap(self, f) {
    return reset$1(self, f(self.state));
  }

  //The callback is called immediately to prime the subscriber state.
  function sub$2(self, callback) {
    callback(self.state);
    return ISubscribe.sub(self.publisher, callback);
  }

  var behave$18 = effect(implement(IDeref, { deref: deref$2 }), implement(ISubscribe, { sub: sub$2 }), implement(IPublish, { pub: reset$1 }), implement(IReset, { reset: reset$1 }), implement(ISwap, { _swap: _swap }));

  behave$18(Observable);

  function SubscriptionMonitor(decorated, updated) {
    this.decorated = decorated;
    this.updated = updated;
    this.count = 0;
  }

  function subscriptionMonitor(decorated, updated) {
    updated(false);
    return new SubscriptionMonitor(decorated, updated);
  }

  function sub$3(self, callback) {
    var unsub = ISubscribe.sub(self.decorated, callback);
    var activated = self.count === 0;
    self.count += 1;
    activated && self.updated(true);
    return function () {
      if (unsub) {
        var deactivated = self.count === 1;
        unsub();
        self.count -= 1;
        unsub = null;
        deactivated && self.updated(false);
      }
    };
  }

  function pub$2(self, message) {
    IPublish.pub(self.decorated, message);
  }

  var behave$19 = effect(implement(ISubscribe, { sub: sub$3 }), implement(IPublish, { pub: pub$2 }));

  behave$19(SubscriptionMonitor);

  function Pipeline(how, fs) {
    this.how = how;
    this.fs = fs;
  }

  function pipeline(how, fs) {
    return new Pipeline(how || identity$1, fs || []);
  }

  function provideBehavior(piped) {

    function append$$1(self, f) {
      return pipeline(self.how, IAppendable.append(self.fs, f));
    }

    function prepend$$1(self, f) {
      return pipeline(self.how, IPrependable.prepend(self.fs, f));
    }

    function invoke$$1(self) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return piped(self.how).apply(undefined, toConsumableArray(self.fs)).apply(undefined, args);
    }

    return effect(implement(IFn, { invoke: invoke$$1 }), implement(IAppendable, { append: append$$1 }), implement(IPrependable, { prepend: prepend$$1 }));
  }

  function providePipeline(piped) {
    provideBehavior(piped)(Pipeline);
  }

  function Aspectable(how, exec, pre, post) {
    this.how = how;
    this.exec = exec;
    this.pre = pre;
    this.post = post;
  }

  function provideConstructor(pipeline) {

    return function aspectable(how, exec) {
      return new Aspectable(how, exec, pipeline(how), pipeline(how));
    };
  }

  function provideBehavior$1(pipeline, compile) {

    function invoke$$1(self) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return compile(pipeline(self.how, [compile(self.pre), self.exec, compile(self.post)])).apply(undefined, args);
    }

    function lookup$$1(self, key) {
      switch (key) {
        case "pre":
          return self.pre;
        case "post":
          return self.post;
      }
    }

    function assoc$$1(self, key, value) {
      switch (key) {
        case "pre":
          return new Aspectable(self.how, self.exec, value, self.post);
        case "post":
          return new Aspectable(self.how, self.exec, self.pre, value);
        default:
          return self;
      }
    }

    return effect(implement(ILookup, { lookup: lookup$$1 }), implement(IAssociative, { assoc: assoc$$1 }), implement(IFn, { invoke: invoke$$1 }));
  }

  function provideAspectable(pipeline, compile) {
    provideBehavior$1(pipeline, compile)(Aspectable);
    return provideConstructor(pipeline);
  }

  function everyPair2(pred, xs) {
    var every = xs.length > 0;
    while (every && xs.length > 1) {
      every = pred(xs[0], xs[1]);
      xs = slice(xs, 1);
    }
    return every;
  }

  var everyPair = overload(null, curry(everyPair2, 2), everyPair2);

  function someFn1(a) {
    return function () {
      return apply$1(a, arguments);
    };
  }

  function someFn2(a, b) {
    return function () {
      return apply$1(a, arguments) || apply$1(b, arguments);
    };
  }

  function someFn3(a, b, c) {
    return function () {
      return apply$1(a, arguments) || apply$1(b, arguments) || apply$1(c, arguments);
    };
  }

  function someFnN() {
    for (var _len = arguments.length, preds = Array(_len), _key = 0; _key < _len; _key++) {
      preds[_key] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return reduce(function (result, pred) {
        var r = apply$1(pred, args);
        return r ? reduced(r) : result;
      }, false, preds);
    };
  }

  var someFn = overload(null, someFn1, someFn2, someFn3, someFnN);

  function isIdentical(x, y) {
    //TODO via protocol
    return x === y;
  }

  function compare$1(x, y) {
    if (isIdentical(x, y)) {
      return 0;
    } else if (isNil(x)) {
      return -1;
    } else if (isNil(y)) {
      return 1;
    } else if (type(x) === type(y)) {
      return IComparable._compare(x, y);
    }
  }

  function lt2(a, b) {
    return a < b;
  }

  function ltN() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return everyPair(lt2, args);
  }

  var lt = overload(constantly(false), constantly(true), lt2, ltN);

  function lte2(a, b) {
    return a <= b;
  }

  function lteN() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return everyPair(lte2, args);
  }

  var lte = overload(constantly(false), constantly(true), lte2, lteN);

  function gt2(a, b) {
    return a > b;
  }

  function gtN() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return everyPair(gt2, args);
  }

  var gt = overload(constantly(false), constantly(true), gt2, gtN);

  function gte2(a, b) {
    return a >= b;
  }

  function gteN() {
    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    return everyPair(gte2, args);
  }

  var gte = overload(constantly(false), constantly(true), gte2, gteN);

  function eq2(a, b) {
    return a === b;
  }

  function eqN() {
    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    return everyPair(eq2, args);
  }

  var eq = overload(constantly(true), constantly(true), eq2, eqN);

  function notEq2(a, b) {
    return a !== b;
  }

  function notEqN() {
    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    return !everyPair(eq2, args);
  }

  var notEq = overload(constantly(true), constantly(true), notEq2, notEqN);

  function equal2(a, b) {
    return a == b;
  }

  function equalN() {
    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    return everyPair(equal2, args);
  }

  var equal = overload(constantly(true), constantly(true), equal2, equalN);

  function min2(x, y) {
    return x < y ? x : y;
  }

  function max2(x, y) {
    return x > y ? x : y;
  }

  var min = overload(null, identity$1, min2, reducing(min2));
  var max = overload(null, identity$1, max2, reducing(max2));

  function everyPred() {
    var preds = slice(arguments);
    return function () {
      return reduce(function (memo, arg) {
        return reduce(function (memo, pred) {
          var result = memo && pred(arg);
          return result ? result : reduced(result);
        }, memo, preds);
      }, true, slice(arguments));
    };
  }

  function transduce3(xform, f, coll) {
    return transduce4(xform, f, f(), coll);
  }

  function transduce4(xform, f, init, coll) {
    return reduce(xform(f), init, coll);
  }

  var transduce = overload(null, null, null, transduce3, transduce4);

  function into2(to, from) {
    return reduce(conj, to, from);
  }

  function into3(to, xform, from) {
    return transduce(xform, conj, to, from);
  }

  var into = overload(constantly(EMPTY_ARRAY), identity$1, into2, into3);

  function each(f, xs) {
    var ys = seq(xs);
    while (ys) {
      f(first(ys));
      ys = seq(rest(ys));
    }
  }

  function dorun1(coll) {
    var xs = seq(coll);
    while (xs) {
      xs = next(xs);
    }
  }

  function dorun2(n, coll) {
    var xs = seq(coll);
    while (xs && n > 0) {
      n++;
      xs = next(xs);
    }
  }

  var dorun = overload(null, dorun1, dorun2);

  function doall1(coll) {
    dorun(coll);
    return coll;
  }

  function doall2(n, coll) {
    dorun(n, coll);
    return coll;
  }

  var doall = overload(null, doall1, doall2);

  function dotimes2(n, f) {
    each(f, range(n));
  }

  var dotimes = overload(null, curry(dotimes2, 2), dotimes2);

  function proceed1(self) {
    return step(unit(self), self);
  }

  function proceed2(self, amount) {
    return step(unit(self, amount), self);
  }

  var proceed = overload(null, proceed1, proceed2);

  function recede1(self) {
    return step(converse(unit(self)), self);
  }

  function recede2(self, amount) {
    return step(converse(unit(self, amount)), self);
  }

  var recede = overload(null, recede1, recede2);

  function isEmpty(coll) {
    return !seq(coll);
  }

  function notEmpty(coll) {
    return isEmpty(coll) ? null : coll;
  }

  function some(pred, coll) {
    var xs = seq(coll);
    while (xs && !pred(first(xs))) {
      xs = next(xs);
    }
    return !!xs;
  }

  var notSome = comp(not, some);
  var notAny = notSome;

  function every(pred, coll) {
    var xs = seq(coll);
    while (xs) {
      if (!pred(first(xs))) {
        return false;
      }
      xs = next(xs);
    }
    return true;
  }

  var notEvery = comp(not, every);

  function map2(f, xs) {
    return seq(xs) ? lazySeq(f(first(xs)), function () {
      return map2(f, rest(xs));
    }) : EMPTY;
  }

  function map3(f, c1, c2) {
    var s1 = seq(c1),
        s2 = seq(c2);
    return s1 && s2 ? cons(f(first(s1), first(s2)), map3(f, rest(s1), rest(s2))) : EMPTY;
  }

  function mapN(f) {
    for (var _len = arguments.length, tail = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      tail[_key - 1] = arguments[_key];
    }

    var seqs = mapa(seq, tail);
    return notAny(isNil, seqs) ? cons(apply$1(f, mapa(first, seqs)), apply$1(mapN, f, mapa(rest, seqs))) : EMPTY;
  }

  var map = overload(null, curry(map2, 2), map2, map3, mapN);

  var mapa2 = comp(toArray$1, map);

  var mapa = overload(null, curry(mapa2, 2), mapa2);

  function indexed$1(iter) {
    return function (f, xs) {
      var idx = -1;
      return iter(function (x) {
        return f(++idx, x);
      }, xs);
    };
  }

  var mapIndexed2 = indexed$1(map2);

  var mapIndexed = overload(null, curry(mapIndexed2, 2), mapIndexed2);

  var keepIndexed2 = indexed$1(keep2);

  var keepIndexed = overload(null, curry(keepIndexed2, 2), keepIndexed2);

  function filter2(pred, xs) {
    var coll = seq(xs);
    if (!coll) return EMPTY;
    var head = first(coll);
    return pred(head) ? lazySeq(head, function () {
      return filter2(pred, rest(coll));
    }) : filter2(pred, rest(coll));
  }

  var filter = overload(null, curry(filter2, 2), filter2);

  var filtera2 = comp(toArray$1, filter);

  var filtera = overload(null, curry(filtera2, 2), filtera2);

  function remove2(pred, xs) {
    return filter2(complement(pred), xs);
  }

  var remove = overload(null, curry(remove2, 2), remove2);

  function keep2(f, xs) {
    return filter2(isSome, map2(f, xs));
  }

  var keep = overload(null, curry(keep2, 2), keep2);
  var compact = partial(filter2, identity$1);

  function drop2(n, coll) {
    var i = n,
        xs = seq(coll);
    while (i > 0 && xs) {
      xs = rest(xs);
      i = i - 1;
    }
    return xs;
  }

  var drop = overload(null, curry(drop2, 2), drop2);

  function dropWhile2(pred, xs) {
    return seq(xs) ? pred(first(xs)) ? dropWhile2(pred, rest(xs)) : xs : EMPTY;
  }

  var dropWhile = overload(null, curry(dropWhile2, 2), dropWhile2);

  function dropLast2(n, coll) {
    return map(function (x, _) {
      return x;
    }, coll, drop(n, coll));
  }

  var dropLast = overload(null, curry(dropLast2, 2), dropLast2);

  function take2(n, coll) {
    var xs = seq(coll);
    return n > 0 && xs ? lazySeq(first(xs), function () {
      return take2(n - 1, rest(xs));
    }) : EMPTY;
  }

  var take = overload(null, curry(take2, 2), take2);

  function takeWhile2(pred, xs) {
    if (!seq(xs)) return EMPTY;
    var item = first(xs);
    return pred(item) ? lazySeq(item, function () {
      return takeWhile2(pred, rest(xs));
    }) : EMPTY;
  }

  var takeWhile = overload(null, curry(takeWhile2, 2), takeWhile2);

  function takeNth2(n, xs) {
    return seq(xs) ? lazySeq(first(xs), function () {
      return takeNth2(n, drop2(n, xs));
    }) : EMPTY;
  }

  var takeNth = overload(null, curry(takeNth2, 2), takeNth2);

  function takeLast2(n, coll) {
    return n ? drop(count(coll) - n, coll) : EMPTY;
  }

  var takeLast = overload(null, curry(takeLast2, 2), takeLast2);

  function interleave2(xs, ys) {
    var as = seq(xs),
        bs = seq(ys);
    return as != null && bs != null ? cons(first(as), lazySeq(first(bs), function () {
      return interleave2(rest(as), rest(bs));
    })) : EMPTY;
  }

  function interleaveN() {
    for (var _len2 = arguments.length, colls = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      colls[_key2] = arguments[_key2];
    }

    return concatenated(interleaved(colls));
  }

  function interleaved(colls) {
    return filter2(isNil, colls) === EMPTY ? lazySeq(map2(first, colls), function () {
      return interleaved(map2(next, colls));
    }) : EMPTY;
  }

  var interleave = overload(null, curry(interleaveN, 2), interleave2, interleaveN);

  function interpose2(sep, xs) {
    return drop2(1, interleave2(repeat1(sep), xs));
  }

  var interpose = overload(null, curry(interpose2, 2), interpose2);

  function partition1(n) {
    return partial(partition, n);
  }

  function partition2(n, xs) {
    return partition3(n, n, xs);
  }

  function partition3(n, step$$1, xs) {
    var coll = seq(xs);
    if (!coll) return EMPTY;
    var part = take(n, coll);
    return n === count(part) ? cons(part, partition3(n, step$$1, drop(step$$1, coll))) : EMPTY;
  }

  function partition4(n, step$$1, pad, xs) {
    var coll = seq(xs);
    if (!coll) return EMPTY;
    var part = take(n, coll);
    return n === count(part) ? cons(part, partition4(n, step$$1, pad, drop(step$$1, coll))) : cons(take(n, concat(part, pad)));
  }

  var partition = overload(null, partition1, partition2, partition3, partition4);

  function partitionAll1(n) {
    return partial(partitionAll, n);
  }

  function partitionAll2(n, xs) {
    return partitionAll3(n, n, xs);
  }

  function partitionAll3(n, step$$1, xs) {
    var coll = seq(xs);
    if (!coll) return EMPTY;
    return cons(take(n, coll), partition3(n, step$$1, drop(step$$1, coll)));
  }

  var partitionAll = overload(null, partitionAll1, partitionAll2, partitionAll3);

  function partitionBy2(f, xs) {
    var coll = seq(xs);
    if (!coll) return EMPTY;
    var head = first(coll),
        val = f(head),
        run = cons(head, takeWhile2(function (x) {
      return val === f(x);
    }, next(coll)));
    return cons(run, partitionBy2(f, seq(drop(count(run), coll))));
  }

  var partitionBy = overload(null, curry(partitionBy2, 2), partitionBy2);

  var butlast = partial(dropLast, 1);

  function last(coll) {
    var xs = coll,
        ys = null;
    while (ys = next(xs)) {
      xs = ys;
    }
    return first(xs);
  }

  function dedupe(coll) {
    var xs = seq(coll);
    var last = first(xs);
    return xs ? lazySeq(last, function () {
      while (next(xs) && first(next(xs)) === last) {
        xs = next(xs);
      }
      return dedupe(next(xs));
    }) : EMPTY;
  }

  function distinct(coll) {
    return Array.from(new Set(coll));
  }

  var splitAt = juxt(take2, drop2);
  var splitWith = juxt(takeWhile2, dropWhile2);

  function mapcat1(f) {
    return comp(map(f), t.cat);
  }

  function mapcat2(f, colls) {
    return concatenated(map(f, colls));
  }

  var mapcat = overload(null, mapcat1, mapcat2);

  function sort1(coll) {
    return into([], coll).sort();
  }

  function sort2(compare, coll) {
    return into([], coll).sort(compare);
  }

  var sort = overload(null, sort1, sort2);

  function sortBy2(keyFn, coll) {
    return sortBy3(keyFn, compare, coll);
  }

  function sortBy3(keyFn, compare, coll) {
    return sort(function (x, y) {
      return compare(keyFn(x), keyFn(y));
    }, coll);
  }

  var sortBy = overload(null, null, sortBy2, sortBy3);

  function groupInto(seed, f, coll) {
    return reduce(function (memo, value) {
      return update(memo, f(value), function (group) {
        return conj(group || [], value);
      });
    }, seed, coll);
  }

  function groupBy(f, coll) {
    return groupInto({}, f, coll);
  }

  function doseq3(f, xs, ys) {
    each(function (x) {
      each(function (y) {
        f(x, y);
      }, ys);
    }, xs);
  }

  function doseq4(f, xs, ys, zs) {
    each(function (x) {
      each(function (y) {
        each(function (z) {
          f(x, y, z);
        }, zs);
      }, ys);
    }, xs);
  }

  function doseqN(f, xs) {
    for (var _len3 = arguments.length, colls = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      colls[_key3 - 2] = arguments[_key3];
    }

    each(function (x) {
      if (seq(colls)) {
        apply$1(doseq, function () {
          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          apply$1(f, x, args);
        }, colls);
      } else {
        f(x);
      }
    }, xs || []);
  }

  var doseq = overload(null, null, each, doseq3, doseq4, doseqN);

  function coalesce(xs) {
    return detect(identity$1, xs);
  }

  var detect = comp(first, filter);

  function repeatedly1(f) {
    return lazySeq(f(), function () {
      return repeatedly1(f);
    });
  }

  function repeatedly2(n, f) {
    return take2(n, repeatedly1(f));
  }

  var repeatedly = overload(null, repeatedly1, repeatedly2);

  function repeat1(x) {
    return repeatedly1(constantly(x));
  }

  function repeat2(n, x) {
    return repeatedly2(n, constantly(x));
  }

  var repeat = overload(null, repeat1, repeat2);

  function iterate$1(f, x) {
    return lazySeq(x, function () {
      return iterate$1(f, f(x));
    });
  }

  function integers() {
    return iterate$1(inc, 1);
  }

  function range0() {
    return iterate$1(inc, 0);
  }

  function range1(end) {
    return range3(0, end, 1);
  }

  function range2(start, end) {
    return range3(start, end, 1);
  }

  function range3(start, end, step$$1) {
    return start < end ? lazySeq(start, function () {
      return range3(start + step$$1, end, step$$1);
    }) : EMPTY;
  }

  var range = overload(range0, range1, range2, range3);

  function cycle(coll) {
    return seq(coll) ? lazySeq(first(coll), function () {
      return concat(rest(coll), cycle(coll));
    }) : EMPTY;
  }

  function treeSeq(branch$$1, children, root) {
    function walk(node) {
      return cons(node, branch$$1(node) ? mapcat(walk, children(node)) : EMPTY);
    }
    return walk(root);
  }

  function flatten(coll) {
    return filter(complement(isSequential), rest(treeSeq(isSequential, seq, coll)));
  }

  function isDistinctN() {
    for (var _len5 = arguments.length, xs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      xs[_key5] = arguments[_key5];
    }

    var s = new Set(xs);
    return s.size === xs.length;
  }

  var isDistinct = overload(null, constantly(true), notEq, isDistinctN);

  function randNth(coll) {
    return nth(coll, randInt(count(coll)));
  }

  function shuffle(coll) {
    var a = Array.from(coll);
    var j = void 0,
        x = void 0,
        i = void 0;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  function map$1(f) {
    return function (xf) {
      return overload(xf, xf, function (memo, value) {
        return xf(memo, f(value));
      });
    };
  }

  function mapIndexed$1(f) {
    return function (xf) {
      var idx = -1;
      return overload(xf, xf, function (memo, value) {
        return xf(memo, f(++idx, value));
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

  var remove$1 = comp(filter$1, complement);

  function compact$1() {
    return filter$1(identity$1);
  }

  function dedupe$1() {
    return function (xf) {
      var last;
      return overload(xf, xf, function (memo, value) {
        var result = value === last ? memo : xf(memo, value);
        last = value;
        return result;
      });
    };
  }

  function take$1(n) {
    return function (xf) {
      var taking = n;
      return overload(xf, xf, function (memo, value) {
        return taking-- > 0 ? xf(memo, value) : reduced(memo);
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

  function interpose$1(sep) {
    return function (xf) {
      return overload(xf, xf, function (memo, value) {
        return xf(seq(memo) ? xf(memo, sep) : memo, value);
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

  function keep$1(f) {
    return comp(map$1(f), filter$1(isSome));
  }

  function keepIndexed$1(f) {
    return comp(mapIndexed1(f), filter$1(isSome));
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

  function distinct$1() {
    return function (xf) {
      var seen = new Set();
      return overload(xf, xf, function (memo, value) {
        if (seen.has(value)) {
          return memo;
        }
        seen.add(value);
        return xf(memo, value);
      });
    };
  }

  /*
  * Monads, like promises, once introduced force themselves everywhere.  Pipelines allow one to dip into monadic operations without commiting to them.
  */

  function either(f) {
    return function () {
      try {
        return f.apply(undefined, arguments);
      } catch (ex) {
        return reduced(ex);
      }
    };
  }

  function option(f) {
    return function (x) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return isNil(x) || isBlank(x) ? reduced(null) : apply(f, x, args);
    };
  }

  function future(f) {
    return overload(null, function (x) {
      return Promise.resolve(x).then(f);
    }, function () {
      return Promise.resolve(f.apply(undefined, arguments));
    });
  }

  function logged(f) {
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var result = f.apply(undefined, args);
      log({ f: f, args: args, result: result });
      return result;
    };
  }

  function chainedN(how, init) {
    for (var _len3 = arguments.length, fs = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      fs[_key3 - 2] = arguments[_key3];
    }

    return transduce(map$1(how), function (memo, f) {
      return f(memo);
    }, init, fs);
  }

  var chained = overload(null, function (how) {
    return partial(chainedN, how);
  }, chainedN);

  function pipedN(how, f) {
    for (var _len4 = arguments.length, fs = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
      fs[_key4 - 2] = arguments[_key4];
    }

    return function () {
      return f ? chainedN.apply(undefined, [how, f.apply(undefined, arguments)].concat(fs)) : arguments.length <= 0 ? undefined : arguments[0];
    };
  }

  var piped = overload(null, function (how) {
    return partial(pipedN, how);
  }, pipedN);

  var chain = chained(identity$1);
  var maybe = chained(option);
  var pipe = piped(identity$1);
  var opt = piped(option);
  var prom = piped(future);
  var handle = piped(either);

  providePipeline(piped);

  var aspectable = provideAspectable(pipeline, compile);

  var request = aspectable(future, function (config) {
    return fetch(config.url, config);
  });

  function get$2(self, key, notFound) {
    return lookup(self, key) || notFound;
  }

  function getIn(self, keys, notFound) {
    return reduce(get$2, self, keys) || notFound;
  }

  function assocIn(self, keys, value) {
    var key = keys[0];
    switch (keys.length) {
      case 0:
        return self;
      case 1:
        return assoc(self, key, value);
      default:
        return assoc(self, key, assocIn(get$2(self, key), toArray$1(rest(keys)), value));
    }
  }

  function update3(self, key, f) {
    return assoc(self, key, f(get$2(self, key)));
  }

  function update4(self, key, f, a) {
    return assoc(self, key, f(get$2(self, key), a));
  }

  function update5(self, key, f, a, b) {
    return assoc(self, key, f(get$2(self, key), a, b));
  }

  function update6(self, key, f, a, b, c) {
    return assoc(self, key, f(get$2(self, key), a, b, c));
  }

  function updateN(self, key, f) {
    var tgt = get$2(self, key),
        args = [tgt].concat(slice(arguments, 3));
    return assoc(self, key, f.apply(this, args));
  }

  var update$1 = overload(null, null, null, update3, update4, update5, update6, updateN);

  function updateIn3(self, keys, f) {
    var k = keys[0],
        ks = toArray$1(rest(keys));
    return ks.length ? assoc(self, k, updateIn3(get$2(self, k), ks, f)) : update3(self, k, f);
  }

  function updateIn4(self, keys, f, a) {
    var k = keys[0],
        ks = toArray$1(rest(keys));
    return ks.length ? assoc(self, k, updateIn4(get$2(self, k), ks, f, a)) : update4(self, k, f, a);
  }

  function updateIn5(self, keys, f, a, b) {
    var k = keys[0],
        ks = toArray$1(rest(keys));
    return ks.length ? assoc(self, k, updateIn5(get$2(self, k), ks, f, a, b)) : update5(self, k, f, a, b);
  }

  function updateIn6(self, key, f, a, b, c) {
    var k = keys[0],
        ks = toArray$1(rest(keys));
    return ks.length ? assoc(self, k, updateIn6(get$2(self, k), ks, f, a, b, c)) : update6(self, k, f, a, b, c);
  }

  function updateInN(self, keys, f) {
    return updateIn3(self, keys, function (obj) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return f.apply(null, [obj].concat(args));
    });
  }

  var updateIn = overload(null, null, null, updateIn3, updateIn4, updateIn5, updateIn6, updateInN);

  function merge() {
    for (var _len2 = arguments.length, maps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      maps[_key2] = arguments[_key2];
    }

    return some(identity, maps) ? reduce(function (memo, map$$1) {
      return reduce(function (memo, pair) {
        var key = pair[0],
            value = pair[1];
        memo[key] = value;
        return memo;
      }, memo, seq(map$$1));
    }, {}, maps) : null;
  }

  function mergeWith(f) {
    for (var _len3 = arguments.length, maps = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      maps[_key3 - 1] = arguments[_key3];
    }

    return some(identity, maps) ? reduce(function (memo, map$$1) {
      return reduce(function (memo, pair) {
        var key = pair[0],
            value = pair[1];
        return contains(memo, key) ? update$1(memo, key, function (prior) {
          return f(prior, value);
        }) : assoc(memo, key, value);
      }, memo, seq(map$$1));
    }, {}, maps) : null;
  }

  function scanKey(better) {
    function scanKey2(k, x) {
      return x;
    }

    function scanKey3(k, x, y) {
      return better(k(x), k(y)) ? x : y;
    }

    function scanKeyN(k, x) {
      return apply$1(reduce, scanKey2, x, slice(arguments, 2));
    }

    return overload(null, null, scanKey2, scanKey3, scanKeyN);
  }

  var maxKey = scanKey(gt);
  var minKey = scanKey(lt);

  /*
  * Signals allow error handling to be handled as a separate (composable) concern rather than an integrated one.
  * Signals are transducer friendly.
  * When building an application from a signal graph there is a tendency to think that events are no longer relevant, that everything must be a signal, but this is inappropriate.  Both can be appropriate.  Use events when there is no reason for an initial value.
  */

  function duct(sink, xf, source) {
    var unsub = sub(source, partial(xf(pub), sink));
    return doto(sink, implement(IDisposable, { dispose: unsub }));
  }

  function signal2(xf, source) {
    return signal3(xf, null, source);
  }

  function signal3(xf, init, source) {
    return duct(observable(init), xf, source);
  }

  var signal = overload(null, null, signal2, signal3);

  function listen(el, key, callback) {
    el.addEventListener(key, callback);
    return function () {
      unlisten(el, key, callback);
    };
  }

  function unlisten(el, key, callback) {
    el.removeEventListener(key, callback);
  }

  function event3(el, key, init) {
    return event4(el, key, init, identity$1);
  }

  function event4(el, key, init, transform) {
    var unsub = null;
    function dispose$$1() {
      unsub && unsub();
      unsub = null;
    }
    var publ = subscriptionMonitor(publisher(), function (active) {
      dispose$$1();
      unsub = active ? listen(el, key, function (e) {
        pub(sink, transform(e));
      }) : null;
    });
    var sink = observable(init, publ);
    return doto(sink, implement(IDisposable, { dispose: dispose$$1 }));
  }

  var event = overload(null, null, null, event3, event4);

  function mousemove(el) {
    return event(el, "mousemove", [], function (e) {
      return [e.clientX, e.clientY];
    });
  }

  function keydown(document) {
    return event(document, "keydown", null);
  }

  function keyup(document) {
    return event(document, "keyup", null);
  }

  function keypress(document) {
    return event(document, "keypress", null);
  }

  function hashchange(window) {
    return event(window, "hashchange", "", function () {
      return location.hash;
    });
  }

  function change(el) {
    return event(el, "change", el.value, function () {
      return el.value;
    });
  }

  function input(el) {
    return event(el, "input", el.value, function () {
      return el.value;
    });
  }

  function focus(el) {
    return join(el === document.activeElement, event(el, "focus", null, constantly(true)), event(el, "blur", null, constantly(false)));
  }

  function calc(f) {
    var sink = observable(null),
        blank = {};
    var initialized = false,
        state = [];

    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    sources.forEach(function () {
      state.push(blank);
    });
    sources.forEach(function (source, idx) {
      sub(source, function (value) {
        state = slice(state);
        state[idx] = value;
        if (!initialized) {
          initialized = state.indexOf(blank) === -1;
        }
        if (initialized) {
          pub(sink, f.apply(null, state));
        }
      });
    });
    return sink;
  }

  function hist2(size, source) {
    var sink = observable([]);
    var history = [];
    sub(source, function (value) {
      history = slice(history);
      history.unshift(value);
      if (history.length > size) {
        history.pop();
      }
      pub(sink, history);
    });
    return sink;
  }

  var hist = overload(null, partial(hist2, 2), hist2);

  function join(init) {
    //TODO dispose
    var sink = observable(init || null),
        relay = partial(pub, sink);

    for (var _len2 = arguments.length, sources = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      sources[_key2 - 1] = arguments[_key2];
    }

    sources.forEach(function (source) {
      sub(source, relay);
    });
    return sink;
  }

  function fork(pred, inits, source) {
    var leftSink = observable(inits[0] || null),
        rightSink = observable(inits[1] || null);
    sub(source, function (value) {
      var sink = pred(value) ? leftSink : rightSink;
      pub(sink, value);
    });
    return [leftSink, rightSink];
  }

  function deferred(promise) {
    var sink = observable(null);
    Promise.resolve(promise).then(partial(pub, sink));
    return sink;
  }

  function expansive(f) {
    function expand() {
      for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
        xs[_key] = arguments[_key];
      }

      var contents = toArray$1(compact(flatten(xs)));
      return detect(function (content) {
        return typeof content === "function";
      }, contents) ? step$$1(contents) : f.apply(undefined, toConsumableArray(contents));
    }
    function step$$1(contents) {
      return function (value) {
        var resolve = typeof value === "function" ? partial(comp, value) : function (f) {
          return f(value);
        };
        return expand.apply(undefined, toConsumableArray(map(function (content) {
          return typeof content === "function" ? resolve(content) : content;
        }, contents)));
      };
    }
    return expand;
  }

  var tag = partially(expansive(function (name) {
    for (var _len2 = arguments.length, contents = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      contents[_key2 - 1] = arguments[_key2];
    }

    //partially guarantees calling tag always produces a factory
    return reduce(appendChild, document.createElement(name), contents);
  }));

  var frag = expansive(function () {
    for (var _len3 = arguments.length, contents = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      contents[_key3] = arguments[_key3];
    }

    return reduce(appendChild, document.createDocumentFragment(), contents);
  });

  var map$2 = overload(null, map$1, map);
  var take$2 = overload(null, take$1, take);
  var drop$2 = overload(null, drop$1, drop);
  var interpose$2 = overload(null, interpose$1, interpose);
  var filter$2 = overload(null, filter$1, filter);
  var keep$2 = overload(null, keep$1, keep);
  var mapIndexed$2 = overload(null, mapIndexed$1, mapIndexed);
  var keepIndexed$2 = overload(null, keepIndexed$1, keepIndexed);
  var remove$2 = overload(null, remove$1, remove);
  var takeWhile$2 = overload(null, takeWhile$1, takeWhile);
  var takeNth$2 = overload(null, takeNth$1, takeNth);
  var dropWhile$2 = overload(null, dropWhile$1, dropWhile);
  var compact$2 = overload(compact$1, compact);
  var dedupe$2 = overload(dedupe$1, dedupe);
  var distinct$2 = overload(distinct$1, distinct);
  var second = comp(first, next);

  /*
  export * from "./pointfree";
  import * as _ from "./pointfree";

  function checkStatus(resp){
    return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
  }

  export const request = _.chain(_.request,
    _.update("pre", _.prepend(function(params){
      return Object.assign({
        credentials: "same-origin",
        method: "GET",
        headers: {
          "Accept": "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose"
        }
      }, params);
    })),
    _.update("post",
      _.pipe(
        _.append(checkStatus),
        _.append(function(resp){
          return resp.json();
        }),
        _.append(_.getIn(["d", "results"])))));
  */

  exports.map = map$2;
  exports.take = take$2;
  exports.drop = drop$2;
  exports.interpose = interpose$2;
  exports.filter = filter$2;
  exports.keep = keep$2;
  exports.mapIndexed = mapIndexed$2;
  exports.keepIndexed = keepIndexed$2;
  exports.remove = remove$2;
  exports.takeWhile = takeWhile$2;
  exports.takeNth = takeNth$2;
  exports.dropWhile = dropWhile$2;
  exports.compact = compact$2;
  exports.dedupe = dedupe$2;
  exports.distinct = distinct$2;
  exports.second = second;
  exports.unbind = unbind;
  exports.log = log;
  exports.noop = noop;
  exports.counter = counter;
  exports.type = type$1;
  exports.overload = overload;
  exports.identity = identity$1;
  exports.constantly = constantly;
  exports.effect = effect;
  exports.doto = doto;
  exports.isInstance = isInstance;
  exports.ProtocolLookupError = ProtocolLookupError;
  exports.extend = extend;
  exports.mark = mark;
  exports.cease = cease;
  exports.implement = implement;
  exports.protocol = protocol;
  exports.satisfies = satisfies;
  exports.IArr = IArr;
  exports.toArray = toArray$1;
  exports.isArr = isArr;
  exports.IObj = IObj;
  exports.toObject = toObject;
  exports.isObj = isObj;
  exports.IAppendable = IAppendable;
  exports.append = append;
  exports.isAppendable = isAppendable;
  exports.IElementContent = IElementContent;
  exports.appendTo = appendTo;
  exports.isElementContent = isElementContent;
  exports.appendChild = appendChild;
  exports.IPrependable = IPrependable;
  exports.prepend = prepend;
  exports.isPrependable = isPrependable;
  exports.IInclusive = IInclusive;
  exports.includes = includes;
  exports.isInclusive = isInclusive;
  exports.ISeq = ISeq;
  exports.first = first;
  exports.rest = rest;
  exports.isSeq = isSeq;
  exports.ISeqable = ISeqable;
  exports.seq = seq;
  exports.isSeqable = isSeqable;
  exports.ICollection = ICollection;
  exports.conj = conj;
  exports.IEmptyableCollection = IEmptyableCollection;
  exports.empty = empty;
  exports.isEmptyableCollection = isEmptyableCollection;
  exports.ILookup = ILookup;
  exports.lookup = lookup;
  exports.IAssociative = IAssociative;
  exports.assoc = assoc;
  exports.contains = contains;
  exports.isAssociative = isAssociative;
  exports.INext = INext;
  exports.next = next;
  exports.IIndexed = IIndexed;
  exports.nth = nth;
  exports.isIndexed = isIndexed;
  exports.IShow = IShow;
  exports.show = show;
  exports.isShow = isShow;
  exports.IFn = IFn;
  exports.invoke = invoke;
  exports.isFn = isFn;
  exports.IDeref = IDeref;
  exports.deref = deref;
  exports.ICounted = ICounted;
  exports.count = count;
  exports.isCounted = isCounted;
  exports.IReduce = IReduce;
  exports.reduce = reduce;
  exports.IKVReduce = IKVReduce;
  exports.reducekv = reducekv;
  exports.IMap = IMap;
  exports.dissoc = dissoc;
  exports.isMap = isMap;
  exports.ISequential = ISequential;
  exports.isSequential = isSequential;
  exports.IComparable = IComparable;
  exports._compare = _compare;
  exports.isComparable = isComparable;
  exports.IPublish = IPublish;
  exports.pub = pub;
  exports.isPublish = isPublish;
  exports.ISubscribe = ISubscribe;
  exports.sub = sub;
  exports.isSubscribe = isSubscribe;
  exports.IReset = IReset;
  exports.reset = reset;
  exports.isReset = isReset;
  exports.ISwap = ISwap;
  exports.swap = swap;
  exports.isSwap = isSwap;
  exports.IRecord = IRecord;
  exports.isRecord = isRecord;
  exports.IDisposable = IDisposable;
  exports.dispose = dispose;
  exports.isDisposable = isDisposable;
  exports.ICloneable = ICloneable;
  exports.clone = clone;
  exports.isCloneable = isCloneable;
  exports.IFind = IFind;
  exports.find = find;
  exports.isFindable = isFindable;
  exports.IUnit = IUnit;
  exports.unit = unit;
  exports.isUnit = isUnit;
  exports.ISteppable = ISteppable;
  exports.step = step;
  exports.converse = converse;
  exports.isSteppable = isSteppable;
  exports.isBoolean = isBoolean;
  exports.not = not;
  exports.boolean = boolean;
  exports.bool = bool;
  exports.test = test;
  exports.comp = comp;
  exports.partial = partial;
  exports.partially = partially;
  exports.curry = curry;
  exports.juxt = juxt;
  exports.multimethod = multimethod;
  exports.complement = complement;
  exports.tap = tap;
  exports.see = see;
  exports.reversed = reversed;
  exports.subj = subj;
  exports.apply = apply$1;
  exports.spread = spread;
  exports.unspread = unspread;
  exports.nullary = nullary;
  exports.unary = unary;
  exports.binary = binary;
  exports.ternary = ternary;
  exports.quaternary = quaternary;
  exports.nary = nary;
  exports.arity = arity;
  exports.constructs = constructs$1;
  exports.isArray = isArray;
  exports.slice = slice;
  exports.array = array;
  exports.EMPTY_ARRAY = EMPTY_ARRAY;
  exports.selectKeys = selectKeys;
  exports.defaults = defaults$1;
  exports.branch3 = branch3;
  exports.branch4 = branch4;
  exports.branch = branch;
  exports.compile = compile;
  exports.EMPTY_OBJECT = EMPTY_OBJECT;
  exports.isString = isString;
  exports.isBlank = isBlank;
  exports.template = template;
  exports.inject = inject;
  exports.startsWith = startsWith;
  exports.endsWith = endsWith;
  exports.replace = replace$1;
  exports.subs = subs$1;
  exports.lowerCase = lowerCase;
  exports.upperCase = upperCase;
  exports.trim = trim;
  exports.str = str;
  exports.EMPTY_STRING = EMPTY_STRING;
  exports.int = int;
  exports.float = float;
  exports.number = number;
  exports.isNumber = isNumber;
  exports.isInteger = isInteger;
  exports.isInt = isInt;
  exports.isFloat = isFloat;
  exports.mod = mod;
  exports.add = add;
  exports.subtract = subtract;
  exports.multiply = multiply;
  exports.divide = divide;
  exports.inc = inc;
  exports.dec = dec;
  exports.isZero = isZero;
  exports.isPos = isPos;
  exports.isNeg = isNeg;
  exports.isOdd = isOdd;
  exports.isEven = isEven;
  exports.rand = rand;
  exports.randInt = randInt;
  exports.IndexedSeq = IndexedSeq;
  exports.indexedSeq = indexedSeq;
  exports.EMPTY = EMPTY;
  exports.juxts = juxts;
  exports.LazySeq = LazySeq;
  exports.lazySeq = lazySeq;
  exports.isNil = isNil;
  exports.isSome = isSome;
  exports.Nil = Nil;
  exports.nil = nil;
  exports.List = List;
  exports.cons = cons;
  exports.ObjectSelection = ObjectSelection;
  exports.objectSelection = objectSelection;
  exports.Concatenated = Concatenated;
  exports.concatenated = concatenated;
  exports.concat = concat;
  exports.duration = duration;
  exports.isDuration = isDuration;
  exports.milliseconds = milliseconds;
  exports.seconds = seconds;
  exports.minutes = minutes;
  exports.hours = hours;
  exports.days = days;
  exports.weeks = weeks;
  exports.time = time;
  exports.months = months;
  exports.years = years;
  exports.record = record$1;
  exports.observable = observable;
  exports.publisher = publisher;
  exports.subscriptionMonitor = subscriptionMonitor;
  exports.reducing = reducing;
  exports.Reduced = Reduced$1;
  exports.reduced = reduced;
  exports.isReduced = isReduced;
  exports.providePipeline = providePipeline;
  exports.Pipeline = Pipeline;
  exports.pipeline = pipeline;
  exports.provideAspectable = provideAspectable;
  exports.Aspectable = Aspectable;
  exports.provideConstructor = provideConstructor;
  exports.someFn = someFn;
  exports.isIdentical = isIdentical;
  exports.compare = compare$1;
  exports.lt = lt;
  exports.lte = lte;
  exports.gt = gt;
  exports.gte = gte;
  exports.eq = eq;
  exports.notEq = notEq;
  exports.equal = equal;
  exports.min = min;
  exports.max = max;
  exports.everyPred = everyPred;
  exports.transduce = transduce;
  exports.into = into;
  exports.each = each;
  exports.dorun = dorun;
  exports.doall = doall;
  exports.dotimes = dotimes;
  exports.proceed1 = proceed1;
  exports.proceed2 = proceed2;
  exports.proceed = proceed;
  exports.recede1 = recede1;
  exports.recede2 = recede2;
  exports.recede = recede;
  exports.isEmpty = isEmpty;
  exports.notEmpty = notEmpty;
  exports.some = some;
  exports.notSome = notSome;
  exports.notAny = notAny;
  exports.every = every;
  exports.notEvery = notEvery;
  exports.mapa = mapa;
  exports.indexed = indexed$1;
  exports.filtera = filtera;
  exports.dropLast = dropLast;
  exports.takeLast = takeLast;
  exports.interleaved = interleaved;
  exports.interleave = interleave;
  exports.partition = partition;
  exports.partitionAll1 = partitionAll1;
  exports.partitionAll2 = partitionAll2;
  exports.partitionAll3 = partitionAll3;
  exports.partitionAll = partitionAll;
  exports.partitionBy = partitionBy;
  exports.butlast = butlast;
  exports.last = last;
  exports.splitAt = splitAt;
  exports.splitWith = splitWith;
  exports.mapcat = mapcat;
  exports.sort = sort;
  exports.sortBy = sortBy;
  exports.groupBy = groupBy;
  exports.doseqN = doseqN;
  exports.doseq = doseq;
  exports.coalesce = coalesce;
  exports.detect = detect;
  exports.repeatedly = repeatedly;
  exports.repeat = repeat;
  exports.iterate = iterate$1;
  exports.integers = integers;
  exports.range = range;
  exports.cycle = cycle;
  exports.treeSeq = treeSeq;
  exports.flatten = flatten;
  exports.isDistinct = isDistinct;
  exports.randNth = randNth;
  exports.shuffle = shuffle;
  exports.get = get$2;
  exports.getIn = getIn;
  exports.assocIn = assocIn;
  exports.update = update$1;
  exports.updateIn = updateIn;
  exports.merge = merge;
  exports.mergeWith = mergeWith;
  exports.scanKey = scanKey;
  exports.maxKey = maxKey;
  exports.minKey = minKey;
  exports.either = either;
  exports.option = option;
  exports.future = future;
  exports.logged = logged;
  exports.chained = chained;
  exports.piped = piped;
  exports.chain = chain;
  exports.maybe = maybe;
  exports.pipe = pipe;
  exports.opt = opt;
  exports.prom = prom;
  exports.handle = handle;
  exports.aspectable = aspectable;
  exports.request = request;
  exports.signal = signal;
  exports.listen = listen;
  exports.unlisten = unlisten;
  exports.event3 = event3;
  exports.event4 = event4;
  exports.event = event;
  exports.mousemove = mousemove;
  exports.keydown = keydown;
  exports.keyup = keyup;
  exports.keypress = keypress;
  exports.hashchange = hashchange;
  exports.change = change;
  exports.input = input;
  exports.focus = focus;
  exports.calc = calc;
  exports.hist = hist;
  exports.join = join;
  exports.fork = fork;
  exports.deferred = deferred;
  exports.expansive = expansive;
  exports.tag = tag;
  exports.frag = frag;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
