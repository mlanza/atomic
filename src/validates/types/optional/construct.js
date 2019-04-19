export default function Optional(path, test){
  this.path = path;
  this.test = test;
}

export function optional(path, test){
  return new Optional(path, test);
}