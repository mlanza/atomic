export default function Method(pred, f){
  this.pred = pred;
  this.f = f;
}

export function method(pred, f){
  return new Method(pred, f);
}