export default function AtLeast(n){
  this.n = n;
}

export function atLeast(n){
  return new AtLeast(n);
}