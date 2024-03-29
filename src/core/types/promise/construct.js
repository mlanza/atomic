import {is} from "../../protocols/imapentry/concrete.js";

export function promise(handler){
  return new Promise(handler);
}

export function isPromise(self){
  return is(self, Promise);
}
