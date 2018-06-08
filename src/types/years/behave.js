import {ISteppable, IDeref, ICloneable} from '../../protocols';
import {identity, constantly, effect} from '../../core';
import {implement} from '../protocol';
import {startOfMonth, endOfMonth} from '../date/concrete';
import {min} from '../number/concrete';

function deref(self){
  return self.n;
}

function step(self, dt){
  if (dt.getDate() > 28) {
    const som  = startOfMonth(dt);
    const calc = ICloneable.clone(som);
    calc.setFullYear(calc.getFullYear() + self.n);
    const eom  = endOfMonth(calc);
    calc.setDate(dt.getDate());
    return min(calc, eom);
  } else {
    const calc = ICloneable.clone(dt);
    calc.setFullYear(calc.getFullYear() + self.n);
    return calc;
  }
}

export default effect(
  implement(IDeref, {deref}),
  implement(ISteppable, {step}));