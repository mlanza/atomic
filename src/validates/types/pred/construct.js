export default function Predicate(pred, desc){
  this.pred = pred;
  this.desc = desc;
}

export function pred(pred, desc){
  return new Predicate(pred, desc || null);
}