import {isPromise} from "./construct.js";
import {fmap} from "../../protocols/ifunctor/concrete.js";
import {fork} from "../../protocols/iforkable/concrete.js";
import {detect} from "../lazy-seq/concrete.js"
import Promise from "promise";

export function awaits(f){
  return function(...args){
    if (detect(isPromise, args)) {
      return fmap(Promise.all(args), function(args){
        return f.apply(this, args);
      });
    } else {
      return f.apply(this, args);
    }
  }
}

export function fromTask(task){
  return new Promise(function(resolve, reject){
    fork(task, reject, resolve);
  });
}

Promise.fromTask = fromTask;