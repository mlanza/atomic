import {ISeqable} from '../../protocols/iseqable';
import {ISeq} from '../../protocols/iseq';
import {ICoerce} from '../../protocols/icoerce/instance';
import {identity, overload, unspread} from "../../core";
import {lazySeq} from "../../types/lazy-seq/construct";
import {cons} from "../../types/list/construct";
import {emptyList} from '../empty-list/construct';
import {Symbol} from '../symbol/construct';

//duplicated to break dependencies
export function filter(pred, xs){
  return ISeqable.seq(xs) ? lazySeq(function(){
    let ys = xs;
    while (ISeqable.seq(ys)) {
      const head = ISeq.first(ys),
            tail = ISeq.rest(ys);
      if (pred(head)) {
        return cons(head, lazySeq(function(){
          return filter(pred, tail);
        }));
      }
      ys = tail;
    }
    return emptyList();
  }) : emptyList();
}

export function Concatenated(colls){
  this.colls = colls;
}

export function concatenated(xs){
  const colls = filter(ISeqable.seq, xs);
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