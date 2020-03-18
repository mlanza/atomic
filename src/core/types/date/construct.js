import {overload, constructs} from '../../core';
import {Symbol} from '../symbol/construct';

function date7(year, month, day, hours, minutes, seconds, milliseconds){
  return new Date(year, month || 0, day || 1, hours || 0, minutes || 0, seconds || 0, milliseconds || 0);
}

const create = constructs(Date);

export const date = overload(create, create, date7);

Date.prototype[Symbol.toStringTag] = "Date";
Date.create = create;