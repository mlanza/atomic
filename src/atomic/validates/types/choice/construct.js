export function Choice(options){
  this.options = options;
}

export function choice(options){
  return new Choice(options);
}

Choice.prototype[Symbol.toStringTag] = "Choice";
