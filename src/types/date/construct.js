export default Date;

function from(timestamp){
  return new Date(timestamp);
}

Date.prototype[Symbol.toStringTag] = "Date";
Date.from = from;

export function isDate(self){
  return self && self.constructor === Date;
}

export {Date};