import {ISeqable, ISeq, IArray} from '../../protocols';
import {identity, constantly, overload, unspread} from "../../core";
import {lazySeq} from "../../types/lazy-seq/construct";
import EmptyList from '../empty-list/construct';

function filter(pred, xs){ //duplicated to break dependencies
  const coll = ISeqable.seq(xs);
  if (!coll) return EmptyList.EMPTY;
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
  return ISeqable.seq(colls) ? new Concatenated(colls) : EmptyList.EMPTY;
}

export function isConcatenated(self){
  return self.constructor === Concatenated;
}

function from({colls}){
  return new Concatenated(colls);
}

Concatenated.prototype[Symbol.toStringTag] = "Concatenated";
Concatenated.from = from;

export const concat = overload(constantly(EmptyList.EMPTY), ISeqable.seq, unspread(concatenated));

export default Concatenated;