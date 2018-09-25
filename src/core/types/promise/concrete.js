import Promise from "./construct";
import {fork} from "../../protocols/ifork/concrete";

export function fromTask(task){
  return new Promise(function(resolve, reject){
    fork(task, reject, resolve);
  });
}

Promise.fromTask = fromTask;