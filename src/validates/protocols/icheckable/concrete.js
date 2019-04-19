import {isString, overload} from 'cloe/core';
import ICheckable from "./instance";
import {issue} from '../../types/issue';

function check3(self, parse, value){
  try{
    if (isString(value)) {
      value = parse(value);
    }
  } catch (ex) {
    return [issue(ex)];
  }
  return ICheckable.check(self, value);
}

export const check = overload(null, null, ICheckable.check, check3);