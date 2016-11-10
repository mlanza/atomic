import {Reduced} from './reduced.js';
import {constantly, noop} from './function.js';

export default function Empty(){
}

export function reduce(self, f, init) {
  return init instanceof Reduced ? init.valueOf() : init;
}

export const empty   = new Empty();
export const each    = noop;
export const isEmpty = constantly(true);
export const first   = constantly(null);
export const rest    = constantly(empty);
