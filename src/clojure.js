import {overload, curry, partial, constantly, identity, NIL, TRUE, FALSE, ZERO, ONE} from './core';
import * as _ from './core';
import * as c from './coll';
import * as t from './transducer';
import * as types from './types';
import * as associative from './protocols/associative';
import * as collection from './protocols/collection';
import {EMPTY} from './types/empty';
export {constantly, comp, pipe, chain, maybe, opt, partial, isOdd, isEven, tap, nullary, unary, binary, inc, dec} from './core';
export {extend, satisfies} from './protocol';
export {expanding, update, updateIn, assocIn, getIn, cat, concat, selectKeys, someFn, everyPred, isEvery, isAny, isNotAny, iterate, cycle, each, range, butlast, expansive, groupBy, scan, best, into, transduce} from './coll';
export {toLowerCase as lowerCase, toUpperCase as upperCase, startsWith, endsWith, replace, isBlank, split, trim} from './types/string';
export {addClass, hasClass, toggleClass, tag, text, show, hide} from './types/html-element';
export {first, rest} from './protocols/seq';
export {next} from './protocols/next';
export {seq} from './protocols/seqable';
export {nth} from './protocols/indexed';
export {count} from './protocols/counted';
export {reduce} from './protocols/reduce';
export {reduceKv} from './protocols/reduce-kv';
export {parent, closest, detach} from './protocols/hierarchy';
export {hasKey} from './protocols/associative';
export {empty} from './protocols/emptyable';
export {get} from './protocols/lookup';
export {query, fetch} from './protocols/query';
export {append} from './protocols/append';
export {prepend} from './protocols/prepend';
export {swap} from './protocols/swap';
export {deref} from './protocols/deref';
export {reset} from './protocols/reset';
export {publish} from './protocols/publish';
export {subscribe} from './protocols/subscribe';
export {substring as subs} from './types/string';
export {reify} from './types/reified';
export {EMPTY} from './types/empty';
export {observable} from './types/observable';
export {publisher} from './types/publisher';
export const arity        = curry(_.arity);
export const memoize      = overload(null, _.memoize, _.memoizeWith);
export const or           = overload(NIL, identity, _.either, _.or);
export const and          = overload(TRUE, identity, _.both, _.and);
export const any          = overload(NIL, c.expanding(or));
export const all          = overload(TRUE, c.expanding(and));
export const join         = overload(null, c.join, c.joinWith);
export const repeat       = overload(null, c.repeat, c.repeatN);
export const cons         = overload(constantly(EMPTY), c.cons, c.cons, c.consN);
export const conj         = overload(null, null, collection.conj, _.reducing(collection.conj));
export const map          = overload(null, t.map, c.map, c.mapN);
export const mapIndexed   = overload(null, t.mapIndexed, c.mapIndexed);
export const filter       = overload(null, t.filter, c.filter);
export const remove       = overload(null, t.remove, c.remove);
export const detect       = overload(null, t.detect, c.detect);
export const takeWhile    = overload(null, t.takeWhile, c.takeWhile);
export const take         = overload(null, t.take, c.take);
export const takeNth      = overload(null, t.takeNth, c.takeNth);
export const drop         = overload(null, t.drop, c.drop);
export const dropWhile    = overload(null, t.dropWhile, c.dropWhile);
export const keep         = overload(null, t.keep, c.keep);
export const keepIndexed  = overload(null, t.keepIndexed, c.keepIndexed);
export const interpose    = overload(null, t.interpose, c.interpose);
export const dedupe       = overload(t.dedupe, c.dedupe);
export const distinct     = overload(t.distinct, c.distinct);
export const partition    = overload(null, null, c.partition, c.partitionStep, c.partitionStepPad);
export const partitionBy  = overload(null, null, c.partitionBy); //TODO transducer
export const partitionAll = overload(null, null, c.partitionAll, c.partitionAllStep); //TODO transducer
export const sort         = overload(null, c.sort, c.sortWith);
export const sortBy       = overload(null, null, c.sortBy, c.sortByWith);
export const eq           = overload(TRUE , TRUE , c.eq , c.scanning(c.eq));
export const ne           = overload(FALSE, FALSE, c.ne , c.scanning(c.ne));
export const gt           = overload(FALSE, TRUE , c.gt , c.scanning(c.gt));
export const gte          = overload(TRUE , TRUE , c.gte, c.scanning(c.gte));
export const lt           = overload(FALSE, TRUE , c.lt , c.scanning(c.lt));
export const lte          = overload(TRUE , TRUE , c.lte, c.scanning(c.lte));
export const assoc        = overload(null, null, null, associative.assoc, c.assocN);
export const dissoc       = overload(null, null, associative.dissoc, c.dissocN);
export const doall        = overload(null, c.doall, c.doallTimes);
export const dropLast     = overload(null, c.butlast, c.dropLast);
export const str          = overload(constantly(""), c.str, c.strN);
export const some         = overload(FALSE, partial(c.some, identity), c.some);
export const repeatedly   = overload(null, c.repeatedly, c.repeatedlyN);
export const plus         = overload(ZERO, identity, _.add, _.reducing(_.add));
export const minus        = overload(ZERO, partial(_.multiply, -1), _.subtract, _.reducing(_.subtract));
export const mult         = overload(ONE, identity, _.multiply, _.reducing(_.multiply));
export const div          = overload(constantly(NaN), partial(_.divide, 1), _.divide, _.reducing(_.divide));
export const max          = overload(null, identity, c.max);
export const min          = overload(null, identity, c.min);