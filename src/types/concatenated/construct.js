import {EMPTY} from '../empty/construct';
import {seq} from '../../protocols/iseqable';
import {constantly, overload} from "../../core";
import {unspread} from "../function";

export function Concatenated(colls){
  this.colls = colls;
}

export function concatenated(colls){
  return seq(colls) ? new Concatenated(colls) : EMPTY;
}

export const concat = overload(constantly(EMPTY), seq, unspread(concatenated));

export default Concatenated;