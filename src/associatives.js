import {overload, identity} from "./core";
import {isSequential, isDescriptive, IObject, ISeq, IAssociative, IReduce, IKVReduce, IEmptyableCollection, ICollection, ISeqable} from "./protocols";
import {some, into} from "./types/lazyseq/concrete";
import {slice} from "./types/array/concrete";
import {apply} from "./types/function/concrete";
import {concat} from "./types/concatenated";
import {gt, lt} from "./predicates";

export function scanKey(better){
  function scanKey2(k, x){
    return x;
  }

  function scanKey3(k, x, y){
    return better(k(x), k(y)) ? x : y;
  }

  function scanKeyN(k, x){
    return apply(IReduce.reduce, slice(arguments, 2), scanKey2, x);
  }

  return overload(null, null, scanKey2, scanKey3, scanKeyN);
}

export const maxKey = scanKey(gt);
export const minKey = scanKey(lt);

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
    return IAssociative.assoc(memo, key, isDescriptive(value) ? IObject.toObject(absorb(get(memo, key), value)) : isSequential(value) ? into(IEmptyableCollection.empty(get(memo, key)), concat(get(memo, key), value)) : value);
  }, tgt);
}