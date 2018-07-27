import {overload, identity, obj, partly, doto} from "./core/core";
import {IEventProvider, IAppendable, IHash, ITemplate, IMiddleware, IDispatch, IYank, IArray, IAssociative, IBounds, IConverse, ICloneable, ICollection, IComparable, IContent, ICounted, IDecode, IDeref, IDisposable, IEmptyableCollection, IEncode, IEquiv, IEvented, IFind, IFn, IFold, IFunctor, IHideable, IHierarchy, IHtml, IInclusive, IIndexed, IInsertable, IKVReduce, ILookup, IMap, IMapEntry, IMatch, INext, IObject, IOtherwise, IPrependable, IPublish, IReduce, IReset, IReversible, ISeq, ISeqable, ISet, ISteppable, ISubscribe, ISwap, IText} from "./core/protocols";
import {classes, isEmpty, duration, compact, remove, flatten, map, fragment, element, sort, set, flip, realized, comp, isNumber, observable, detect, mapSomeVals, isFunction, apply} from "./core/types";
import {assoc, yank, conj, hash, fmap, reducing, reducekv, includes} from "./core/protocols/concrete";
import {toggles} from "./core/types/element/behave";
import {and, unless, fork} from "./core/predicates";
import {_ as v} from "param.macro";

export * from "./core/core";
export * from "./core/types";
export * from "./core/protocols";
export * from "./core/protocols/concrete";
export * from "./core/predicates";
export * from "./core/associatives";
export * from "./core/multimethods";

function add2(self, n){
  return ISteppable.step(n, self);
}

export const add = overload(null, null, add2, reducing(add2));

function subtract2(self, n){
  return ISteppable.step(IConverse.converse(n), self);
}

export const subtract = overload(null, null, subtract2, reducing(subtract2));

export function addClass(self, name){
  conj(classes(self), name);
}

export function removeClass(self, name){
  yank(classes(self), name);
}

function toggleClass2(self, name){
  transpose(classes(self), name);
}

function toggleClass3(self, name, want){
  include(classes(self), name, want);
}

export const toggleClass = overload(null, null, toggleClass2, toggleClass3);

function memoize1(f){
  return memoize2(f, function(...args){
    return hash(args);
  });
}

function memoize2(f, hash){
  const cache = {};
  return function(...args){
    const key = hash(...args);
    if (cache.hasOwnProperty(key)) {
      return cache[key];
    } else {
      const result = f(...args);
      cache[key] = result;
      return result;
    }
  }
}

export function expansive(f){
  function expand(...xs){
    const contents = IArray.toArray(compact(flatten(xs)));
    return detect(function(content){
      return typeof content === "function";
    }, contents) ? step(contents) : f(...contents);
  }
  function step(contents){
    return function(value){
      const resolve = typeof value === "function" ? partial(comp, value) : function(f){
        return f(value);
      }
      return expand(...map(function(content){
        return typeof content === "function" ? resolve(content) : content;
      }, contents));
    }
  }
  return expand;
}

export const memoize = overload(null, memoize1, memoize2);
export const tag = obj(expansive(element), Infinity);
export const frag = expansive(fragment);

function tagged(f, keys){
  return IReduce.reduce(keys, function(memo, key){
    memo[key] = f(key);
    return memo;
  }, {});
}

export function tags(...names){
  return tagged(tag, names);
}

export function elapsed(self){
  return duration(end(self) - start(self));
}

export function leaves(self){
  return remove(comp(ICounted.count, IHierarchy.children), IHierarchy.descendants(self));
}

export function envelop(before, after){
  return unless(isEmpty, comp(IPrependable.prepend(v, before), IAppendable.append(v, after)));
}

function isNotConstructor(text){
  return !/^[A-Z]./.test(text.name);
}

function impart2(self, keys){
  return reducekv(function(memo, key, value){
    const f = isFunction(value) && isNotConstructor(value) && !includes(keys, key) ? partly : identity;
    return assoc(memo, key, f(value));
  }, {}, self);
}

function impart1(self){
  return impart2(self, []);
}

//convenience for executing partially-applied functions.
export const impart = overload(null, impart1, impart2);

function include2(self, value){
  return toggles(conj(v, value), yank(v, value), includes(v, value), self);
}

function include3(self, value, want){
  return toggles(conj(v, value), yank(v, value), includes(v, value), self, want);
}

export const include = overload(null, null, include2, include3);