export default function Required(path, constraint){
  this.path = path;
  this.constraint = constraint;
}

export function required(path, constraint){
  return new Required(path, constraint);
}

Required.prototype.toString = function(){
  return "required";
}

export {Required};