import {ISteppable, IConverse, ICloneable} from '../../protocols';
import {identity, constantly, effect} from '../../core';
import {implement} from '../protocol';
import {min} from '../number/concrete';
import {inject} from '../../multimethods/amalgam';
import * as w from '../when/construct';
import {encodeable} from '../record/behave';

function converse(self){
  return new self.constructor(self.n * -1, self.options);
}

function step(self, dt){
  const day = self.options.day || dt.getDate();
  if (day > 28) {
    const som  = inject(dt, w.som());
    const calc = ICloneable.clone(som);
    calc.setFullYear(calc.getFullYear() + self.n);
    const eom  = inject(calc, w.eom());
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