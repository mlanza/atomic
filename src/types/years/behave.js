import {ISteppable} from '../../protocols';
import {identity, constantly, effect} from '../../core';
import {implement} from '../protocol';
import {years} from './construct';

function step(self, dt){
  var d = new Date(dt.valueOf());
  d.setFullYear(d.getFullYear() + self.n);
  return d;
}

function converse(self){
  return years(self.n * -1);
}

export default effect(
  implement(ISteppable, {step, converse}));