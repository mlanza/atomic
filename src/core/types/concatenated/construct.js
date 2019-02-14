import {ISeqable} from '../../protocols/iseqable';
import {ISeq} from '../../protocols/iseq';
import ICoerce from '../../protocols/icoerce/instance';
import {identity, overload, unspread} from "../../core";
import {lazySeq} from "../../types/lazy-seq/construct";
import {emptyList} from '../empty-list/construct';
import Symbol from '../symbol/construct';

//duplicated to break dependencies
function filter(pred, xs){
  let ys = xs;
  while (ISeqable.seq(ys)) {
    const head = ISeq.first(ys),
          tail = ISeq.rest(ys);
    if (pred(head)) {
      return lazySeq(head, function(){
        return filter(pred, tail);
      });
    }
    ys = tail;
  }
  return emptyList();
}

export function Concatenated(colls){
  this.colls = colls;
}

export function concatenated(colls){
  colls = ICoerce.toArray(filter(ISeqable.seq, colls));
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