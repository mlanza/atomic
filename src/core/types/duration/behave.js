import {implement} from '../protocol';
import {does, overload} from '../../core';
import {ISteppable, IDeref} from '../../protocols';

function deref(self){
  return self.milliseconds;
}

function step(self, dt){
  return new Date(dt.valueOf() + self.milliseconds);
}

export const behaveAsDuration = does(
  implement(IDeref, {deref}),
  implement(ISteppable, {step}));