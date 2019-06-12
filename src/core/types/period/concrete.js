import {overload} from "../../core";
import {days} from '../days';
import {period} from "./construct";
import {sod, eod, som, eom, soy, eoy} from '../date/concrete';
import {add} from "../../protocols/isteppable/concrete";
import {start, end} from '../../protocols/ibounds/concrete';

export function day(obj){
  return period(patch(start(obj), sod()), patch(end(obj), eod()));
}

export function month(obj){
  return day(period(patch(start(obj), som()), patch(end(obj), eom())));
}

export function year(obj){ //TODO optional arg: first month of year
  return day(period(patch(start(obj), soy()), patch(end(obj), eoy())));
}

export function week(pd, fdow){
  var firstDayOfWeek = fdow || 0,
      lastDayOfWeek = 6 - firstDayOfWeek,
      s       = start(pd),
      e       = end(pd),
      soffset = Math.abs(firstDayOfWeek - s.getDay()),
      eoffset = Math.abs(lastDayOfWeek  - e.getDay());
  return period(add(s, days(-soffset)), add(e, days(eoffset)));
}