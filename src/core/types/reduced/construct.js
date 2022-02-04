export function Reduced(value){
  this.value = value;
}

Reduced.prototype[Symbol.toStringTag] = "Reduced";
Reduced.prototype.valueOf = function(){
  return this.value;
}

export function reduced(value){
  return new Reduced(value);
}
