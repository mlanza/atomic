export default Object;
export const EMPTY_OBJECT = Object.freeze({});

export function isObject(self){
  return self.constructor === Object;
}