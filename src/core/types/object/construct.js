export default Object;
export function isObject(self){
  return self && self.constructor === Object;
}
export function emptyObject(){
  return {};
}