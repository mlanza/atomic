export function EmptyList(){
}

export function emptyList(){
  return new EmptyList();
}

EmptyList.prototype[Symbol.toStringTag] = "EmptyList";

EmptyList.prototype.hashCode = function(){
  return -0;
}
