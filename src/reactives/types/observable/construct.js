export function Observable(subscribe){
  this.subscribe = subscribe;
}

export function observable(subscribe){
  return new Observable(subscribe);
}