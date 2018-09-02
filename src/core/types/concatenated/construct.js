import {ISeqable} from '../../protocols/iseqable';
import {ISeq} from '../../protocols/iseq';
import IArray from '../../protocols/iarray/instance';
import {identity, constantly, overload, unspread} from "../../core";
import {lazySeq} from "../../types/lazy-seq/construct";
import {emptyList} from '../empty-list/construct';
import Symbol from '../symbol/construct';

function filter(pred, xs){ //duplicated to break dependencies
  const coll = ISeqable.seq(xs);
  if (!coll) return xs;
  const head = ISeq.first(coll);
  return pred(head) ? lazySeq(head, function(){
    return filter(pred, ISeq.rest(coll));
  }) : filter(pred, ISeq.rest(coll));
}

export function Concatenated(colls){
  this.colls = colls;
}

export function concatenated(colls){
  colls = IArray.toArray(filter(ISeqable.seq, colls));
  return ISeqable.seq(colls) ? new Concatenated(colls) : emptyList();
}

export function isConcatenated(self){
  return self.constructor === Concatenated;
}

function from({colls}){
  return new Concatenated(colls);
}

Concatenated.prototype[Symbol.toStringTag] = "Concatenated";
Concatenated.create = concatenated;
Concatenated.from = from;

export const concat = overload(emptyList, ISeqable.seq, unspread(concatenated));

export default Concatenated;