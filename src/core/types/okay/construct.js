import {isError} from '../error/construct';

export default function Okay(value){
  this.value = value;
}

export function okay(x){
  return isError(x) ? x : new Okay(x);
}

export function isOkay(x){
  return x instanceof Okay;
}