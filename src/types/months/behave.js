import {ISteppable, IConverse, ICloneable} from '../../protocols';
import {identity, constantly, effect} from '../../core';
import {implement} from '../protocol';
import {months} from './construct';
import {startOfMonth, endOfMonth} from '../date/concrete';

function step(self, dt){
  const som  = startOfMonth(dt);
  const sday = 6 - som.getDay();
  const calc = ICloneable.clone(som);
  calc.setMonth(calc.getMonth() + self.n);
  const eom  = endOfMonth(calc);
  calc.setDate(self.options.day || dt.getDate());
  const tgt  = calc > eom ? eom : calc;
  if (self.options.dow != null) {
    const tday   = 6 - startOfMonth(tgt).getDay();
    const offset = tday - sday;
    tgt.setDate(tgt.getDate() + offset);
    while(tgt.getDay() != self.options.dow){
      tgt.setDate(tgt.getDate() - 1);
    }
  }
  return tgt;
}

function converse(self){
  return months(self.n * -1, self.options);
}

export default effect(
  implement(IConverse, {converse}),
  implement(ISteppable, {step}));