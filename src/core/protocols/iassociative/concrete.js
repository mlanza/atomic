import {IAssociative} from "./instance";
import {overload, slice} from "../../core";
import {ISeq} from "../iseq";
import {ICoerceable} from "../icoerceable/instance";
import {ILookup} from "../ilookup";

export const contains = IAssociative.contains;

function assocN(self, key, value, ...args){
  const instance = IAssociative.assoc(self, key, value);
  return args.length > 0 ? assocN(instance, ...args) : instance;
}

export const assoc = overload(null, null, null, IAssociative.assoc, assocN);

export function assocIn(self, keys, value){
  let key = keys[0];
  switch (keys.length) {
    case 0:
      return self;
    case 1:
      return IAssociative.assoc(self, key, value);
    default:
      return IAssociative.assoc(self, key, assocIn(ILookup.lookup(self, key), ICoerceable.toArray(ISeq.rest(keys)), value));
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
  let tgt  = ILookup.lookup(self, key),
      args = [tgt].concat(slice(arguments, 3));
  return IAssociative.assoc(self, key, f.apply(this, args));
}

export const update = overload(null, null, null, update3, update4, update5, update6, updateN);

function updateIn3(self, keys, f){
  let k = keys[0], ks = ICoerceable.toArray(ISeq.rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn3(ILookup.lookup(self, k), ks, f)) : update3(self, k, f);
}

function updateIn4(self, keys, f, a){
  let k = keys[0], ks = ICoerceable.toArray(ISeq.rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn4(ILookup.lookup(self, k), ks, f, a)) : update4(self, k, f, a);
}

function updateIn5(self, keys, f, a, b){
  let k = keys[0], ks = ICoerceable.toArray(ISeq.rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn5(ILookup.lookup(self, k), ks, f, a, b)) : update5(self, k, f, a, b);
}

function updateIn6(self, key, f, a, b, c){
  let k = keys[0], ks = ICoerceable.toArray(ISeq.rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn6(ILookup.lookup(self, k), ks, f, a, b, c)) : update6(self, k, f, a, b, c);
}

function updateInN(self, keys, f) {
  return updateIn3(self, keys, function(obj, ...args){
    return f.apply(null, [obj].concat(args));
  });
}

export const updateIn = overload(null, null, null, updateIn3, updateIn4, updateIn5, updateIn6, updateInN);