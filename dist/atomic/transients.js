import * as _ from './core.js';
import { protocol } from './core.js';

const IPersistent = _.protocol({
  persistent: null
});

const persistent$2 = IPersistent.persistent;

const ITransient = _.protocol({
  transient: null
});

const transient = ITransient.transient;

const ITransientAssociative = _.protocol({
  assoc: null
});

const assoc$3 = ITransientAssociative.assoc;

const ITransientMap = _.protocol({
  dissoc: null
});

const dissoc$3 = ITransientMap.dissoc;

const ITransientSet = _.protocol({
  disj: null
});

const disj$1 = ITransientSet.disj;

const ITransientCollection = _.protocol({
  conj: null,
  unconj: null
});

const conj$2 = _.overload(null, _.noop, ITransientCollection.conj, _.doing(ITransientCollection.conj));
const unconj$1 = _.overload(null, _.noop, ITransientCollection.unconj, _.doing(ITransientCollection.unconj));

const ITransientEmptyableCollection = _.protocol({
  empty: null
});

const empty$3 = ITransientEmptyableCollection.empty;

const ITransientAppendable = _.protocol({
  append: null
});

const append$1 = _.overload(null, _.noop, ITransientAppendable.append, _.doing(ITransientAppendable.append));

const ITransientPrependable = protocol({
  prepend: null
});

const prepend$1 = _.overload(null, _.noop, ITransientPrependable.prepend, _.doing(ITransientPrependable.prepend, _.reverse));

const ITransientOmissible = _.protocol({
  omit: null
});

const omit$1 = ITransientOmissible.omit;

const ITransientInsertable = _.protocol({
  before: null,
  after: null
});

function afterN(self, ...els) {
  let ref = self;

  while (els.length) {
    let el = els.shift();
    ITransientInsertable.after(ref, el);
    ref = el;
  }
}

const after$1 = _.overload(null, _.noop, ITransientInsertable.after, afterN);

function beforeN(self, ...els) {
  let ref = self;

  while (els.length) {
    let el = els.pop();
    ITransientInsertable.before(ref, el);
    ref = el;
  }
}

const before$1 = _.overload(null, _.noop, ITransientInsertable.before, beforeN);

const ITransientReversible = _.protocol({
  reverse: null
});

const reverse$1 = ITransientReversible.reverse;

function TransientArray(arr) {
  this.arr = arr;
}
TransientArray.prototype[Symbol.toStringTag] = "TransientArray";
function transientArray(arr) {
  return new TransientArray(arr);
}

function transition(construct) {

  function transient(self) {
    return construct(_.clone(self));
  }

  return _.does(_.implement(ITransient, {
    transient
  }));
}

function before(self, reference, inserted) {
  const pos = self.arr.indexOf(reference);
  pos === -1 || self.arr.splice(pos, 0, inserted);
}

function after(self, reference, inserted) {
  const pos = self.arr.indexOf(reference);
  pos === -1 || self.arr.splice(pos + 1, 0, inserted);
}

function seq$1(self) {
  return self.arr.length ? self : null;
}

function append(self, value) {
  self.arr.push(value);
}

function prepend(self, value) {
  self.arr.unshift(value);
}

function unconj(self, value) {
  const pos = self.arr.lastIndexOf(value);

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

function assoc$2(self, idx, value) {
  self.arr[idx] = value;
}

function dissoc$2(self, idx) {
  self.arr.splice(idx, 1);
}

function omit(self, value) {
  let pos;

  while ((pos = self.arr.indexOf(value)) > -1) {
    self.arr.splice(pos, 1);
  }
}

function clone$2(self) {
  return new self.constructor(_.clone(self.arr));
}

function persistent$1(self) {
  const arr = self.arr;
  delete self.arr;
  return arr;
}

var behave$4 = _.does(_.keying("TransientArray"), transition(transientArray), _.forward("arr", _.IFind, _.IMapEntry, _.IAssociative, _.IMap, _.ICoercible, _.ILookup, _.IReducible, _.IKVReducible, _.IFunctor, _.IInclusive, _.ICounted, _.ISeq, _.INext), _.implement(_.ISequential), _.implement(_.IClonable, {
  clone: clone$2
}), _.implement(_.ISeqable, {
  seq: seq$1
}), _.implement(IPersistent, {
  persistent: persistent$1
}), _.implement(ITransientInsertable, {
  before,
  after
}), _.implement(ITransientCollection, {
  conj: append,
  unconj
}), _.implement(ITransientEmptyableCollection, {
  empty: empty$2
}), _.implement(ITransientOmissible, {
  omit
}), _.implement(ITransientAssociative, {
  assoc: assoc$2
}), _.implement(ITransientReversible, {
  reverse
}), _.implement(ITransientMap, {
  dissoc: dissoc$2
}), _.implement(ITransientAppendable, {
  append
}), _.implement(ITransientPrependable, {
  prepend
}));

behave$4(TransientArray);

function TransientObject(obj) {
  this.obj = obj;
}
TransientObject.prototype[Symbol.toStringTag] = "TransientObject";
function transientObject(obj) {
  return new TransientObject(obj);
}

function conj$1(self, entry) {
  const key = _.key(entry),
        val = _.val(entry);

  self.obj[key] = val;
}

function dissoc$1(self, key) {
  if (_.contains(self, key)) {
    delete self.obj[key];
  }
}

function assoc$1(self, key, value) {
  if (!_.contains(self, key) || !_.equiv(_.get(self, key), value)) {
    self.obj[key] = value;
  }
}

function clone$1(self) {
  return new self.constructor(_.clone(self.obj));
}

function compare(a, b) {
  return _.compare(a.obj, b == null ? null : b.obj);
}

function equiv(a, b) {
  return _.equiv(a.obj, b == null ? null : b.obj);
}

function empty$1(self) {
  self.obj = {};
}

function persistent(self) {
  const obj = self.obj;
  delete self.obj;
  return obj;
}

var behave$3 = _.does(_.keying("TransientObject"), transition(transientObject), _.forward("obj", _.IMap, _.IFind, _.IInclusive, _.ILookup, _.ISeq, _.INext, _.IAssociative, _.ISeqable, _.ICounted, _.IReducible, _.IKVReducible, _.ICoercible), _.implement(_.IComparable, {
  compare
}), _.implement(_.IFn, {
  invoke: _.get
}), _.implement(_.IClonable, {
  clone: clone$1
}), _.implement(_.IEquiv, {
  equiv
}), _.implement(IPersistent, {
  persistent
}), _.implement(ITransientCollection, {
  conj: conj$1
}), _.implement(ITransientEmptyableCollection, {
  empty: empty$1
}), _.implement(ITransientAssociative, {
  assoc: assoc$1
}), _.implement(ITransientMap, {
  dissoc: dissoc$1
}));

behave$3(TransientObject);

function isMap(self) {
  return _.is(self, Map);
}

function map1(obj) {
  return new Map(obj);
}

function map0() {
  return new Map();
}

const map = _.overload(map0, map1);

function assoc(self, key, value) {
  self.set(key, value);
}

function dissoc(self, key, value) {
  self.delete(key, value);
}

function contains(self, key) {
  return self.has(key);
}

function lookup(self, key) {
  return self.get(key);
}

function count$1(self) {
  return self.size;
}

var behave$2 = _.does(_.keying("Map"), _.implement(_.ICounted, {
  count: count$1
}), _.implement(_.ILookup, {
  lookup
}), _.implement(_.IAssociative, {
  contains
}), _.implement(ITransientMap, {
  dissoc
}), _.implement(ITransientAssociative, {
  assoc
}));

const behaviors = {};

Object.assign(behaviors, {
  Map: behave$2
});
behave$2(Map);

function set(entries) {
  return new Set(entries || []);
}
function emptySet() {
  return new Set();
}

function seq(self) {
  return count(self) ? self : null;
}

function empty(self) {
  self.clear();
}

function disj(self, value) {
  self.delete(value);
}

function includes(self, value) {
  return self.has(value);
}

function conj(self, value) {
  self.add(value);
}

function first(self) {
  return self.values().next().value;
}

function rest(self) {
  const iter = self.values();
  iter.next();
  return _.lazyIterable(iter);
}

function next(self) {
  const iter = self.values();
  iter.next();
  return _.lazyIterable(iter, null);
}

function count(self) {
  return self.size;
}

function clone(self) {
  return new self.constructor(_.toArray(self));
}

function reduce(self, f, init) {
  let memo = init;
  let coll = seq(self);

  while (coll) {
    memo = f(memo, first(coll));
    coll = next(coll);
  }

  return _.unreduced(memo);
}

var behave$1 = _.does(_.keying("Set"), _.implement(_.ISequential), _.implement(_.IReducible, {
  reduce
}), _.implement(_.ISeqable, {
  seq
}), _.implement(_.IInclusive, {
  includes
}), _.implement(_.IClonable, {
  clone
}), _.implement(_.ICounted, {
  count
}), _.implement(_.INext, {
  next
}), _.implement(_.ISeq, {
  first,
  rest
}), _.implement(ITransientEmptyableCollection, {
  empty
}), _.implement(ITransientCollection, {
  conj
}), _.implement(ITransientSet, {
  disj
})); //TODO unite

Object.assign(behaviors, {
  Set: behave$1
});
behave$1(Set);

function isWeakMap(self) {
  return _.is(self, WeakMap);
}

function weakMap1(obj) {
  return new WeakMap(obj);
}

function weakMap0() {
  return new WeakMap();
}

const weakMap = _.overload(weakMap0, weakMap1);

var behave = _.does(behave$2, _.keying("WeakMap"));

Object.assign(behaviors, {
  WeakMap: behave
});
behave(WeakMap);

_.ICoercible.addMethod([TransientObject, Object], function (self) {
  return self.obj;
});

_.ICoercible.addMethod([TransientArray, Array], function (self) {
  return self.arr;
});

_.ICoercible.addMethod([Set, Array], Array.from);

export { IPersistent, ITransient, ITransientAppendable, ITransientAssociative, ITransientCollection, ITransientEmptyableCollection, ITransientInsertable, ITransientMap, ITransientOmissible, ITransientPrependable, ITransientReversible, ITransientSet, TransientArray, TransientObject, after$1 as after, append$1 as append, assoc$3 as assoc, before$1 as before, conj$2 as conj, disj$1 as disj, dissoc$3 as dissoc, empty$3 as empty, emptySet, isMap, isWeakMap, map, omit$1 as omit, persistent$2 as persistent, prepend$1 as prepend, reverse$1 as reverse, set, transient, transientArray, transientObject, unconj$1 as unconj, weakMap };
