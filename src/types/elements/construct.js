export default function Elements(items){
  this.items = items;
}

export function elements(coll){
  return new Elements(coll);
}

export function isElements(coll){
  return coll.constructor === Elements;
}