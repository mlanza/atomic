export default function Comparison(f, other){
  this.f = f;
  this.other = other;
}

export function comparison(f, other){
  return new Comparison(f, other);
}

Comparison.prototype.toString = function(){
  return "invalid";
}

export {Comparison}