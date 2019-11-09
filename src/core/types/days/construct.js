export function Days(n, options){
  this.n = n;
  this.options = options;
}

export function days(n, options){
  return new Days(n, options || {});
}

export function weeks(n){
  return days(n * 7);
}

function from({n, days}){
  return days(n, options);
}

Days.from = from;