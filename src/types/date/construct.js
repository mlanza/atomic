export default Date;

export function isDate(self){
  return self.constructor === Date;
}