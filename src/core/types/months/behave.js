import {ISteppable, ICoerceable, IMultipliable} from '../../protocols';
import {does} from '../../core';
import {dadd} from '../date/concrete';
import {implement} from '../protocol';
import {duration} from '../duration';

function step(self, dt){
  return dt == null ? null : dadd(dt, self.n, "month");
}

function mult(self, n){
  return new self.constructor(self.n * n);
}

function toDuration(self){
  return duration(self.n * 1000 * 60 * 60 * 24 * 30.4375);
}

export const behaveAsMonths = does(
  implement(IMultipliable, {mult}),
  implement(ICoerceable, {toDuration}),
  implement(ISteppable, {step}));