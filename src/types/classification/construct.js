export function Classification(name){
  this.name = name;
}

export function classification(name){
  return new Classification(name);
}

export default Classification;