export default function Nodes(items){
  this.items = items;
}

export function nodes(coll){
  return new Nodes(coll);
}

export function isNodes(coll){
  return coll.constructor === Nodes;
}