import {overload} from '../../core';
import Symbol from '../symbol/construct';

export default Date;

function date7(year, month, day, hours, minutes, seconds, milliseconds){
  return new Date(year, month - 1, day, hours || 0, minutes || 0, seconds || 0, milliseconds || 0);
}

function from(timestamp){
  return new Date(timestamp);
}

export const date = overload(Date.now, from, date7);

Date.prototype[Symbol.toStringTag] = "Date";
Date.from = from;

export {Date};