import {overload} from "../../core";
import {days} from '../days';
import {period} from "./construct";
import {add} from "../../protocols/isteppable/concrete";

function week1(period){
  return week2(period, 0);
}

function week2(pd, firstDayOfWeek){
  firstDayOfWeek = firstDayOfWeek || 0;
  var lastDayOfWeek = 6 - firstDayOfWeek,
      soffset = Math.abs(firstDayOfWeek - pd.start.getDay()),
      eoffset = Math.abs(lastDayOfWeek  - pd.end.getDay()),
      start = add(pd.start, days(-soffset)),
      end   = add(pd.end  , days(eoffset));
  return period(start, end);
}

export const week = overload(null, week1, week2);