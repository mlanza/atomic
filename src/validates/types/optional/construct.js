export default function Optional(path, constraint){
  this.path = path;
  this.constraint = constraint;
}

export function optional(path, constraint){
  return new Optional(path, constraint);
}

export {Optional}