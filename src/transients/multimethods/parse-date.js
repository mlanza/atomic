import {test, reMatches, mapa, drop, splice, comp, spread, split, mapVals, date, toArray, get} from "atomic/core";
import {conj} from "../protocols/itransientcollection/concrete";
import {multimethod} from "../types/multimethod/construct";
import {method} from "../types/method/construct";
import {_ as v} from "param.macro";

export const reDateString = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
export const reSerialDate = /^\d{4}(-\d{2}(-\d{2}( \d{2}:\d{2}(:\d{2})?)?)?)?$/;
export const reLocalDate  = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})Z?$/;
export const reTimeStamp  = /^\/*Date\((\-?\d+)\)\/*$/;
export const reMDY        = /^(\d{1,2})\/(\d{1,2})\/(\d{2,5})( (\d{1,2}):(\d{2})[ ]?([ap]m)?)?$/i;
export const reNumber     = /^\d+$/i;

export const parseSerialDate = comp(spread(date), split(v, /[-: \/]/));
export const parseLocalDate  = comp(spread(date), mapa(parseInt, v), drop(1, v), reMatches(reLocalDate, v));
export const parseTimeStamp  = comp(date, parseInt, get(v, 1), reMatches(reTimeStamp, v));
export const parseMDY = comp(spread(function(M, d, y, h, m, ampm){
  const mh = h != null ? h + (ampm == "pm" ? 12 : 0) : null;
  return new Date((y < 99 ? 2000 : 0) + y, M - 1, d, mh || 0, m || 0);
}), toArray, mapVals(v, parseInt, test(reNumber, v)), toArray, splice(v, 3, 1, []), drop(1, v), reMatches(reMDY, v));

export const parseDate = multimethod(date);

conj(parseDate,
  method(test(reMDY       , v), parseMDY),
  method(test(reDateString, v), date),
  method(test(reSerialDate, v), parseSerialDate),
  method(test(reLocalDate , v), parseLocalDate),
  method(test(reTimeStamp , v), parseTimeStamp));

export default parseDate;