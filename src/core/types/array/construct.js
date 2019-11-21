export const isArray = Array.isArray.bind(Array);
export function emptyArray(){
  return [];
}
export function array(...args){
  return args;
}