export default function Predicate(f, args){
  this.f = f;
  this.args = args;
}

export function pred(f, ...args){
  return new Predicate(f, args);
}

export {Predicate}