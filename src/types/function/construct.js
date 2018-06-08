export default Function;

export function isFunction(self){
  return self && self.constructor === Function;
}