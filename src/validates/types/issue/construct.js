export default function Issue(constraint, path){
  this.constraint = constraint;
  this.path = path;
}

export function issue(constraint, path){
  return new Issue(constraint, path || null);
}

export {Issue}