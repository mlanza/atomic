import {implement, does, some, is} from 'atomic/core';
import {ICheckable} from '../../protocols';
import {issue} from '../issue';
import {_ as v} from "param.macro";

function check(self, obj){
  return some(is(obj, v), self.constructors) ? null : [issue(self)];
}

export const behaveAsIsa = does(
  implement(ICheckable, {check}));