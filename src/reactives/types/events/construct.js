export default function Events(queued){
  this.queued = queued;
}

export function events(){
  return new Events([]);
}