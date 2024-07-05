import * as _ from "atomic/core";
import {IAssociative} from "./instance.js";
export const assoc = IAssociative.assoc;

function update3(self, key, f){
  assoc(self, key, f(_.get(self, key)));
}

function update4(self, key, f, a){
  assoc(self, key, f(_.get(self, key), a));
}

function update5(self, key, f, a, b){
  assoc(self, key, f(_.get(self, key), a, b));
}

function update6(self, key, f, a, b, c){
  assoc(self, key, f(_.get(self, key), a, b, c));
}

function updateN(self, key, f, ...xs){
  let tgt  = _.get(self, key),
      args = [tgt, ...xs];
  assoc(self, key, f.apply(this, args));
}

export const update = _.overload(null, null, null, update3, update4, update5, update6, updateN);

function updateIn3(self, keys, f){
  let k = keys[0], ks = _.toArray(_.rest(keys));
  ks.length ? assoc(self, k, updateIn3(_.get(self, k), ks, f)) : update3(self, k, f);
}

function updateIn4(self, keys, f, a){
  let k = keys[0], ks = _.toArray(_.rest(keys));
  ks.length ? assoc(self, k, updateIn4(_.get(self, k), ks, f, a)) : update4(self, k, f, a);
}

function updateIn5(self, keys, f, a, b){
  let k = keys[0], ks = _.toArray(_.rest(keys));
  ks.length ? assoc(self, k, updateIn5(_.get(self, k), ks, f, a, b)) : update5(self, k, f, a, b);
}

function updateIn6(self, key, f, a, b, c){
  let k = keys[0], ks = _.toArray(_.rest(keys));
  ks.length ? assoc(self, k, updateIn6(_.get(self, k), ks, f, a, b, c)) : update6(self, k, f, a, b, c);
}

function updateInN(self, keys, f) {
  updateIn3(self, keys, function(...xs){
    return f.apply(null, xs);
  });
}

export const updateIn = _.overload(null, null, null, updateIn3, updateIn4, updateIn5, updateIn6, updateInN);

export function assocIn(self, keys, value){
  let key = keys[0];
  switch (keys.length) {
    case 1:
      assoc(self, key, value);
      break;
    default:
      assoc(self, key, assocIn(_.get(self, key), _.toArray(_.rest(keys)), value));
  }
}
