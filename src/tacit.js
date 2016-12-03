import {overload, curry, partial, partially, flip, subj, constantly, identity, NIL, TRUE, FALSE, ZERO, ONE} from './core';
import * as _ from './core';
import * as c from './coll';
import * as t from './transducer';
import * as string from './types/string';
import * as types from './types';
import {conj as _conj, has as _has} from './protocols/collection';
import {EMPTY} from './types/empty';
export {log, juxt, isTrue, isFalse, see, rand, overload, constantly, comp, pipe, chain, maybe, opt, partial, isOdd, isEven, memoize, doto, firstly as coalesce} from './core';
export {extend} from './protocol';
import {satisfies as _satisfies} from './protocol';
export {sort, dedupe, distinct, doall, repeatedly, expanding, fnil, keys, flatten, reverse, cat, someFn, everyPred, cycle, range, butlast, expansive, groupBy, most, least, toObject, toArray} from './coll';
export {toLowerCase, toUpperCase, isBlank, trim} from './types/string';
export {text, show, hide} from './types/html-element';
import * as el from './types/html-element';
export {first, rest} from './protocols/seq';
export {next} from './protocols/next';
export {seq} from './protocols/seqable';
import {nth as _nth} from './protocols/indexed';
export {count} from './protocols/counted';
import {reduce as _reduce} from './protocols/reduce';
import {reduceKv as _reduceKv} from './protocols/reduce-kv';
import {closest as _closest} from './protocols/hierarchy';
export {parent, detach} from './protocols/hierarchy';
import {assoc as _assoc, dissoc as _dissoc, hasKey as _hasKey} from './protocols/associative';
export {empty} from './protocols/emptyable';
import {get as _get} from './protocols/lookup';
import {query as _query, fetch as _fetch} from './protocols/query';
import {append as _append} from './protocols/append';
import {prepend as _prepend} from './protocols/prepend';
import {swap as _swap} from './protocols/swap';
export {deref} from './protocols/deref';
import {reset as _reset} from './protocols/reset';
import {publish as _publish} from './protocols/publish';
import {subscribe as _subscribe} from './protocols/subscribe';
export {reify} from './types/reified';
export {EMPTY} from './types/empty';
export {observable} from './types/observable';
export {publisher} from './types/publisher';
export const arity        = curry(_.arity);
export const nullary      = arity(0);
export const unary        = arity(1);
export const add          = curry(_.add);
export const subtract     = flip(_.subtract);
export const multiply     = curry(_.multiply);
export const divide       = flip(_.divide);
export const memoizeWith  = curry(_.memoizeWith);
export const inc          = add(+1);
export const dec          = add(-1);
export const join         = curry(c.joinWith);
export const repeat       = curry(c.repeat);
export const into         = partially(c.into);
export const transduce    = partially(c.transduce);
export const cons         = flip(c.cons, 2);
export const conj         = flip(_conj, 2);
export const has          = flip(_has, 2);
export const map          = curry(c.map);
export const mapIndexed   = curry(c.mapIndexed);
export const filter       = curry(c.filter);
export const remove       = curry(c.remove);
export const detect       = curry(c.detect);
export const takeWhile    = curry(c.takeWhile);
export const takeLast     = curry(c.takeLast);
export const take         = curry(c.take);
export const takeNth      = curry(c.takeNth);
export const drop         = curry(c.drop);
export const dropWhile    = curry(c.dropWhile);
export const dropLast     = curry(c.dropLast);
export const keep         = curry(c.keep);
export const keepIndexed  = curry(c.keepIndexed);
export const interpose    = curry(c.interpose);
export const iterate      = curry(c.iterate);
export const merge        = curry(c.merge, 2);
export const mergeWith    = curry(c.mergeWith, 2);
export const partition    = curry(c.partition, 2);
export const partitionBy  = curry(c.partitionBy, 2);
export const partitionAll = curry(c.partitionAll, 2);
export const selectKeys   = curry(c.selectKeys);
export const sortWith     = curry(c.sortWith);
export const sortBy       = curry(c.sortBy);
export const eq           = curry(c.eq);
export const ne           = curry(c.ne);
export const gt           = flip(c.gt);
export const gte          = flip(c.gte);
export const lt           = flip(c.lt);
export const lte          = flip(c.lte);
export const reassign     = curry(c.reassign);
export const matches      = curry(c.matches);
export const str          = curry(c.strN, 2);
export const assoc        = flip(_assoc, 3);
export const dissoc       = flip(_dissoc, 2);
export const hasKey       = flip(_hasKey, 2);
export const swap         = flip(_swap, 2);
export const reset        = flip(_reset, 2);
export const publish      = flip(_publish, 2);
export const subscribe    = flip(_subscribe, 2);
export const query        = subj(_query);
export const fetch        = flip(_fetch, 2);
export const get          = flip(_get, 2);
export const append       = flip(_append, 2);
export const prepend      = flip(_prepend, 2);
export const reduce       = flip(_reduce, 3);
export const reduceKV     = flip(_reduceKv, 3);
export const closest      = flip(_closest, 2);
export const nth          = flip(_nth, 2);
export const hasClass     = flip(el.hasClass);
export const addClass     = flip(el.addClass);
export const removeClass  = flip(el.removeClass);
export const toggleClass  = subj(el.toggleClass);
export const tap          = curry(_.tap);
export const satisfies    = curry(_satisfies, 2);
export const interleave   = curry(c.interleave, 2);
export const each         = curry(c.each);
export const some         = curry(c.some);
export const isEvery      = curry(c.isEvery);
export const isAny        = curry(c.isAny);
export const isNotAny     = curry(c.isNotAny);
export const min          = subj(c.min);
export const max          = subj(c.max);
export const update       = subj(c.update);
export const updateIn     = subj(c.updateIn);
export const assocIn      = flip(c.assocIn);
export const getIn        = flip(c.getIn);
export const scan         = curry(c.scan);
export const best         = curry(c.best);
export const concat       = subj(c.concat);
export const tag          = partially(el.tag);
export const attr         = flip(el.attr);
export const css          = flip(el.css);
export const is           = curry(_.is);
export const isIdentical  = curry(_.isIdentical);
export const isFunction   = is(Function);
export const isString     = is(String);
export const isNumber     = is(Number);
export const isObject     = is(Object);
export const isRegExp     = is(RegExp);
export const second       = nth(1);
export const third        = nth(2);
export const or           = subj(_.firstly);
export const and          = subj(_.lastly);
export const split        = subj(string.split);
export const subs         = subj(string.substring);
export const startsWith   = flip(string.startsWith, 2);
export const endsWith     = flip(string.endsWith, 2);
export const replace      = flip(string.replace, 3);