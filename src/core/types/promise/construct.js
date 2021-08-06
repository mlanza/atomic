import Promise from "promise";
import {is} from "../../protocols/inamable/concrete.js";

export function promise(handler){
  return new Promise(handler);
}

export function isPromise(self){
  return is(self, Promise);
}
