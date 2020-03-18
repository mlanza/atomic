import {test, date, jsonDate, serialDate, localDate, timestamp, mdy, fromJsonDate, fromSerialDate, fromLocalDate, fromTimestamp, fromMDY} from "atomic/core";
import {conj} from "../protocols/itransientcollection/concrete";
import {multimethod} from "../types/multimethod/construct";
import {method} from "../types/method/construct";
import {_ as v} from "param.macro";

export const parseDate = multimethod(date);

conj(parseDate,
  method(test(mdy       , v), fromMDY),
  method(test(jsonDate  , v), fromJsonDate),
  method(test(serialDate, v), fromSerialDate),
  method(test(localDate , v), fromLocalDate),
  method(test(timestamp , v), fromTimestamp));