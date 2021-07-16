import {overload, constructs} from "../../core.js";
import Symbol from "symbol";

function date7(year, month, day, hour, minute, second, millisecond){
  return new Date(year, month || 0, day || 1, hour || 0, minute || 0, second || 0, millisecond || 0);
}

const create = constructs(Date);

export const date = overload(create, create, date7);

Date.prototype[Symbol.toStringTag] = "Date";
