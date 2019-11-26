import {ISteppable, IInverse, ICloneable} from '../../protocols';
import {does} from '../../core';
import {implement} from '../protocol';
import {min} from '../number/concrete';
import * as w from '../date/concrete';
import {patch} from '../../associatives';

//dow = 0-6 if day is in first week.  Add 7 for every additional week.
//e.g. Second Saturday is 13 (6 + 7), First Sunday is 0, Second Sunday is 7.

function step(self, dt){
  const som  = patch(dt, w.som());
  const calc = ICloneable.clone(som);
  calc.setMonth(calc.getMonth() + self.n);
  const day  = self.options.day || dt.getDate();
  const eom  = patch(calc, w.eom());
  if (self.options.dow) {
    let dow = self.options.dow;
    if (dow > 6) {
      const days = Math.floor(dow / 7) * 7;
      calc.setDate(calc.getDate() + days);
      dow = dow % 7;
    }
    const offset = dow - calc.getDay();
    calc.setDate(calc.getDate() + offset + (offset < 0 ? 7 : 0));
    return calc;
  } else {
    if (day > eom.getDate()) {
      return eom;
    } else {
      calc.setDate(day);
      return calc;
    }
  }
}

function inverse(self){
  return new self.construct(self.n * -1, self.options);
}

export const behaveAsMonths = does(
  implement(IInverse, {inverse}),
  implement(ISteppable, {step}));