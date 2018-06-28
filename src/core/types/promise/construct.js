import Promise from "promise";
export default Promise;

function promise(handler){
  return new Promise(handler);
}

Promise.from = promise;

export function isPromise(self){
  return self && self instanceof Promise;
}

export {Promise};