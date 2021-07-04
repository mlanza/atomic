import * as _ from "atomic/core";
import {conj} from "../protocols/itransientcollection/concrete.js";
import {multimethod} from "../types/multimethod/construct.js";
import {method} from "../types/method/construct.js";

export const parseDate = multimethod(_.date);

conj(parseDate,
  method(_.test(_.mdy       , ?), _.fromMDY),
  method(_.test(_.jsonDate  , ?), _.fromJsonDate),
  method(_.test(_.serialDate, ?), _.fromSerialDate),
  method(_.test(_.localDate , ?), _.fromLocalDate),
  method(_.test(_.timestamp , ?), _.fromTimestamp));
