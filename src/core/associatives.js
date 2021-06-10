import {overload, identity, partial, constantly, slice} from "./core.js";
import {IDescriptive, ISeqable, ISequential, IAssociative, ILookup, IReduce, IKVReduce, IEmptyableCollection} from "./protocols.js";
import {some, into, best} from "./types/lazy-seq/concrete.js";
import {apply} from "./types/function/concrete.js";
import {isFunction} from "./types/function/construct.js";
import {satisfies} from "./types/protocol/concrete.js";
import {concat} from "./types/concatenated.js";
import {update} from "./protocols/iassociative/concrete.js";
import {reducing} from "./protocols/ireduce/concrete.js";
import {gt, lt} from "./predicates.js";

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
  return apply(IReduce.reduce, args, partial(scanKey3, better), x);
}

export const scanKey = overload(null, scanKey1, null, scanKey3, scanKey4, scanKeyN);
export const maxKey  = scanKey(gt);
export const minKey  = scanKey(lt);
export const prop    = overload(null, function(key){
    return overload(null, v => ILookup.lookup(v, key), v => IAssociative.assoc(v, key, v));
}, ILookup.lookup, IAssociative.assoc);

function patch2(target, source){
  return IKVReduce.reducekv(source, function(memo, key, value){
    return IAssociative.assoc(memo, key, typeof value === "function" ? value(ILookup.lookup(memo, key)) : value);
  }, target);
}

export const patch = overload(null, identity, patch2, reducing(patch2));

function absorb2(tgt, src){
  return IKVReduce.reducekv(src || IEmptyableCollection.empty(tgt), function(memo, key, value){
    const was = ILookup.lookup(memo, key);
    let absorbed;
    if (was == null) {
      absorbed = value;
    } else if (satisfies(IDescriptive, value)) {
      absorbed = into(IEmptyableCollection.empty(was), absorb(was, value));
    } else if (satisfies(ISequential, value)) {
      absorbed = into(IEmptyableCollection.empty(was), concat(was, value));
    } else {
      absorbed = value;
    }
    return IAssociative.assoc(memo, key, absorbed);
  }, tgt);
}

export const absorb = overload(constantly({}), identity, absorb2, reducing(absorb2));