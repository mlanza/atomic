export default Object;
Object.EMPTY = Object.freeze({});
export function isObject(self){
  return self.constructor === Object;
}
