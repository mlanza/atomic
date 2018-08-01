export default function Publisher(subscribers){
  this.subscribers = subscribers;
}

export function publisher(){
  return new Publisher([]);
}