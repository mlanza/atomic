export default Object;
export function isObject(self){
  return self.constructor === Object;
}
export function emptyObject(){
  return {};
}