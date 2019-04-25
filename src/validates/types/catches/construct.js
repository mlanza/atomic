export default function Catches(constraint){
  this.constraint = constraint;
}

export function catches(constraint){
  return new Catches(constraint);
}

export {Catches}