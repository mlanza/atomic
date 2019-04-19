export default function CollOf(constraint){
  this.constraint = constraint;
}

export function collOf(constraint){
  return new CollOf(constraint);
}