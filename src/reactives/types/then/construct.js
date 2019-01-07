import {weakMap} from "cloe/core";

export default function Then(source, callbacks) {
  this.source = source;
  this.callbacks = callbacks;
}

export function then(source){
  return new Then(source, weakMap());
}