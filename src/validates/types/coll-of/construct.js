export default function CollOf(constraint){
  this.constraint = constraint;
}

export function collOf(constraint){
  return new CollOf(constraint);
}

CollOf.prototype.toString = function(){
  return `invalid ${this.constraint} collection`;
}