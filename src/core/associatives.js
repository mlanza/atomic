import {overload, identity, partial, constantly, slice} from "./core.js";
import {some, into, best} from "./types/lazy-seq/concrete.js";
import {apply} from "./types/function/concrete.js";
import {isFunction} from "./types/function/construct.js";
import {satisfies} from "./types/protocol/concrete.js";
import {concat} from "./types/concatenated.js";
import {descriptive} from "./types/object/concrete.js";
import {ISequential} from "./protocols.js";
import * as p from "./protocols/concrete.js";

function scanKey1(better){
  return partial(scanKey, better);
}

function scanKey3(better, k, x){
  return x;
}

function scanKey4(better, k, x, y){
  return better(k(x), k(y)) ? x : y;
}

function scanKeyN(better, k, x, ...args){
  return apply(p.reduce, partial(scanKey3, better), x, args);
}

export const scanKey = overload(null, scanKey1, null, scanKey3, scanKey4, scanKeyN);
export const maxKey  = scanKey(p.gt);
export const minKey  = scanKey(p.lt);
export const prop    = overload(null, function(key){
    return overload(null, v => p.get(v, key), v => p.assoc(v, key, v));
}, p.get, p.assoc);

function patch2(target, source){
  return p.reducekv(function(memo, key, value){
    return p.assoc(memo, key, typeof value === "function" ? value(p.get(memo, key)) : value);
  }, target, source);
}

export const patch = overload(null, identity, patch2, p.reducing(patch2));

function absorb2(tgt, src){
  return p.reducekv(function(memo, key, value){
    const was = p.get(memo, key);
    let absorbed;
    if (was == null) {
      absorbed = value;
    } else if (descriptive(value)) {
      absorbed = into(p.empty(was), absorb(was, value));
    } else if (satisfies(ISequential, value)) {
      absorbed = into(p.empty(was), concat(was, value));
    } else {
      absorbed = value;
    }
    return p.assoc(memo, key, absorbed);
  }, tgt, src || p.empty(tgt));
}

export const absorb = overload(constantly({}), identity, absorb2, p.reducing(absorb2));
