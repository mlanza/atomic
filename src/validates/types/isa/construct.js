export function Isa(constructors){
  this.constructors = constructors;
}

export function isa(...constructors){
  return new Isa(constructors);
}