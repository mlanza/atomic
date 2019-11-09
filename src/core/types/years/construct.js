export function Years(n, options){
  this.n = n;
  this.options = options;
}

export function years(n, options){
  return new Years(n, options || {});
}

function from({n, options}){
  return years(n, options);
}

Years.from = from;