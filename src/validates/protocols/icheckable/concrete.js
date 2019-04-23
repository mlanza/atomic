import {overload} from 'cloe/core';
import ICheckable from "./instance";
import {parses} from '../../types/parses';

function check3(self, parse, value){
  return ICheckable.check(parses(parse, self), value);
}

export const check = overload(null, null, ICheckable.check, check3);