export default Array;
export function isArray(self){
  return self instanceof Array;
}
Array.EMPTY = Object.freeze([]);