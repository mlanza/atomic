import Promise from "promise";

export function promise(handler){
  return new Promise(handler);
}

export function isPromise(self){
  return self instanceof Promise;
}
