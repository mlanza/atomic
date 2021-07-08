import {IAssociative} from "./instance.js";
import {overload, slice, branch, identity} from "../../core.js";
import {toArray} from "../icoercible.js";
import {rest} from "../iseq.js";
import {get} from "../ilookup.js";

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
      return IAssociative.assoc(self, key, assocIn(get(self, key), toArray(rest(keys)), value));
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
  let tgt  = get(self, key),
      args = [tgt].concat(slice(arguments, 3));
  return IAssociative.assoc(self, key, f.apply(this, args));
}

export const update = overload(null, null, null, update3, update4, update5, update6, updateN);

function updateIn3(self, keys, f){
  let k = keys[0], ks = toArray(rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn3(get(self, k), ks, f)) : update3(self, k, f);
}

function updateIn4(self, keys, f, a){
  let k = keys[0], ks = toArray(rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn4(get(self, k), ks, f, a)) : update4(self, k, f, a);
}

function updateIn5(self, keys, f, a, b){
  let k = keys[0], ks = toArray(rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn5(get(self, k), ks, f, a, b)) : update5(self, k, f, a, b);
}

function updateIn6(self, key, f, a, b, c){
  let k = keys[0], ks = toArray(rest(keys));
  return ks.length ? IAssociative.assoc(self, k, updateIn6(get(self, k), ks, f, a, b, c)) : update6(self, k, f, a, b, c);
}

function updateInN(self, keys, f) {
  return updateIn3(self, keys, function(obj, ...args){
    return f.apply(null, [obj].concat(args));
  });
}

function contains3(self, key, value){
  return IAssociative.contains(self, key) && get(self, key) === value;
}

export const contains = overload(null, null, IAssociative.contains, contains3);
export const updateIn = overload(null, null, null, updateIn3, updateIn4, updateIn5, updateIn6, updateInN);
export const rewrite = branch(IAssociative.contains, update, identity);
