import {duration} from './construct';
import {implement} from '../../protocol';
import {effect} from '../../core';
import {ISteppable} from '../../protocols';

function step(self, dt){
  return new Date(dt.valueOf() + self.milliseconds);
}

function converse(self){
  return duration(self.milliseconds * -1);
}

export default effect(
  implement(ISteppable, {step: step, converse: converse}));