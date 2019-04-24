export default function AtMost(n){
  this.n = n;
}

export function atMost(n){
  return new AtMost(n);
}

AtMost.prototype.toString = function(){
  return `cannot have more than ${this.n}`;
}

export {AtMost}