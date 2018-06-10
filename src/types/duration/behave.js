import {implement} from '../protocol';
import {effect, overload} from '../../core';
import {ISteppable, IAssociative, IDeref} from '../../protocols';
import {encodeable} from '../record/behave';

function deref(self){
  return self.milliseconds;
}

function step(self, dt){
  return new Date(dt.valueOf() + self.milliseconds);
}

export default effect(
  encodeable,
  implement(IDeref, {deref}),
  implement(ISteppable, {step}));