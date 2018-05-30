import {implement} from '../protocol';
import {effect} from '../../core';
import {ISteppable, IDeref} from '../../protocols';

function deref(self){
  return self.milliseconds;
}

function step(self, dt){
  return new Date(dt.valueOf() + self.milliseconds);
}

function converse(self){
  return new self.constructor(self.milliseconds * -1);
}

export default effect(
  implement(IDeref, {deref}),
  implement(ISteppable, {step, converse}));