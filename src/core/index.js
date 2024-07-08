import {foldkv, overload, partial, unary, type, curry, toggles, identity, obj, partly, comp, doto, does, branch, unspread, applying, execute, noop, constantly, once, isFunction, isString, pipe, chain} from "./core.js";
import {IForkable, IDeref, IFn, IAssociative, ICloneable, IHierarchy, ILookup, ISeq} from "./protocols.js";
import {addMethod} from "./types/multimethod/concrete.js";
import {set, maybe, toArray, opt, satisfies, spread, duration, remove, sort, flip, realized, apply, realize, isNil, reFindAll, mapkv, period, selectKeys, mapVals, reMatches, test, date, emptyList, cons, list, days, recurrence, emptyArray} from "./types.js";
import {isBlank, str, replace} from "./types/string.js";
import {persistentSet, PersistentSet} from "./types/persistent-set/construct.js";
import {isSome} from "./types/nil.js";
import _config from "./config.js";
import {implement, specify, behaves} from "./types/protocol/concrete.js";
import {into, concat, detect, map, mapa, splice, drop, join, some, last, butlast, takeWhile, dropWhile, filter} from "./types/lazy-seq.js";
export const config = _config;
export {filter} from "./types/lazy-seq.js";
export {iterable} from "./types/lazy-seq/behave.js";
export * from "./core.js";
export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
export {sequence} from "./shared.js";
import * as p from "./protocols/concrete.js";
import * as T from "./types.js";
import {extend, forward} from "./types/protocol/concrete.js";
import {Protocol} from "./types/protocol/construct.js";
import iprotocol from "./types/protocol/behave.js";
import {coerce} from "./coerce.js";
export * from "./coerce.js";

iprotocol(Protocol);

import {behaviors} from "./behaviors.js";
export * from "./behaviors.js";
export const behave = behaves(behaviors, ?);

export const numeric = test(/^\d+$/i, ?);

function siblings(self){
  const parent = p.parent(self);
  if (parent){
    return filter(function(sibling){
      return sibling !== self;
    }, p.children(parent));
  } else {
    return emptyList();
  }
}

function prevSiblings(self){
  return reverse(takeWhile(function(sibling){
    return sibling !== self;
  }, siblings(self)));
}

function nextSiblings(self){
  return p.rest(dropWhile(function(sibling){
    return sibling !== self;
  }, siblings(self)));
}

const prevSibling = comp(p.first, p.prevSiblings);
const nextSibling = comp(p.first, p.nextSiblings);
const parents = p.upward(p.parent);
const descendants = p.downward(p.children);
const root = comp(last, parents);

function closest(self, pred){
  return detect(pred, cons(self, p.parents(self)));
}

extend(IHierarchy, {siblings, prevSibling, nextSibling, prevSiblings, nextSiblings, parents, closest, root});

function recurs2(pd, step) {
  return recurrence(p.start(pd), p.end(pd), step);
}

export const recurs = overload(null, recurs2(?, days(1)), recurs2);

export function inclusive(self){
  return new self.constructor(self.start, p.add(self.end, self.step), self.step, self.direction);
}

function cleanlyN(f, ...args){
  try {
    return f(...args);
  } catch {
    return null;
  }
}

export const cleanly = overload(null, curry(cleanlyN, 2), cleanlyN);

//#if _EXPERIMENTAL
export function grab(self, path){
  const keys = toArray(path);
  let obj = self;
  for(const key of keys){
    obj = obj[key];
  }
  return obj;
}

export function edit(self, key, f){
  return editIn(self, [key], f);
}

export function editIn(self, path, f){
  const addr = p.clone(path);
  let obj = chain(self, grab(?, path), p.clone);
  obj = f(obj) || obj; //use command or query
  while (addr.length) {
    let parent = chain(self, grab(?, butlast(addr)), p.clone);
    let key = last(addr);
    parent[key] = obj;
    obj = parent;
    addr.pop();
  }
  return obj;
}

export function plop(self, key, value){
  return plopIn(self, [key], value);
}

export function plopIn(self, path, value){
  const key = last(path);
  return editIn(self, toArray(butlast(path)), function(obj){
    obj[key] = value;
  });
}
//#endif

export function deconstruct(dur, ...units){
  let memo = dur;
  return mapa(function(unit){
    const n = p.fmap(p.divide(memo, unit), Math.floor);
    memo = p.subtract(memo, p.fmap(unit, constantly(n)));
    return n;
  }, units);
}

export function distinctly(equals){
  function distinct0(){ //transducer
    return function(rf){
      let seen = persistentSet([], equals);
      return overload(rf, rf, function(memo, value){
        if (p.includes(seen, value)) {
          return memo;
        }
        seen = p.conj(seen, value);
        return rf(memo, value);
      });
    }
  }
  const distinct1 = persistentSet(?, equals);
  return overload(distinct0, distinct1);
}

export const distinct = distinctly(p.equiv);
export const unique = distinct;
export const second = branch(satisfies(ISeq, ?), comp(ISeq.first, ISeq.rest), p.prop("second"));

export function expands(f){
  function expand(...contents){
    return detect(isFunction, contents) ? postpone(...contents) : f(...contents);
  }
  function postpone(...contents){
    return function(value){
      const expanded = map(function(content){
        return isFunction(content) ? content(value) : content;
      }, contents);
      return apply(expand, expanded);
    }
  }
  return expand;
}

function filled2(f, g){
  return function(...args){
    return p.seq(filter(isNil, args)) ? g(...args) : f(...args);
  }
}

function filled1(f){
  return filled2(f, noop);
}

export const filled = overload(null, filled1, filled2);

export function elapsed(self){
  return duration(p.end(self) - p.start(self));
}

export function collapse(...args){
  return some(isBlank, args) ? "" : join("", args);
}

function impartable(f){
  return isFunction(f) && !/^[A-Z]./.test(p.name(f));
}

function impart2(source, f){ //overriding `f` with `identity` nullifies its effects
  return decorating3(source, impartable, f); //impart to functions which are not also constructors
}

function impart3(target, source, f){
  return decorating4(target, source, impartable, f);
}

export const impart = overload(null, null, impart2, impart3);

//convenience for wrapping batches of functions/modules.
function decorating2(source, f){
  return decorating3(source, identity, f);
}

function decorating3(source, pred, f){
  return decorating4({}, source, pred, f);
}

function decorating4(target, source, pred, f){
  for(const [key, value] of Object.entries(source)){
    target[key] = pred(value, key) ? f(value) : value;
  }
  return target;
}

export const decorating = overload(null, null, decorating2, decorating3, decorating4);

function include2(self, value){
  return toggles(p.conj(?, value), p.omit(?, value), p.includes(?, value), self);
}

function include3(self, value, want){
  return toggles(p.conj(?, value), p.omit(?, value), p.includes(?, value), self, want);
}

export const include = overload(null, null, include2, include3);

//can be used to expose all module exports
export const inventory = pipe(Object.keys, join(",\n", ?), str("{\n", ?, "\n}"));
export const fmt = expands(str);

export function when(pred, ...xs) {
  return last(map(realize, pred ? xs : null));
}

//#if _EXPERIMENTAL
export function readable(keys){
  const lookup = keys ? function(self, key){
    if (!p.includes(keys, key)) {
      throw new Error("Cannot read from " + key);
    }
    return self[key];
  } : function(self, key){
    return self[key];
  }
  return implement(ILookup, {lookup});
}

export function writable(keys){
  function clone(self){
    return Object.assign(Object.create(self.constructor.prototype), self);
  }
  function contains(self, key){
    return self.hasOwnProperty(key);
  }
  const assoc = keys ? function(self, key, value){
    if (!p.includes(keys, key) || !contains(self, key)) {
      throw new Error("Cannot write to " + key);
    }
    const tgt = clone(self);
    tgt[key] = value;
    return tgt;
  } : function(self, key, value){
    if (!contains(self, key)) {
      throw new Error("Cannot write to " + key);
    }
    const tgt = clone(self);
    tgt[key] = value;
    return tgt;
  }
  return does(
    implement(ICloneable, {clone}),
    implement(IAssociative, {assoc, contains}));
}
//#endif

function scanKey1(better){
  return partial(scanKey, better);
}

function scanKey3(better, k, x){
  return x;
}

function scanKey4(better, k, x, y){
  return better(k(x), k(y)) ? x : y;
}

function scanKeyN(better, k, x, ...args){
  return apply(p.reduce, partial(scanKey3, better), x, args);
}

export const scanKey = overload(null, scanKey1, null, scanKey3, scanKey4, scanKeyN);
export const maxKey  = scanKey(p.gt);
export const minKey  = scanKey(p.lt);

function absorb2(tgt, src){
  return p.reducekv(function(memo, key, value){
    const was = p.get(memo, key);
    let absorbed;
    if (was == null) {
      absorbed = value;
    } else if (descriptive(value)) {
      absorbed = into(p.empty(was), absorb(was, value));
    } else if (satisfies(ISequential, value)) {
      absorbed = into(p.empty(was), concat(was, value));
    } else {
      absorbed = value;
    }
    return p.assoc(memo, key, absorbed);
  }, tgt, src || p.empty(tgt));
}

export const absorb = overload(constantly({}), identity, absorb2, p.reducing(absorb2));

export function attempt(f, ...args){
  return Promise.all(args).then(function(args){
    try {
      return Promise.resolve(f(...args));
    } catch (ex) {
      return Promise.reject(ex);
    }
  });
}

export function unfork(self){
  return new Promise(function(resolve, reject){
    p.fork(self, reject, resolve);
  });
}

addMethod(coerce, [T.PersistentSet, Array], into([], ?));
addMethod(coerce, [Set, Array], unary(Array.from));
addMethod(coerce, [Array, T.PersistentSet], into(set([]), ?));
addMethod(coerce, [Array, Set], arr => new Set(arr));
addMethod(coerce, [Number, String], unary(str));
addMethod(coerce, [Number, Date], unary(date));
addMethod(coerce, [T.Duration, T.Duration], identity);
addMethod(coerce, [T.Period, T.Duration], function(self){
  return self.end == null || self.start == null ? duration(Number.POSITIVE_INFINITY) : duration(self.end - self.start);
});
addMethod(coerce, [Promise, Promise], identity);
addMethod(coerce, [Error, Promise], unfork);
addMethod(coerce, [T.Task, Promise], unfork);
addMethod(coerce, [Object, Object], identity);
addMethod(coerce, [Array, Object], into({}, ?));
addMethod(coerce, [Array, Array], identity);
//#if _EXPERIMENTAL
addMethod(coerce, [T.Right, Promise], unfork);
addMethod(coerce, [T.Left, Promise], unfork);
addMethod(coerce, [T.Okay, Promise], unfork);
//#endif
addMethod(coerce, [T.Concatenated, Array], unary(Array.from));
addMethod(coerce, [T.EmptyList, Array], emptyArray);
addMethod(coerce, [T.List, Array], unary(Array.from));
addMethod(coerce, [Array, T.List], unary(spread(list)));
addMethod(coerce, [T.Range, Array], unary(Array.from));
addMethod(coerce, [T.Nil, Array], emptyArray);
addMethod(coerce, [T.IndexedSeq, Array], unary(Array.from));
addMethod(coerce, [T.RevSeq, Array], unary(Array.from));
addMethod(coerce, [T.LazySeq, Array], unary(Array.from))
addMethod(coerce, [Object, Array], into([], ?));
addMethod(coerce, [String, Array], p.split(?, ""));
