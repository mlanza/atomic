import {constructs} from "../../core.js";

export function set(xs){
  return new Set(xs);
}

export function emptySet(){
  return set([]);
}
