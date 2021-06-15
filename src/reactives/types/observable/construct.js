export function Observable(subscribed){
  this.subscribed = subscribed;
}

export function observable(subscribed){
  return new Observable(subscribed);
}