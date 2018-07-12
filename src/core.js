import {overload, identity, obj, partly} from "./core/core";
import {classes, isEmpty, duration, compact, remove, flatten, map, fragment, element, sort, set, flip, realized, comp, isNumber, observable, detect, mapSomeVals, isFunction} from "./core/types";
import {IAppendable, IHash, ITemplate, IMiddleware, IDispatch, IYank, IArray, IAssociative, IBounds, IConverse, ICloneable, ICollection, IComparable, IContent, ICounted, IDecode, IDeref, IDisposable, IEmptyableCollection, IEncode, IEquiv, IEvented, IFind, IFn, IFold, IFunctor, IHideable, IHierarchy, IHtml, IInclusive, IIndexed, IInsertable, IKVReduce, ILookup, IMap, IMapEntry, IMatch, INext, IObject, IOtherwise, IPrependable, IPublish, IReduce, IReset, IReversible, ISeq, ISeqable, ISet, ISteppable, ISubscribe, ISwap, IText, IView} from "./core/protocols";
import {include, hash, fmap, reducing} from "./core/protocols/concrete";
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

export const transpose = fork(IInclusive.includes, IYank.yank, ICollection.conj);

export function addClass(self, name){
  ICollection.conj(classes(self), name);
}

export function removeClass(self, name){
  IYank.yank(classes(self), name);
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

//convenience for executing partially-applied functions without macros.
export const impart = mapSomeVals(v, partly, and(isFunction, isNotConstructor));