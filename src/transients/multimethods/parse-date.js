import {test, date, jsonDate, serialDate, localDate, timestamp, mdy, fromJsonDate, fromSerialDate, fromLocalDate, fromTimestamp, fromMDY} from "atomic/core";
import {conj} from "../protocols/itransientcollection/concrete";
import {multimethod} from "../types/multimethod/construct";
import {method} from "../types/method/construct";

export const parseDate = multimethod(date);

conj(parseDate,
  method(test(mdy       , ?), fromMDY),
  method(test(jsonDate  , ?), fromJsonDate),
  method(test(serialDate, ?), fromSerialDate),
  method(test(localDate , ?), fromLocalDate),
  method(test(timestamp , ?), fromTimestamp));