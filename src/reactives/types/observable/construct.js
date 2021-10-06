import Symbol from "symbol";

export function Observable(subscribe){
  this.subscribe = subscribe;
}

Observable.prototype[Symbol.toStringTag] = "Observable";

export function observable(subscribe){
  return new Observable(subscribe);
}
