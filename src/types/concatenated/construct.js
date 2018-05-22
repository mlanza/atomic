import {seq} from '../../protocols/iseqable';
import {identity, constantly, overload, unspread} from "../../core";
import {EMPTY} from '../empty/construct';

export function Concatenated(colls){
  this.colls = colls;
}

export function concatenated(colls){
  return seq(colls) ? new Concatenated(colls) : EMPTY;
}

export const concat = overload(constantly(EMPTY), seq, unspread(concatenated));

export default Concatenated;