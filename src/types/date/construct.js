export default Date;

Date.prototype[Symbol.toStringTag] = "Date";

export function isDate(self){
  return self && self.constructor === Date;
}