import {EMPTY} from '../empty/construct';

export function Concatenated(colls){
  this.colls = colls;
}

export function concat(){
  return concatenated(Array.prototype.slice.call(arguments).filter(function(coll){
    return coll !== EMPTY;
  }));
}

export function concatenated(colls){
  return colls.length ? new Concatenated(colls) : EMPTY;
}

export default Concatenated;