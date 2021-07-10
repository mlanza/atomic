export function Multimap(attrs, empty){
  this.attrs = attrs;
  this.empty = empty;
}

export function multimap(attrs, empty){
  return new Multimap(attrs || {}, empty || (() => []));
}
