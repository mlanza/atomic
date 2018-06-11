import {ISteppable, IConverse, ICloneable} from '../../protocols';
import {identity, constantly, effect} from '../../core';
import {implement} from '../protocol';
import {min} from '../number/concrete';
import * as w from '../date/concrete';
import {encodeable} from '../record/behave';
import {patch} from '../../patch';

function converse(self){
  return new self.constructor(self.n * -1, self.options);
}

function step(self, dt){
  const day = self.options.day || dt.getDate();
  if (day > 28) {
    const som  = patch(dt, w.som());
    const calc = ICloneable.clone(som);
    calc.setFullYear(calc.getFullYear() + self.n);
    const eom  = patch(calc, w.eom());
    calc.setDate(day);
    return min(calc, eom);
  } else {
    const calc = ICloneable.clone(dt);
    calc.setFullYear(calc.getFullYear() + self.n);
    return calc;
  }
}

export default effect(
  encodeable,
  implement(IConverse, {converse}),
  implement(ISteppable, {step}));