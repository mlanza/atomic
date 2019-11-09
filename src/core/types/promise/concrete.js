import {Promise, isPromise} from "./construct";
import {fmap} from "../../protocols/ifunctor/concrete";
import {fork} from "../../protocols/ifork/concrete";
import {detect} from "../lazy-seq/concrete"

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