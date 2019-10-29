export default function TransientObject(obj){
  this.obj = obj;
}

export function transientObject(obj){
  return new TransientObject(obj);
}