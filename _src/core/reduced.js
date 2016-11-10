export function Reduced(value){
  this.value = value;
}

Reduced.prototype.valueOf = function(){ //TODO Deref protocol?
  return this.value;
}

export function reduced(value){
  return new Reduced(value);
}

export function isReduced(value){
  return value instanceof Reduced;
}

export default reduced;
