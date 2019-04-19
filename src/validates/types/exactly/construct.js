export default function Exactly(n){
  this.n = n;
}

export function exactly(n){
  return new Exactly(n);
}