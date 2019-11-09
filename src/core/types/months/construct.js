export function Months(n, options){
  this.n = n;
  this.options = options;
}

export function months(n, options){
  return new Months(n, options || {});
}

function from({n, months}){
  return months(n, options);
}

Months.from = from;