import {identity, unspread, comp, overload} from "./core.js";
import {isReduced, reduced, unreduced} from "./types/reduced.js";
import * as s from "./protocols/iseq/concrete.js"
import {conj} from "./protocols/icollection/concrete.js";
import {seq} from "./protocols/iseqable/concrete.js";
import {compact} from "./protocols/icompactible/concrete.js";
import {get} from "./protocols/ilookup/concrete.js";
import {keys} from "./protocols/imap/concrete.js";
import {lazySeq} from "./types/lazy-seq/construct.js";
import {map, mapIndexed} from "./types/lazy-seq/concrete.js";
import {cons} from "./types/list/construct.js";
import {emptyList} from "./types/empty-list/construct.js";
import {array} from "./types/array/construct.js";

export function blot(self){
  return seq(compact(self)) ? self : null;
}

export function blottable(self){
  return blot(self) == null;
}

export const seqIndexed = mapIndexed(array, ?);

const sequence1 = map(identity, ?);

function sequence2(xform, coll){
  return seq(coll) ? lazySeq(function(){
    const step = xform(function(memo, value){
      return cons(value, memo);
    });
    return step(sequence2(xform, s.rest(coll)), s.first(coll));
  }) : emptyList();
}

function sequence3(xform, ...colls){
  return sequence2(xform, map(unspread(identity), ...colls));
}

export const sequence = overload(null, sequence1, sequence2, sequence3);

export function first(self){
  const key = s.first(keys(self));
  return key ? [key, get(self, key)] : null;
}

function rest2(self, keys){
  return seq(keys) ? lazySeq(function(){
    const key = s.first(keys);
    return cons([key, get(self, key)], rest2(self, s.next(keys)));
  }) : emptyList();
}

export function rest(self){
  return rest2(self, s.next(keys(self)));
}

export function reduceWith(seq){
  return function reduce(xs, f, init){
    let memo = init,
        ys = seq(xs);
    while(ys && !isReduced(memo)){
      memo = f(memo, s.first(ys));
      ys = s.next(ys);
    }
    return unreduced(memo);
  }

}

export function reducekvWith(seq){
  return function reducekv(xs, f, init){
    let memo = init,
        ys = seq(xs);
    while (ys && !isReduced(memo)){
      memo = f(memo, ...s.first(ys));
      ys = s.next(ys);
    }
    return unreduced(memo);
  }
}

export const reduce = reduceWith(seq);
export const reducekv = reducekvWith(seqIndexed);
