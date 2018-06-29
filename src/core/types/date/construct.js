import {overload} from '../../core';
import Symbol from '../symbol/construct';

export default Date;

function date7(year, month, day, hour, minute, second, millisecond){
  return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0, millisecond || 0);
}

function from(timestamp){
  return new Date(timestamp);
}

export const date = overload(Date.now, from, date7);

Date.prototype[Symbol.toStringTag] = "Date";
Date.from = from;

export function isDate(self){
  return self && self.constructor === Date;
}

export {Date};