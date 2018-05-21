export default function Elem(el){
  this.el = el
}

export function elem(el){
  return new Elem(el);
}