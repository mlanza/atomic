export default Date;

export function isDate(self){
  return self && self.constructor === Date;
}