import {ISteppable} from '../../protocols';
import {identity, constantly, effect} from '../../core';
import {implement} from '../../protocol';
import {months} from './construct';

function step(self, dt){
  var d = new Date(dt.valueOf());
  d.setMonth(d.getMonth() + self.n);
  return d;
}

function converse(self){
  return months(self.n * -1);
}

export default effect(
  implement(ISteppable, {step: step, converse: converse}));