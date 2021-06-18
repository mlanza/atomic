export function Observable(subscribe, subscriptions){
  this.subscribe = subscribe;
  this.subscriptions = subscriptions;
}

export function observable(subscribe){
  return new Observable(subscribe, []);
}