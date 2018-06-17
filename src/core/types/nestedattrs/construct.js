export default function NestedAttrs(element, key){
  this.element = element;
  this.key = key;
}

export function nestedattrs(element, key){
  return new NestedAttrs(element, key);
}