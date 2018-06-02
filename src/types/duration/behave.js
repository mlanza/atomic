import {implement} from '../protocol';
import {effect} from '../../core';
import {ISteppable, IDeref} from '../../protocols';

function deref(self){
  return self.milliseconds;
}

function step(self, dt){
  return new Date(dt.valueOf() + self.milliseconds);
}

export default effect(
  implement(IDeref, {deref}),
  implement(ISteppable, {step}));