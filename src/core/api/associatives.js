import {overload, identity, partial} from "../core";
import {isSequential, isDescriptive, IObject, ISeq, IAssociative, ILookup, IReduce, IKVReduce, IEmptyableCollection, ICollection, ISeqable} from "../protocols";
import {some, into, best} from "../types/lazy-seq/concrete";
import {slice} from "../types/array/concrete";
import {apply} from "../types/function/concrete";
import {concat} from "../types/concatenated";
import {gt, lt} from "./predicates";

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
    return IAssociative.assoc(memo, key, isDescriptive(value) ? IObject.toObject(absorb(ILookup.lookup(memo, key), value)) : isSequential(value) ? into(IEmptyableCollection.empty(ILookup.lookup(memo, key)), concat(ILookup.lookup(memo, key), value)) : value);
  }, tgt);
}