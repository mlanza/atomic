import {EMPTY} from '../empty/construct';
import {seq} from '../../protocols/iseqable';

export function Concatenated(colls){
  this.colls = colls;
}

export function concat(){
  return concatenated(Array.prototype.slice.call(arguments));
}

export function concatenated(colls){
  return seq(colls) ? new Concatenated(colls) : EMPTY;
}

export default Concatenated;