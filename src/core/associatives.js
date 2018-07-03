import {overload, identity, partial} from "./core";
import {IDescriptive, ISeqable, ISequential, IObject, IAssociative, ILookup, IReduce, IKVReduce, IEmptyableCollection} from "./protocols";
import {some, into, best} from "./types/lazy-seq/concrete";
import {slice} from "./types/array/concrete";
import {apply} from "./types/function/concrete";
import {isFunction} from "./types/function/construct";
import {satisfies} from "./types/protocol/concrete";
import {concat} from "./types/concatenated";
import {update} from "./protocols/iassociative/concrete";
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

export function absorb(tgt, src){
  return IKVReduce.reducekv(src, function(memo, key, value){
    return IAssociative.assoc(memo, key, satisfies(IDescriptive, value) ? IObject.toObject(absorb(ILookup.lookup(memo, key), value)) : satisfies(ISequential, value) ? into(IEmptyableCollection.empty(ILookup.lookup(memo, key)), concat(ILookup.lookup(memo, key), value)) : value);
  }, tgt);
}