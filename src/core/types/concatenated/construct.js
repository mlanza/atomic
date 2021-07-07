import {identity, overload, unspread} from "../../core.js";
import {lazySeq} from "../../types/lazy-seq/construct.js";
import {cons} from "../../types/list/construct.js";
import {emptyList} from "../empty-list/construct.js";
import Symbol from "symbol";
import * as p from "./protocols.js";

//duplicated to break dependencies
export function filter(pred, xs){
  return p.seq(xs) ? lazySeq(function(){
    let ys = xs;
    while (p.seq(ys)) {
      const head = p.first(ys),
            tail = p.rest(ys);
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
  const colls = filter(p.seq, xs);
  return p.seq(colls) ? new Concatenated(colls) : emptyList();
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

export const concat = overload(emptyList, p.seq, unspread(concatenated));
