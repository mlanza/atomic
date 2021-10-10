import Symbol from "symbol";

export function Moniker(name){
  this.name = name;
}

Moniker.prototype.toString = function(){
  return this.name;
}

Moniker.prototype[Symbol.toStringTag] = "Moniker";

export function moniker(name){
  return new Moniker(name);
}
