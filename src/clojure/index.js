import {overload} from "atomic/core";
import * as t from "atomic/transducers";
import * as T from "atomic/core";
import * as I from "atomic/immutables";

export const map = overload(null, t.map, T.map);
export const mapcat = overload(null, t.mapcat, T.mapcat);
export const mapIndexed = overload(null, t.mapIndexed, T.mapIndexed);
export const filter = overload(null, t.filter, T.filter);
export const remove = overload(null, t.remove, T.remove);
export const detect = overload(null, t.detect, T.detect);
export const compact = overload(t.compact, T.compact);
export const dedupe = overload(t.dedupe, T.dedupe);
export const take = overload(null, t.take, T.take);
export const drop = overload(null, t.drop, T.drop);
export const interpose = overload(null, t.interpose, T.interpose);
export const dropWhile = overload(null, t.dropWhile, T.dropWhile);
export const keep = overload(null, t.keep, T.keep);
export const keepIndexed = overload(null, t.keepIndexed, T.keepIndexed);
export const takeWhile = overload(null, t.takeWhile, T.takeWhile);
export const takeNth = overload(null, t.takeNth, T.takeNth);
export const distinct = overload(t.distinct, I.distinct);