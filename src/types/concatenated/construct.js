import {EMPTY} from '../empty/construct';
import {seq} from '../../protocols/iseqable';
import {first, rest} from '../../protocols/iseq';
import {lazySeq} from "../lazyseq/construct";
import {constantly, overload} from "../../core";
import {unspread} from "../function";

function filter(pred, xs){
  const coll = seq(xs);
  if (!coll) return EMPTY;
  const head = first(coll);
  return pred(head) ? lazySeq(head, function(){
    return filter(pred, rest(coll));
  }) : filter(pred, rest(coll));
}

export function map(f, xs){
  return seq(xs) ? lazySeq(f(first(xs)), function(){
    return map(f, rest(xs));
  }) : EMPTY;
}

export function mapcat(f, colls){
  return concatenated(map(f, colls));
}

function compact(colls){
  return filter(seq, colls);
}

export function Concatenated(colls){
  this.colls = colls;
}

export function concatenated(colls){
  colls = compact(colls);
  return seq(colls) ? new Concatenated(colls) : EMPTY;
}

export const concat = overload(constantly(EMPTY), seq, unspread(concatenated));

export default Concatenated;