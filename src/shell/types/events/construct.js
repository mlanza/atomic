export function Events(queued){
  this.queued = queued;
}

Events.prototype[Symbol.toStringTag] = "Events";

export function events(){
  return new Events([]);
}
