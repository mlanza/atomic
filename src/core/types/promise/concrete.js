import Promise from "./construct";
import {fork} from "../../protocols/ifork/concrete";

export function resolve(value){
  return Promise.resolve(value);
}

export function reject(value){
  return Promise.reject(value);
}

export function all(value){
  return Promise.all(value);
}

export function fromTask(task){
  return new Promise(function(resolve, reject){
    fork(task, reject, resolve);
  });
}

Promise.fromTask = fromTask;