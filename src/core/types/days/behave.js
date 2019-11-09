import {ISteppable, IInverse, ICloneable} from '../../protocols';
import {does} from '../../core';
import {implement} from '../protocol';
import {min} from '../number/concrete';
import * as w from '../date/concrete';
import {encodeable} from '../record/behave';
import {patch} from '../../associatives';

function step(self, dt){
  const date = new Date(dt.valueOf());
  date.setDate(date.getDate() + self.n);
  return date;
}

function inverse(self){
  return new self.construct(self.n * -1, self.options);
}

export const behaveAsDays = does(
  encodeable,
  implement(IInverse, {inverse}),
  implement(ISteppable, {step}));