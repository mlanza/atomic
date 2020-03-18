import {implement} from '../protocol';
import {does, overload, identity} from '../../core';
import {ISteppable, IDeref, ICoerceable} from '../../protocols';

function deref(self){
  return self.milliseconds;
}

function step(self, dt){
  return new Date(dt.valueOf() + self.milliseconds);
}

export const behaveAsDuration = does(
  implement(ICoerceable, {toDuration: identity}),
  implement(IDeref, {deref}),
  implement(ISteppable, {step}));