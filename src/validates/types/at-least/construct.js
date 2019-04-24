export default function AtLeast(n){
  this.n = n;
}

export function atLeast(n){
  return new AtLeast(n);
}

AtLeast.prototype.toString = function(){
  return `cannot have fewer than ${this.n}`;
}

export {AtLeast}