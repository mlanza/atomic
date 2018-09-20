import {overload, identity, partial, constantly, slice} from "./core";
import {IDescriptive, ISeqable, ISequential, IObject, IAssociative, ILookup, IReduce, IKVReduce, IEmptyableCollection} from "./protocols";
import {some, into, best} from "./types/lazy-seq/concrete";
import {apply} from "./types/function/concrete";
import {isFunction} from "./types/function/construct";
import {satisfies} from "./types/protocol/concrete";
import {concat} from "./types/concatenated";
import {update} from "./protocols/iassociative/concrete";
import {reducing} from "./protocols/ireduce/concrete";
import {gt, lt} from "./predicates";

export function merge(...maps){
  return some(identity, maps) ? IReduce.reduce(maps, function(memo, map){
    return IReduce.reduce(ISeqable.seq(map), function(memo, [key, value]){
      memo[key] = value;
      return memo;
    }, memo);
  }, {}) : null;
}

export function mergeWith(f, init, ...maps){
  return init && some(identity, maps) ? IReduce.reduce(maps, function(memo, map){
    return IReduce.reduce(ISeqable.seq(map), function(memo, [key, value]){
      return IAssociative.contains(memo, key) ? update(memo, key, function(prior){
        return f(prior, value);
      }) : IAssociative.assoc(memo, key, value);
    }, memo);
  }, init) : null;
}

export function patch(...maps){
  return mergeWith(function(prior, value){
    return isFunction(value) ? value(prior) : value;
  }, ...maps);
}

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