import {ISteppable, IDeref} from '../../protocols';
import {identity, constantly, effect} from '../../core';
import {implement} from '../protocol';
import {months} from './construct';

function deref(self){
  return self.n;
}

function step(self, dt){
  var d = new Date(dt.valueOf());
  d.setMonth(d.getMonth() + self.n);
  return d;
}

export default effect(
  implement(IDeref, {deref}),
  implement(ISteppable, {step}));