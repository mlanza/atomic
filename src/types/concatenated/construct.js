import {ISeqable, ISeq, IArr} from '../../protocols';
import {identity, constantly, overload, unspread} from "../../core";
import {lazySeq} from "../../types/lazyseq/construct";
import {EMPTY} from '../empty/construct';

function filter(pred, xs){ //duplicated to break dependencies
  const coll = ISeqable.seq(xs);
  if (!coll) return EMPTY;
  const head = ISeq.first(coll);
  return pred(head) ? lazySeq(head, function(){
    return filter(pred, ISeq.rest(coll));
  }) : filter(pred, ISeq.rest(coll));
}

export function Concatenated(colls){
  this.colls = colls;
}

export function concatenated(colls){
  colls = filter(ISeqable.seq, colls);
  return ISeqable.seq(colls) ? new Concatenated(colls) : EMPTY;
}

Concatenated.from = concatenated;

export const concat = overload(constantly(EMPTY), ISeqable.seq, unspread(concatenated));

export default Concatenated;