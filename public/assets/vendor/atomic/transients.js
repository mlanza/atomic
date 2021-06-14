define(['exports', 'atomic/core', 'set'], function (exports, _, Set) { 'use strict';

  var IPersistent = _.protocol({
    persistent: null
  });

  var ITransient = _.protocol({
    "transient": null
  });

  var ITransientCollection = _.protocol({
    conj: null,
    unconj: null
  });

  var ITransientEmptyableCollection = _.protocol({
    empty: null
  });

  var ITransientAssociative = _.protocol({
    assoc: null
  });

  var ITransientMap = _.protocol({
    dissoc: null
  });

  var ITransientSet = _.protocol({
    disj: null
  });

  var ITransientAppendable = _.protocol({
    append: null
  });

  var ITransientPrependable = _.protocol({
    prepend: null
  });

  var ITransientYankable = _.protocol({
    yank: null
  });

  var ITransientInsertable = _.protocol({
    before: null,
    after: null
  });

  var ITransientReversible = _.protocol({
    reverse: null
  });

  var persistent$2 = IPersistent.persistent;

  var _transient = ITransient["transient"];

  var assoc$2 = ITransientAssociative.assoc;

  var dissoc$2 = ITransientMap.dissoc;

  var disj$1 = ITransientSet.disj;

  var conj$3 = _.overload(null, _.noop, ITransientCollection.conj, _.doing(ITransientCollection.conj));
  var unconj$1 = _.overload(null, _.noop, ITransientCollection.unconj, _.doing(ITransientCollection.unconj));

  var empty$3 = ITransientEmptyableCollection.empty;

  var append$1 = _.overload(null, _.noop, ITransientAppendable.append, _.doing(ITransientAppendable.append));

  var prepend$1 = _.overload(null, _.noop, ITransientPrependable.prepend, _.doing(ITransientPrependable.prepend, _.reverse));

  var yank$1 = ITransientYankable.yank;

  function afterN(self) {
    var ref = self;

    for (var _len = arguments.length, els = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      els[_key - 1] = arguments[_key];
    }

    while (els.length) {
      var el = els.shift();
      ITransientInsertable.after(ref, el);
      ref = el;
    }
  }

  var after$1 = _.overload(null, _.noop, ITransientInsertable.after, afterN);

  function beforeN(self) {
    var ref = self;

    for (var _len2 = arguments.length, els = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      els[_key2 - 1] = arguments[_key2];
    }

    while (els.length) {
      var el = els.pop();
      ITransientInsertable.before(ref, el);
      ref = el;
    }
  }

  var before$1 = _.overload(null, _.noop, ITransientInsertable.before, beforeN);

  var reverse$1 = ITransientReversible.reverse;

  function TransientArray(arr) {
    this.arr = arr;
  }
  function transientArray(arr) {
    return new TransientArray(arr);
  }

  function before(self, reference, inserted) {
    var pos = self.arr.indexOf(reference);
    pos === -1 || self.arr.splice(pos, 0, inserted);
  }

  function after(self, reference, inserted) {
    var pos = self.arr.indexOf(reference);
    pos === -1 || self.arr.splice(pos + 1, 0, inserted);
  }

  function seq$2(self) {
    return self.arr.length ? self : null;
  }

  function append(self, value) {
    self.arr.push(value);
  }

  function prepend(self, value) {
    self.arr.unshift(value);
  }

  function unconj(self, value) {
    var pos = self.arr.lastIndexOf(value);

    if (pos > -1) {
      self.arr.splice(pos, 1);
    }
  }

  function empty$2(self) {
    self.arr = [];
  }

  function reverse(self) {
    self.arr.reverse();
  }

  function assoc$1(self, idx, value) {
    self.arr[idx] = value;
  }

  function dissoc$1(self, idx) {
    self.arr.splice(idx, 1);
  }

  function yank(self, value) {
    var pos;

    while ((pos = self.arr.indexOf(value)) > -1) {
      self.arr.splice(pos, 1);
    }
  }

  function clone$2(self) {
    return new self.constructor(_.ICloneable.clone(self.arr));
  }

  function persistent$1(self) {
    var arr = self.arr;
    delete self.arr;
    return arr;
  }

  var forward$1 = _.forwardTo("arr");
  var find$1 = forward$1(_.IFind.find);
  var key = forward$1(_.IMapEntry.key);
  var val = forward$1(_.IMapEntry.val);
  var contains$1 = forward$1(_.IAssociative.contains);
  var keys$1 = forward$1(_.IMap.keys);
  var vals$1 = forward$1(_.IMap.vals);
  var toObject$1 = forward$1(_.ICoerceable.toObject);
  var lookup$1 = forward$1(_.ILookup.lookup);
  var reduce$2 = forward$1(_.IReduce.reduce);
  var reducekv$1 = forward$1(_.IKVReduce.reducekv);
  var fmap = forward$1(_.IFunctor.fmap);
  forward$1(_.IInclusive.includes);
  var count$2 = forward$1(_.ICounted.count);
  var first$2 = forward$1(_.ISeq.first);
  var rest$2 = forward$1(_.ISeq.rest);
  var next$2 = forward$1(_.INext.next);
  var behaveAsTransientArray = _.does(_.implement(_.ISequential), _.implement(_.ICloneable, {
    clone: clone$2
  }), _.implement(IPersistent, {
    persistent: persistent$1
  }), _.implement(_.ISeqable, {
    seq: seq$2
  }), _.implement(_.ISeq, {
    first: first$2,
    rest: rest$2
  }), _.implement(_.INext, {
    next: next$2
  }), _.implement(_.ICounted, {
    count: count$2
  }), _.implement(ITransientInsertable, {
    before: before,
    after: after
  }), _.implement(ITransientCollection, {
    conj: append,
    unconj: unconj
  }), _.implement(ITransientEmptyableCollection, {
    empty: empty$2
  }), _.implement(_.IFind, {
    find: find$1
  }), _.implement(ITransientYankable, {
    yank: yank
  }), _.implement(_.IMapEntry, {
    key: key,
    val: val
  }), _.implement(_.ILookup, {
    lookup: lookup$1
  }), _.implement(_.IAssociative, {
    contains: contains$1
  }), _.implement(ITransientAssociative, {
    assoc: assoc$1
  }), _.implement(ITransientReversible, {
    reverse: reverse
  }), _.implement(ITransientMap, {
    dissoc: dissoc$1
  }), _.implement(_.IMap, {
    keys: keys$1,
    vals: vals$1
  }), _.implement(_.ICoerceable, {
    toObject: toObject$1
  }), _.implement(_.IReduce, {
    reduce: reduce$2
  }), _.implement(_.IKVReduce, {
    reducekv: reducekv$1
  }), _.implement(ITransientAppendable, {
    append: append
  }), _.implement(ITransientPrependable, {
    prepend: prepend
  }), _.implement(_.IFunctor, {
    fmap: fmap
  }));

  behaveAsTransientArray(TransientArray);

  function TransientObject(obj) {
    this.obj = obj;
  }
  function transientObject(obj) {
    return new TransientObject(obj);
  }

  function conj$2(self, entry) {
    var key = _.IMapEntry.key(entry),
        val = _.IMapEntry.val(entry);
    self.obj[key] = val;
  }

  function dissoc(self, key) {
    if (contains(self, key)) {
      delete self.obj[key];
    }
  }

  function assoc(self, key, value) {
    if (!contains(self, key) || !_.IEquiv.equiv(lookup(self, key), value)) {
      self.obj[key] = value;
    }
  }

  function clone$1(self) {
    return transientObject(_.ICloneable.clone(self.obj));
  }

  function compare(a, b) {
    return _.IComparable.compare(a.obj, b == null ? null : b.obj);
  }

  function equiv(a, b) {
    return _.IEquiv.equiv(a.obj, b == null ? null : b.obj);
  }

  function toObject(self) {
    return self.obj;
  }

  function empty$1(self) {
    self.obj = {};
  }

  function persistent(self) {
    var obj = self.obj;
    delete self.obj;
    return obj;
  }

  var forward = _.forwardTo("obj");
  var keys = forward(_.IMap.keys);
  var vals = forward(_.IMap.vals);
  var matches$1 = forward(_.IMatchable.matches);
  var find = forward(_.IFind.find);
  var includes$1 = forward(_.IInclusive.includes);
  var lookup = forward(_.ILookup.lookup);
  var first$1 = forward(_.ISeq.first);
  var rest$1 = forward(_.ISeq.rest);
  var next$1 = forward(_.INext.next);
  var contains = forward(_.IAssociative.contains);
  var seq$1 = forward(_.ISeqable.seq);
  var count$1 = forward(_.ICounted.count);
  var reduce$1 = forward(_.IReduce.reduce);
  var reducekv = forward(_.IKVReduce.reducekv);
  var toArray$1 = forward(_.ICoerceable.toArray);
  var behaveAsTransientObject = _.does(_.implement(_.IDescriptive), _.implement(IPersistent, {
    persistent: persistent
  }), _.implement(ITransientCollection, {
    conj: conj$2
  }), _.implement(_.IComparable, {
    compare: compare
  }), _.implement(ITransientEmptyableCollection, {
    empty: empty$1
  }), _.implement(_.ICoerceable, {
    toArray: toArray$1,
    toObject: toObject
  }), _.implement(_.IFn, {
    invoke: lookup
  }), _.implement(_.IReduce, {
    reduce: reduce$1
  }), _.implement(_.IKVReduce, {
    reducekv: reducekv
  }), _.implement(_.ICounted, {
    count: count$1
  }), _.implement(_.ICloneable, {
    clone: clone$1
  }), _.implement(_.ISeqable, {
    seq: seq$1
  }), _.implement(_.ISeq, {
    first: first$1,
    rest: rest$1
  }), _.implement(_.INext, {
    next: next$1
  }), _.implement(_.IFind, {
    find: find
  }), _.implement(_.ILookup, {
    lookup: lookup
  }), _.implement(_.IAssociative, {
    contains: contains
  }), _.implement(ITransientAssociative, {
    assoc: assoc
  }), _.implement(_.IInclusive, {
    includes: includes$1
  }), _.implement(_.IEquiv, {
    equiv: equiv
  }), _.implement(_.IMap, {
    keys: keys,
    vals: vals
  }), _.implement(ITransientMap, {
    dissoc: dissoc
  }), _.implement(_.IMatchable, {
    matches: matches$1
  }));

  behaveAsTransientObject(TransientObject);

  var TransientSet = Set;
  function transientSet(entries) {
    return new TransientSet(entries || []);
  }
  function emptyTransientSet() {
    return new TransientSet();
  }

  function seq(self) {
    return count(self) ? self : null;
  }

  function empty(self) {
    self.clear();
  }

  function disj(self, value) {
    self["delete"](value);
  }

  function includes(self, value) {
    return self.has(value);
  }

  function conj$1(self, value) {
    self.add(value);
  }

  function first(self) {
    return self.values().next().value;
  }

  function rest(self) {
    var iter = self.values();
    iter.next();
    return _.lazyIterable(iter);
  }

  function next(self) {
    var iter = self.values();
    iter.next();
    return _.lazyIterable(iter, null);
  }

  function count(self) {
    return self.size;
  }

  var toArray = Array.from;

  function clone(self) {
    return transientSet(toArray(self));
  }

  function reduce(self, xf, init) {
    var memo = init;
    var coll = seq(self);

    while (coll) {
      memo = xf(memo, first(coll));
      coll = next(coll);
    }

    return _.unreduced(memo);
  }

  var behaveAsTransientSet = _.does(_.implement(_.ISequential), _.implement(ITransientCollection, {
    conj: conj$1
  }), _.implement(ITransientSet, {
    disj: disj
  }), //TODO unite
  _.implement(_.IReduce, {
    reduce: reduce
  }), _.implement(_.ICoerceable, {
    toArray: toArray
  }), _.implement(_.ISeqable, {
    seq: seq
  }), _.implement(_.IInclusive, {
    includes: includes
  }), _.implement(_.ICloneable, {
    clone: clone
  }), _.implement(ITransientEmptyableCollection, {
    empty: empty
  }), _.implement(_.ICounted, {
    count: count
  }), _.implement(_.INext, {
    next: next
  }), _.implement(_.ISeq, {
    first: first,
    rest: rest
  }));

  behaveAsTransientSet(TransientSet);

  function Method(pred, f) {
    this.pred = pred;
    this.f = f;
  }
  function method(pred, f) {
    return new Method(pred, f);
  }

  function invoke$1(self, args) {
    return _.apply(self.f, args);
  }

  function matches(self, args) {
    return _.apply(self.pred, args);
  }

  var behaveAsMethod = _.does(_.implement(_.IMatchable, {
    matches: matches
  }), _.implement(_.IFn, {
    invoke: invoke$1
  }));

  behaveAsMethod(Method);

  function surrogate(f, substitute) {
    return function (self) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      f.apply(null, [substitute].concat(args));
      return self;
    };
  }

  function Multimethod(methods, fallback) {
    this.methods = methods;
    this.fallback = fallback;
  }
  function multimethod(fallback) {
    var instance = new Multimethod([], fallback),
        fn = _.partial(_.IFn.invoke, instance),
        conj = surrogate(ITransientCollection.conj, instance);
    return _.doto(fn, _.specify(ITransientCollection, {
      conj: conj
    }));
  }

  function conj(self, method) {
    self.methods.push(method);
  }

  function invoke(self) {
    var _args, _matches;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var method = _.detect((_matches = _.matches, _args = args, function matches(_argPlaceholder) {
      return _matches(_argPlaceholder, _args);
    }), self.methods);

    if (method) {
      return _.IFn.invoke(method, args);
    } else if (self.fallback) {
      return self.fallback.apply(self, args);
    } else {
      throw new Error("No handler for these args.");
    }
  }

  var behaveAsMultimethod = _.does(_.implement(_.IFn, {
    invoke: invoke
  }), _.implement(ITransientCollection, {
    conj: conj
  }));

  behaveAsMultimethod(Multimethod);

  function toTransient(Type, construct) {
    function _transient(self) {
      return construct(_.clone(self));
    }

    _.doto(Type, _.implement(ITransient, {
      "transient": _transient
    }));
  }

  toTransient(Object, transientObject);
  toTransient(Array, transientArray);
  toTransient(Set, transientSet);
  function withMutations(self, f) {
    return IPersistent.persistent(f(ITransient["transient"](self)));
  }

  exports.IPersistent = IPersistent;
  exports.ITransient = ITransient;
  exports.ITransientAppendable = ITransientAppendable;
  exports.ITransientAssociative = ITransientAssociative;
  exports.ITransientCollection = ITransientCollection;
  exports.ITransientEmptyableCollection = ITransientEmptyableCollection;
  exports.ITransientInsertable = ITransientInsertable;
  exports.ITransientMap = ITransientMap;
  exports.ITransientPrependable = ITransientPrependable;
  exports.ITransientReversible = ITransientReversible;
  exports.ITransientSet = ITransientSet;
  exports.ITransientYankable = ITransientYankable;
  exports.Method = Method;
  exports.Multimethod = Multimethod;
  exports.TransientArray = TransientArray;
  exports.TransientObject = TransientObject;
  exports.TransientSet = TransientSet;
  exports.after = after$1;
  exports.append = append$1;
  exports.assoc = assoc$2;
  exports.before = before$1;
  exports.conj = conj$3;
  exports.disj = disj$1;
  exports.dissoc = dissoc$2;
  exports.empty = empty$3;
  exports.emptyTransientSet = emptyTransientSet;
  exports.method = method;
  exports.multimethod = multimethod;
  exports.persistent = persistent$2;
  exports.prepend = prepend$1;
  exports.reverse = reverse$1;
  exports.transient = _transient;
  exports.transientArray = transientArray;
  exports.transientObject = transientObject;
  exports.transientSet = transientSet;
  exports.unconj = unconj$1;
  exports.withMutations = withMutations;
  exports.yank = yank$1;

  Object.defineProperty(exports, '__esModule', { value: true });

});
