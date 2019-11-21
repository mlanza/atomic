import {implement, does, some, is} from 'atomic/core';
import {ICheckable, ISelection} from '../../protocols';
import {issue} from '../issue';
import {_ as v} from "param.macro";

function check(self, obj){
  return some(is(obj, v), self.types) ? null : [issue(self)];
}

function options(self){
  return self.types;
}

export const behaveAsIsa = does(
  implement(ISelection, {options}),
  implement(ICheckable, {check}));