export default function Months(n){
  this.n = n;
}

export function months(n){
  return new Months(n);
}