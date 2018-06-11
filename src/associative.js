import {overload} from "./core";
import {ISeq} from "./protocols/iseq";
import {IEquiv} from "./protocols/iequiv";
import {IArray} from "./protocols/iarray";
import {ILookup} from "./protocols/ilookup";
import {IAssociative} from "./protocols/iassociative";

function assocN(self, key, value, ...args){
  const instance = IAssociative.assoc(self, key, value);
  return args.length > 0 ? assocN(instance, ...args) : instance;
}

export const assoc = overload(null, null, null, IAssociative.assoc, assocN);

export function assocIn(self, keys, value){
  var key = keys[0];
  switch (keys.length) {
    case 0:
      return self;
    case 1:
      return IEquiv.equiv(ILookup.lookup(self, key), value) ? self : IAssociative.assoc(self, key, value); //maintain referential equivalence
    default:
      return IAssociative.assoc(self, key, assocIn(ILookup.lookup(self, key), IArray.toArray(ISeq.rest(keys)), value));
  }
}

function update3(self, key, f){
  return IAssociative.assoc(self, key, f(ILookup.lookup(self, key)));
}

function update4(self, key, f, a){
  return IAssociative.assoc(self, key, f(ILookup.lookup(self, key), a));
}

function update5(self, key, f, a, b){
  return IAssociative.assoc(self, key, f(ILookup.lookup(self, key), a, b));
}

function update6(self, key, f, a, b, c){
  return IAssociative.assoc(self, key, f(ILookup.lookup(self, key), a, b, c));
}

function updateN(self, key, f){
  var tgt  = ILookup.lookup(self, key),
      args = [tgt].concat(slice(arguments, 3));
  return IAssociative.assoc(self, key, f.apply(this, args));
}

export const update = overload(null, null, null, update3, update4, update5, update6, updateN);

function updateIn3(self, keys, f){
  var k = keys[0], ks = IArray.toArray(ISeq.rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn3(ILookup.lookup(self, k), ks, f)) : update3(self, k, f);
}

function updateIn4(self, keys, f, a){
  var k = keys[0], ks = IArray.toArray(ISeq.rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn4(ILookup.lookup(self, k), ks, f, a)) : update4(self, k, f, a);
}

function updateIn5(self, keys, f, a, b){
  var k = keys[0], ks = IArray.toArray(ISeq.rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn5(ILookup.lookup(self, k), ks, f, a, b)) : update5(self, k, f, a, b);
}

function updateIn6(self, key, f, a, b, c){
  var k = keys[0], ks = IArray.toArray(ISeq.rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn6(ILookup.lookup(self, k), ks, f, a, b, c)) : update6(self, k, f, a, b, c);
}

function updateInN(self, keys, f) {
  return updateIn3(self, keys, function(obj, ...args){
    return f.apply(null, [obj].concat(args));
  });
}

export const updateIn = overload(null, null, null, updateIn3, updateIn4, updateIn5, updateIn6, updateInN);
