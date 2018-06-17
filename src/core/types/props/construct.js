export default function Props(node){
  this.node = node;
}

export function props(node){
  return new Props(node);
}