import {IInclusive, ICollection, ISeq, ISeqable, IHierarchy, IHierarchicalSet, IReduce} from '../../protocols';
import {identity} from '../../core';
import {EMPTY} from '../empty/construct';
import {set} from '../set/construct';
import {cons} from '../list/construct';
import {concat, concatenated} from "../concatenated/construct";

export function LazySeq(head, tail){
  this.head = head;
  this.tail = tail;
}

export function lazySeq(head, tail){
  return new LazySeq(head, tail);
}

export default LazySeq;

//duplicated definitions to break circular dependencies

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
      }, coll instanceof Element ? ISeqable.seq([coll]) : ISeqable.seq(coll)))));
    }
  }
}

export const mapping    = elements(map);
export const mapcatting = elements(mapcat);