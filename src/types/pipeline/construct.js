import {identity} from "../../core";

export function Pipeline(how, fs){
  this.how = how;
  this.fs = fs;
}

export function pipeline(how, fs){
  return new Pipeline(how || identity, fs || []);
}

export default Pipeline;