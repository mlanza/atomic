export function Attrs(node){
  this.node = node;
}

export function attrs(node){
  return new Attrs(node);
}