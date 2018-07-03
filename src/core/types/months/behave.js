import {ISteppable, IConverse, ICloneable} from '../../protocols';
import {identity, constantly, effect} from '../../core';
import {implement} from '../protocol';
import {min} from '../number/concrete';
import * as w from '../date/concrete';
import {encodeable} from '../record/behave';
import {patch} from '../../associatives';

function step(self, dt){
  const som  = patch(dt, w.som());
  const sday = 6 - som.getDay();
  const calc = ICloneable.clone(som);
  calc.setMonth(calc.getMonth() + self.n);
  const eom  = patch(calc, w.eom());
  calc.setDate(self.options.day || dt.getDate());
  const tgt  = min(calc, eom);
  if (self.options.dow != null) {
    const tday   = 6 - patch(tgt, w.som()).getDay();
    const offset = tday - sday;
    tgt.setDate(tgt.getDate() + offset);
    //rollback on month size overflows
    while(tgt.getDay() != self.options.dow){
      tgt.setDate(tgt.getDate() - 1);
    }
  }
  return tgt;
}

function converse(self){
  return new self.construct(self.n * -1, self.options);
}

export default effect(
  encodeable,
  implement(IConverse, {converse}),
  implement(ISteppable, {step}));