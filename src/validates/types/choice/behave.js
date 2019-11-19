import {implement, does, includes} from 'atomic/core';
import {ICheckable, ISelection} from '../../protocols';
import {issue} from '../issue';

function options(self){
  return self.options;
}

function check(self, value){
  return includes(self.options, value) ? null : [issue(self)];
}

export const behaveAsChoice = does(
  implement(ISelection, {options}),
  implement(ICheckable, {check}));