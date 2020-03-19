export function Months(n){
  this.n = n;
}

export function months(n){
  return new Months(n);
}

function from({n}){
  return months(n);
}

Months.from = from;
Months.prototype[Symbol.toStringTag] = "Months";
