import {ISteppable, ICoerceable, IMultipliable} from '../../protocols';
import {does} from '../../core';
import {implement} from '../protocol';
import {duration} from '../duration';
import {datestep} from '../date/concrete';

const step = datestep("year");

function mult(self, n){
  return new self.constructor(self.n * n, self.options);
}

function toDuration(self){
  return duration(self.n * 1000 * 60 * 60 * 24 * 365.25);
}

export const behaveAsYears = does(
  implement(IMultipliable, {mult}),
  implement(ICoerceable, {toDuration}),
  implement(ISteppable, {step}));