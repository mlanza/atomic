import {overload} from "./core";
import {isAssociative, isSequential, isObj, ILookup, IArr, IObj, ISeq, IAssociative, IReduce, IKVReduce, IEmptyableCollection, IEquiv, ICollection, ISeqable} from "./protocols";
import {some, into} from "./types/lazyseq/concrete";
import {slice} from "./types/array/concrete";
import {apply} from "./types/function/concrete";
import {concat} from "./types/concatenated";
import {gt, lt} from "./predicates";

export function get(self, key, notFound){
  return ILookup.lookup(self, key) || notFound;
}

export function getIn(self, keys, notFound){
  return IReduce.reduce(keys, get, self) || notFound;
}

export function assocIn(self, keys, value){
  var key = keys[0];
  switch (keys.length) {
    case 0:
      return self;
    case 1:
      return IEquiv.equiv(ILookup.lookup(self, key), value) ? self : IAssociative.assoc(self, key, value); //maintain referential equivalence
    default:
      return IAssociative.assoc(self, key, assocIn(get(self, key), IArr.toArray(ISeq.rest(keys)), value));
  }
}

function update3(self, key, f){
  return IAssociative.assoc(self, key, f(get(self, key)));
}

function update4(self, key, f, a){
  return IAssociative.assoc(self, key, f(get(self, key), a));
}

function update5(self, key, f, a, b){
  return IAssociative.assoc(self, key, f(get(self, key), a, b));
}

function update6(self, key, f, a, b, c){
  return IAssociative.assoc(self, key, f(get(self, key), a, b, c));
}

function updateN(self, key, f){
  var tgt  = get(self, key),
      args = [tgt].concat(slice(arguments, 3));
  return IAssociative.assoc(self, key, f.apply(this, args));
}

export const update = overload(null, null, null, update3, update4, update5, update6, updateN);

function updateIn3(self, keys, f){
  var k = keys[0], ks = IArr.toArray(ISeq.rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn3(get(self, k), ks, f)) : update3(self, k, f);
}

function updateIn4(self, keys, f, a){
  var k = keys[0], ks = IArr.toArray(ISeq.rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn4(get(self, k), ks, f, a)) : update4(self, k, f, a);
}

function updateIn5(self, keys, f, a, b){
  var k = keys[0], ks = IArr.toArray(ISeq.rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn5(get(self, k), ks, f, a, b)) : update5(self, k, f, a, b);
}

function updateIn6(self, key, f, a, b, c){
  var k = keys[0], ks = IArr.toArray(ISeq.rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn6(get(self, k), ks, f, a, b, c)) : update6(self, k, f, a, b, c);
}

function updateInN(self, keys, f) {
  return updateIn3(self, keys, function(obj, ...args){
    return f.apply(null, [obj].concat(args));
  });
}

export const updateIn = overload(null, null, null, updateIn3, updateIn4, updateIn5, updateIn6, updateInN);

export function merge(...maps){
  return some(identity, maps) ? IReduce.reduce(maps, function(memo, map){
    return IReduce.reduce(ISeqable.seq(map), function(memo, pair){
      const key = pair[0], value = pair[1];
      memo[key] = value;
      return memo;
    }, memo);
  }, {}) : null;
}

export function mergeWith(f, ...maps){
  return some(identity, maps) ? IReduce.reduce(maps, function(memo, map){
    return IReduce.reduce(ISeqable.seq(map), function(memo, pair){
      const key = pair[0], value = pair[1];
      return IAssociative.contains(memo, key) ? update(memo, key, function(prior){
        return f(prior, value);
      }) : IAssociative.assoc(memo, key, value);
    }, memo);
  }, {}) : null;
}

export function scanKey(better){
  function scanKey2(k, x){
    return x;
  }

  function scanKey3(k, x, y){
    return better(k(x), k(y)) ? x : y;
  }

  function scanKeyN(k, x){
    return apply(IReduce.reduce, slice(arguments, 2), scanKey2, x);
  }

  return overload(null, null, scanKey2, scanKey3, scanKeyN);
}

export const maxKey = scanKey(gt);
export const minKey = scanKey(lt);

function groupBy3(init, f, coll){
  return IReduce.reduce(coll, function(memo, value){
    return update(memo, f(value), function(group){
      return ICollection.conj(group || [], value);
    });
  }, init);
}

function groupBy2(f, coll){
  return groupBy3({}, f, coll);
}

export const groupBy = overload(null, null, groupBy2, groupBy3);

function index4(init, key, val, coll){
  return IReduce.reduce(coll, function(memo, x){
    return IAssociative.assoc(memo, key(x), val(x));
  }, init);
}

function index3(key, val, coll){
  return index4({}, key, val, coll);
}

function index2(key, coll){
  return index4({}, key, identity, coll);
}

export const index = overload(null, null, index2, index3, index4);

export function absorb(tgt, src){
  return IKVReduce.reducekv(src, function(memo, key, value){
    return IAssociative.assoc(memo, key, isObj(value) ? IObj.toObject(absorb(get(memo, key), value)) : isSequential(value) ? into(IEmptyableCollection.empty(get(memo, key)), concat(get(memo, key), value)) : value);
  }, tgt);
}