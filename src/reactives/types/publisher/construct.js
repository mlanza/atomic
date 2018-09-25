export default function Publisher(subscribers){
  this.subscribers = subscribers;
}

export function publisher(subscribers){
  return new Publisher(subscribers || []);
}