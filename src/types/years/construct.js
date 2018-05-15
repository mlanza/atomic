export default function Years(n){
  this.n = n;
}

export function years(n){
  return new Years(n);
}