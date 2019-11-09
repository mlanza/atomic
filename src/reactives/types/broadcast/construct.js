export function Broadcast(observers){
  this.observers = observers;
}

export function broadcast(observers){
  return new Broadcast(observers || []);
}