export default function Describe(desc, constraint) {
  this.desc = desc;
  this.constraint = constraint;
}

export function describe(desc, constraint){
  return new Describe(desc, constraint);
}

Describe.prototype.toString = function(){
  return this.desc;
}

export {Describe}

export function want(what, constraint) {
  return describe(`must be a valid ${what}`, constraint);
}
