import {implement} from '../protocol';
import {does, overload} from '../../core';
import {ISteppable, IDeref} from '../../protocols';
import {encodeable} from '../record/behave';

function deref(self){
  return self.milliseconds;
}

function step(self, dt){
  return new Date(dt.valueOf() + self.milliseconds);
}

export default does(
  encodeable,
  implement(IDeref, {deref}),
  implement(ISteppable, {step}));