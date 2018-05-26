import {slice, apply, some} from "./types";
import {lookup, toArray, rest, assoc, contains, reduce, conj, seq, equiv} from "./protocols";
import {overload} from "./core";
import {gt, lt} from "./predicates";

export function get(self, key, notFound){
  return lookup(self, key) || notFound;
}

export function getIn(self, keys, notFound){
  return reduce(keys, get, self) || notFound;
}

export function assocIn(self, keys, value){
  var key = keys[0];
  switch (keys.length) {
    case 0:
      return self;
    case 1:
      return equiv(lookup(self, key), value) ? self : assoc(self, key, value); //maintain referential equivalence
    default:
      return assoc(self, key, assocIn(get(self, key), toArray(rest(keys)), value));
  }
}

function update3(self, key, f){
  return assoc(self, key, f(get(self, key)));
}

function update4(self, key, f, a){
  return assoc(self, key, f(get(self, key), a));
}

function update5(self, key, f, a, b){
  return assoc(self, key, f(get(self, key), a, b));
}

function update6(self, key, f, a, b, c){
  return assoc(self, key, f(get(self, key), a, b, c));
}

function updateN(self, key, f){
  var tgt  = get(self, key),
      args = [tgt].concat(slice(arguments, 3));
  return assoc(self, key, f.apply(this, args));
}

export const update = overload(null, null, null, update3, update4, update5, update6, updateN);

function updateIn3(self, keys, f){
  var k = keys[0], ks = toArray(rest(keys));
  return ks.length ? assoc(self, k, updateIn3(get(self, k), ks, f)) : update3(self, k, f);
}

function updateIn4(self, keys, f, a){
  var k = keys[0], ks = toArray(rest(keys));
  return ks.length ? assoc(self, k, updateIn4(get(self, k), ks, f, a)) : update4(self, k, f, a);
}

function updateIn5(self, keys, f, a, b){
  var k = keys[0], ks = toArray(rest(keys));
  return ks.length ? assoc(self, k, updateIn5(get(self, k), ks, f, a, b)) : update5(self, k, f, a, b);
}

function updateIn6(self, key, f, a, b, c){
  var k = keys[0], ks = toArray(rest(keys));
  return ks.length ? assoc(self, k, updateIn6(get(self, k), ks, f, a, b, c)) : update6(self, k, f, a, b, c);
}

function updateInN(self, keys, f) {
  return updateIn3(self, keys, function(obj, ...args){
    return f.apply(null, [obj].concat(args));
  });
}

export const updateIn = overload(null, null, null, updateIn3, updateIn4, updateIn5, updateIn6, updateInN);

export function merge(...maps){
  return some(identity, maps) ? reduce(maps, function(memo, map){
    return reduce(seq(map), function(memo, pair){
      const key = pair[0], value = pair[1];
      memo[key] = value;
      return memo;
    }, memo);
  }, {}) : null;
}

export function mergeWith(f, ...maps){
  return some(identity, maps) ? reduce(maps, function(memo, map){
    return reduce(seq(map), function(memo, pair){
      const key = pair[0], value = pair[1];
      return contains(memo, key) ? update(memo, key, function(prior){
        return f(prior, value);
      }) : assoc(memo, key, value);
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
    return apply(reduce, slice(arguments, 2), scanKey2, x);
  }

  return overload(null, null, scanKey2, scanKey3, scanKeyN);
}

export const maxKey = scanKey(gt);
export const minKey = scanKey(lt);

function groupInto(seed, f, coll){
  return reduce(coll, function(memo, value){
    return update(memo, f(value), function(group){
      return conj(group || [], value);
    });
  }, seed);
}

export function groupBy(f, coll){
  return groupInto({}, f, coll);
}