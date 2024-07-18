import {is} from "../../protocols/imapentry/concrete.js";
import {task} from "../task/construct.js";

export function promise(handler){
  return new Promise(handler);
}

export function isPromise(self){
  return is(self, Promise);
}

export function tasked(promised){
  return function(...args){
    return task(function(reject, resolve){
      promised(...args).then(resolve, reject);
    });
  }
}
