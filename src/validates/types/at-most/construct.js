export default function AtMost(n){
  this.n = n;
}

export function atMost(n){
  return new AtMost(n);
}