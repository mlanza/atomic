import {ISteppable, IConverse, ICloneable} from '../../protocols';
import {identity, constantly, effect} from '../../core';
import {implement} from '../protocol';
import {startOfMonth, endOfMonth} from '../date/concrete';
import {min} from '../number/concrete';
import {years} from './construct';

function converse(self){
  return years(self.n * -1, self.options);
}

function step(self, dt){
  const day = self.options.day || dt.getDate();
  if (day > 28) {
    const som  = startOfMonth(dt);
    const calc = ICloneable.clone(som);
    calc.setFullYear(calc.getFullYear() + self.n);
    const eom  = endOfMonth(calc);
    calc.setDate(day);
    return min(calc, eom);
  } else {
    const calc = ICloneable.clone(dt);
    calc.setFullYear(calc.getFullYear() + self.n);
    return calc;
  }
}

export default effect(
  implement(IConverse, {converse}),
  implement(ISteppable, {step}));