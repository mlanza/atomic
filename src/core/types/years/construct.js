export function Years(n){
  this.n = n;
}

export function years(n){
  return new Years(n);
}

function from({n}){
  return years(n);
}

Years.from = from;
Years.prototype[Symbol.toStringTag] = "Years";
