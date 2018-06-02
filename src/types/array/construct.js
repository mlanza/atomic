export default Array;
export function isArray(self){
  return self instanceof Array;
}
export const EMPTY_ARRAY  = Object.freeze([]);