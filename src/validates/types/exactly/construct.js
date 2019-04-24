export default function Exactly(n){
  this.n = n;
}

export function exactly(n){
  return new Exactly(n);
}

Exactly.prototype.toString = function(){
  return `must have exactly ${this.n}`;
}

export {Exactly}