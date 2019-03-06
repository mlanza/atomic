export default function Broadcast(subscribers){
  this.subscribers = subscribers;
}

export function broadcast(subscribers){
  return new Broadcast(subscribers || []);
}