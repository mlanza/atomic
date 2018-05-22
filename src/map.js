import * as p from "./protocols";
import {identity} from "./core";
import {partial, comp} from "./types/function";
import {lazySeq} from "./types/lazyseq";
import {set} from "./types/set";
import {concatenated} from "./types/concatenated";
import {EMPTY} from "./types/empty";

function map(f, xs){
  return ISeqable.seq(xs) ? lazySeq(f(ISeq.first(xs)), function(){
    return map(f, ISeq.rest(xs));
  }) : EMPTY;
}

function mapcat(f, colls){
  return concatenated(map(f, colls));
}

function filter(pred, xs){
  const coll = ISeqable.seq(xs);
  if (!coll) return EMPTY;
  const head = ISeq.first(coll);
  return pred(head) ? lazySeq(head, function(){
    return filter(pred, ISeq.rest(coll));
  }) : filter(pred, ISeq.rest(coll));
}

function distinct2(coll, seen){
  if (ISeqable.seq(coll)) {
    let fst = ISeq.first(coll);
    if (IInclusive.includes(seen, fst)) {
      return distinct2(ISeq.rest(coll), seen);
    } else {
      return lazySeq(fst, function(){
        return distinct2(ISeq.rest(coll), ICollection.conj(seen, fst));
      });
    }
  } else {
    return EMPTY;
  }
}

function distinct(coll){
  return distinct2(coll, set());
}

function compact(coll){
  return filter(identity, coll);
}

function elements(map){
  return function(f){
    return function(coll){
      return distinct(compact(map(f, filter(function(el){
        return el !== document;
      }, ISeqable.seq(coll)))));
    }
  }
}

export const mapping    = elements(map);
export const mapcatting = elements(mapcat);