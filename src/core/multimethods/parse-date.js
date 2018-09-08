import {multimethod} from "../types/multimethod/construct";
import {test, reMatches} from "../types/reg-exp/concrete";
import {mapa, drop, splice} from "../types/lazy-seq/concrete";
import {comp, spread, see} from "../types/function/concrete";
import {split} from "../types/string/concrete";
import {mapSomeVals} from "../types/object/concrete";
import {date} from "../types/date/construct";
import {toArray} from "../protocols/iarray/concrete";
import {on} from "../protocols/ievented/concrete";
import {get} from "../protocols/ilookup/concrete";
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
  const mh = h + (ampm == "pm" ? 12 : 0);
  return new Date((y < 99 ? 2000 : 0) + y, M - 1, d, mh, m);
}), toArray, mapSomeVals(v, parseInt, test(reNumber, v)), toArray, splice(v, 3, 1, []), drop(1, v), reMatches(reMDY, v));

export const parseDate = multimethod(date);

on(parseDate, test(reMDY       , v), parseMDY);
on(parseDate, test(reDateString, v), date);
on(parseDate, test(reSerialDate, v), parseSerialDate);
on(parseDate, test(reLocalDate , v), parseLocalDate);
on(parseDate, test(reTimeStamp , v), parseTimeStamp);

export default parseDate;