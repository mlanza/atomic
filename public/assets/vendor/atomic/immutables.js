define(['exports', 'atomic/core', 'atomic/transients', 'immutable', 'symbol'], function (exports, _$1, mut, imm, _Symbol) { 'use strict';

  function set(coll) {
    return coll instanceof imm.Set ? coll : new imm.Set(_$1.ICoerceable.toArray(coll));
  }
  function emptySet() {
    return new imm.Set();
  }

  function map(obj) {
    return obj instanceof imm.Map ? obj : new imm.Map(obj);
  }

  var IHash = _$1.protocol({
    //hashing is an algorithm for improved immutable lookup and is not intended for mutables.
    hash: null
  });

  function list(obj) {
    return obj instanceof imm.List ? obj : new imm.List(obj);
  }

  function equiv$1(self, other) {
    return self.equals(other);
  }

  function includes$1(self, value) {
    return self.includes(value);
  }

  function lookup$1(self, idx) {
    return self.get(idx);
  }

  function assoc$1(self, idx, value) {
    return self.set(idx, value);
  }

  function contains$1(self, idx) {
    return self.has(idx);
  }

  function conj$1(self, value) {
    return self.push(value);
  }

  function first$3(self) {
    return self.first();
  }

  function rest$3(self) {
    return self.rest();
  }

  function next$3(self) {
    return _$1.ISeqable.seq(_$1.ISeq.rest(self));
  }

  function empty(self) {
    return self.clear();
  }

  function count$2(self) {
    return self.count();
  }

  function seq$2(self) {
    return self.size ? self : null;
  }

  function toArray$2(self) {
    return self.toArray();
  }

  function reduce$1(self, xf, init) {
    var memo = init;
    var coll = seq$2(self);

    while (coll) {
      memo = xf(memo, first$3(coll));
      coll = next$3(coll);
    }

    return _$1.unreduced(memo);
  }

  function merge$2(self, other) {
    return reduce$1(other, _.conj, self);
  }

  var behaveAsList = _$1.does(_$1.iterable, _$1.implement(_$1.IEquiv, {
    equiv: equiv$1
  }), _$1.implement(_$1.IInclusive, {
    includes: includes$1
  }), _$1.implement(_$1.IAssociative, {
    assoc: assoc$1,
    contains: contains$1
  }), _$1.implement(_$1.ILookup, {
    lookup: lookup$1
  }), _$1.implement(_$1.IReduce, {
    reduce: reduce$1
  }), _$1.implement(_$1.INext, {
    next: next$3
  }), _$1.implement(_$1.ICoerceable, {
    toArray: toArray$2
  }), _$1.implement(_$1.IMergeable, {
    merge: merge$2
  }), _$1.implement(_$1.IEmptyableCollection, {
    empty: empty
  }), _$1.implement(_$1.ICloneable, {
    clone: _$1.identity
  }), _$1.implement(_$1.ISeqable, {
    seq: seq$2
  }), _$1.implement(_$1.ICounted, {
    count: count$2
  }), _$1.implement(_$1.ICollection, {
    conj: conj$1
  }), _$1.implement(_$1.ISeq, {
    first: first$3,
    rest: rest$3
  }));

  behaveAsList(imm.List);

  function assoc(self, key, value) {
    return self.set(key, value);
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

  function keys(self) {
    return _$1.lazyIterable(self.keys());
  }

  function vals(self) {
    return _$1.lazyIterable(self.values());
  }

  function dissoc(self, key) {
    return self.remove(self, key);
  }

  function reducekv(self, xf, init) {
    return _$1.IReduce.reduce(keys(self), function (memo, key) {
      return xf(memo, key, lookup(self, key));
    }, init);
  }

  function toArray$1(self) {
    return self.toArray();
  }

  function merge$1(self, other) {
    return reducekv(other, _.assoc, self);
  }

  function seq$1(self) {
    return self.size ? _$1.lazyIterable(self.entries()) : null;
  }

  function first$2(self) {
    return _$1.ISeq.first(seq$1(self));
  }

  function rest$2(self) {
    return _$1.ISeq.rest(_$1.ISeqable.seq(self));
  }

  function next$2(self) {
    return _$1.ISeqable.seq(_$1.ISeq.rest(self));
  }

  var behaveAsMap = _$1.does(_$1.iterable, _$1.implement(_$1.IKVReduce, {
    reducekv: reducekv
  }), _$1.implement(_$1.ICoerceable, {
    toArray: toArray$1
  }), _$1.implement(_$1.IMergeable, {
    merge: merge$1
  }), _$1.implement(_$1.INext, {
    next: next$2
  }), _$1.implement(_$1.ISeq, {
    first: first$2,
    rest: rest$2
  }), _$1.implement(_$1.ISeqable, {
    seq: seq$1
  }), _$1.implement(_$1.IMap, {
    keys: keys,
    vals: vals,
    dissoc: dissoc
  }), _$1.implement(_$1.ICloneable, {
    clone: _$1.identity
  }), _$1.implement(_$1.ICounted, {
    count: count$1
  }), _$1.implement(_$1.ILookup, {
    lookup: lookup
  }), _$1.implement(_$1.IAssociative, {
    assoc: assoc,
    contains: contains
  }));

  behaveAsMap(imm.Map);

  function distinct2(coll, seen) {
    return _$1.seq(coll) ? _$1.lazySeq(function () {
      var xs = coll;

      while (_$1.seq(xs)) {
        var x = _$1.first(xs);
        xs = _$1.rest(xs);

        if (!_$1.includes(seen, x)) {
          return _$1.cons(x, distinct2(xs, _$1.conj(seen, x)));
        }
      }

      return _$1.emptyList();
    }) : _$1.emptyList();
  }

  function distinct(coll) {
    return distinct2(coll, set());
  }

  function _transient(self) {
    return mut.transientSet(toArray(self));
  }

  function seq(self) {
    return count(self) ? self : null;
  }

  function toArray(self) {
    return self.toArray();
  }

  function includes(self, value) {
    return self.has(value);
  }

  function conj(self, value) {
    return self.add(value);
  }

  function disj(self, value) {
    return self["delete"](value);
  }

  function first$1(self) {
    return self.first();
  }

  function rest$1(self) {
    var tail = self.rest();
    return tail.size > 0 ? tail : emptySet();
  }

  function next$1(self) {
    var tail = self.rest();
    return tail.size > 0 ? tail : null;
  }

  function count(self) {
    return self.size;
  }

  function reduce(self, xf, init) {
    var memo = init;
    var coll = seq(self);

    while (coll) {
      memo = xf(memo, first$1(coll));
      coll = next$1(coll);
    }

    return _$1.unreduced(memo);
  }

  function merge(self, other) {
    return reduce(other, _.conj, self);
  }

  function equiv(self, other) {
    return _$1.ICounted.count(_$1.union(self, other)) === _$1.ICounted.count(self);
  }

  var behaveAsSet = _$1.does(_$1.iterable, _$1.implement(_$1.ISequential), _$1.implement(_$1.IEquiv, {
    equiv: equiv
  }), _$1.implement(_$1.IAssociative, {
    contains: includes
  }), _$1.implement(_$1.IMergeable, {
    merge: merge
  }), _$1.implement(mut.ITransient, {
    "transient": _transient
  }), _$1.implement(_$1.IReduce, {
    reduce: reduce
  }), _$1.implement(_$1.ICoerceable, {
    toArray: toArray
  }), _$1.implement(_$1.ISeqable, {
    seq: seq
  }), _$1.implement(_$1.IInclusive, {
    includes: includes
  }), _$1.implement(_$1.ISet, {
    disj: disj,
    unite: conj
  }), _$1.implement(_$1.ICloneable, {
    clone: _$1.identity
  }), _$1.implement(_$1.IEmptyableCollection, {
    empty: emptySet
  }), _$1.implement(_$1.ICollection, {
    conj: conj
  }), _$1.implement(_$1.ICounted, {
    count: count
  }), _$1.implement(_$1.INext, {
    next: next$1
  }), _$1.implement(_$1.ISeq, {
    first: first$1,
    rest: rest$1
  }));

  behaveAsSet(imm.Set);

  function orderedMap(obj) {
    return obj instanceof imm.OrderedMap ? obj : new imm.OrderedMap(obj);
  }

  var behaveAsOrderedMap = behaveAsMap;

  behaveAsOrderedMap(imm.OrderedMap);

  function orderedSet(coll) {
    return coll instanceof imm.OrderedSet ? coll : new imm.OrderedSet(_$1.ICoerceable.toArray(coll));
  }
  function emptyOrderedSet() {
    return new imm.OrderedSet();
  }

  behaveAsSet(imm.OrderedSet);

  function Members(items) {
    this.items = items;
  }
  function members(self) {
    return new Members(distinct(_$1.satisfies(_$1.ISequential, self) ? self : _$1.cons(self)));
  }
  function emptyMembers() {
    return new Members();
  }
  Members.from = members;

  function fmap(self, f) {
    return members(_$1.mapcat(function (item) {
      var result = f(item);
      return _$1.satisfies(_$1.ISequential, result) ? result : [result];
    }, self.items));
  }

  function first(self) {
    return _$1.ISeq.first(self.items);
  }

  function rest(self) {
    var result = next(self);
    return result ? members(result) : emptyMembers();
  }

  function next(self) {
    var result = _$1.INext.next(self.items);
    return result ? members(result) : null;
  }

  var behaveAsMembers = _$1.does(_$1.serieslike, _$1.implement(_$1.INext, {
    next: next
  }), _$1.implement(_$1.ISeq, {
    first: first,
    rest: rest
  }), _$1.implement(_$1.IFunctor, {
    fmap: fmap
  }));

  behaveAsMembers(Members);

  var hash = IHash.hash;

  function memoize2(f, hash) {
    var c = _Symbol("cache");

    return function (self) {
      var cache = self[c] || map(),
          key = hash.apply(self, arguments),
          result = _$1.contains(cache, key) ? _$1.get(cache, key) : f.apply(self, arguments);

      self[c] = _$1.assoc(cache, key, result);
      return result;
    };
  }

  function memoize1(f) {
    return memoize2(f, function (self) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return args;
    });
  }

  var memoize = _$1.overload(null, memoize1, memoize2);

  (function () {
    function persistent(self) {
      return set(_$1.toArray(self));
    }

    _$1.doto(mut.TransientSet, _$1.implement(mut.IPersistent, {
      persistent: persistent
    }));
  })();

  var cache = _Symbol["for"]("hashCode");

  function cachedHashCode() {
    var result = this[cache] || IHash.hash(this);

    if (!Object.isFrozen(this) && this[cache] == null) {
      this[cache] = result;
    }

    return result;
  }

  function hashCode() {
    return IHash.hash(this);
  }

  function equals(other) {
    return _$1.IEquiv.equiv(this, other);
  }

  function addProp(obj, key, value) {
    if (obj.hasOwnProperty(key)) {
      throw new Error("Property `" + key + "` already defined on " + obj.constructor.name + ".");
    } else {
      Object.defineProperty(obj, key, {
        value: value,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  } // There be dragons! Integrate with Immutable. Object literals despite their use elsewhere are, in this world, immutable.


  addProp(Object.prototype, "hashCode", cachedHashCode);
  addProp(Object.prototype, "equals", equals);
  addProp(Number.prototype, "hashCode", hashCode);
  addProp(String.prototype, "hashCode", hashCode);
  function hashable() {
    function hash(self) {
      var content = [self.constructor.name],
          keys = Object.keys(self);

      for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
        var key = _keys[_i];
        content.push(key, self[key]);
      }

      return hashing(content);
    }

    return _$1.implement(IHash, {
      hash: hash
    });
  }
  function hashed(hs) {
    return _$1.reduce(function (h1, h2) {
      return 3 * h1 + h2;
    }, 0, hs);
  }
  function hashing(os) {
    return hashed(_$1.map(IHash.hash, os));
  }

  (function () {
    function hash(self) {
      return self.valueOf();
    }

    _$1.each(_$1.implement(IHash, {
      hash: hash
    }), [Date]);
  })();

  (function () {
    _$1.each(_$1.implement(IHash, {
      hash: hashing
    }), [Array, _$1.Concatenated, _$1.List, _$1.EmptyList]);
  })();

  (function () {
    _$1.each(_$1.implement(IHash, {
      hash: _$1.constantly(imm.hash(null))
    }), [_$1.Nil]);
  })();

  (function () {
    var seed = _$1.generate(_$1.positives);
    var uniques = _$1.weakMap();

    function hash(self) {
      if (!uniques.has(self)) {
        uniques.set(self, seed());
      }

      return uniques.get(self);
    }

    _$1.each(_$1.implement(IHash, {
      hash: hash
    }), [Function]);
  })();

  (function () {
    function hash(self) {
      return _$1.reduce(function (memo, key) {
        return hashing([memo, key, _$1.get(self, key)]);
      }, 0, _$1.sort(_$1.keys(self)));
    }

    _$1.each(_$1.implement(IHash, {
      hash: hash
    }), [Object, _$1.AssociativeSubset, _$1.Indexed, _$1.IndexedSeq]);
  })();

  (function () {
    _$1.each(_$1.implement(IHash, {
      hash: imm.hash
    }), [String, Number, Boolean]);
  })();

  (function () {
    function hash(self) {
      return IHash.hash(self.id);
    }

    _$1.doto(_$1.GUID, _$1.implement(IHash, {
      hash: hash
    }));
  })();

  Object.defineProperty(exports, 'List', {
    enumerable: true,
    get: function () {
      return imm.List;
    }
  });
  Object.defineProperty(exports, 'OrderedMap', {
    enumerable: true,
    get: function () {
      return imm.OrderedMap;
    }
  });
  Object.defineProperty(exports, 'OrderedSet', {
    enumerable: true,
    get: function () {
      return imm.OrderedSet;
    }
  });
  exports.IHash = IHash;
  exports.Members = Members;
  exports.distinct = distinct;
  exports.emptyMembers = emptyMembers;
  exports.emptyOrderedSet = emptyOrderedSet;
  exports.emptySet = emptySet;
  exports.hash = hash;
  exports.hashable = hashable;
  exports.hashed = hashed;
  exports.hashing = hashing;
  exports.list = list;
  exports.map = map;
  exports.members = members;
  exports.memoize = memoize;
  exports.orderedMap = orderedMap;
  exports.orderedSet = orderedSet;
  exports.set = set;

  Object.defineProperty(exports, '__esModule', { value: true });

});
