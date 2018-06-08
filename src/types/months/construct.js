export default function Months(n, options){
  this.n = n;
  this.options = options;
}

export function months(n, options){
  return new Months(n, options || {});
}