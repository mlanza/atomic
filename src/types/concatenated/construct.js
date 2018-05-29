import {ISeqable} from '../../protocols';
import {identity, constantly, overload, unspread} from "../../core";
import {EMPTY} from '../empty/construct';

export function Concatenated(colls){
  this.colls = colls;
}

export function concatenated(colls){
  return ISeqable.seq(colls) ? new Concatenated(colls) : EMPTY;
}

export const concat = overload(constantly(EMPTY), ISeqable.seq, unspread(concatenated));

export default Concatenated;