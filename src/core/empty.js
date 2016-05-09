import {Reduced} from './reduced.js';
import {constantly, noop} from './function.js';

export default function Empty(){
}

export const empty = new Empty();

export function isEmpty(self){
  return self === empty;
}

export const each = noop;

export function reduce(self, f, init) {
  return init instanceof Reduced ? init.valueOf() : init;
}

export const first = constantly(null);
export const rest  = constantly(empty);
