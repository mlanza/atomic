export function Indexed(obj){
  this.obj = obj;
}

export function indexed(obj){
  return new Indexed(obj);
}