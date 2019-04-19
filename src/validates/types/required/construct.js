export default function Required(path, test){
  this.path = path;
  this.test = test;
}

export function required(path, test){
  return new Required(path, test);
}