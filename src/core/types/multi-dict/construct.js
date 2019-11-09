export function MultiDict(attrs, empty){
  this.attrs = attrs;
  this.empty = empty;
}

export function multidict(attrs, empty){
  return new MultiDict(attrs || {}, empty);
}