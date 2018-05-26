export default Function;

export function isFunction(self){
  return self.constructor === Function;
}