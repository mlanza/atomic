import {overload, identity, obj} from "./core/core";
import {classes, isEmpty, duration, compact, remove, flatten, map, fragment, element, sort, set, flip, realized, comp, isNumber, observable, detect} from "./core/types";
import {IAppendable, IHash, ITemplate, IMiddleware, IDispatch, IYank, IArray, IAssociative, IBounds, IConverse, ICloneable, ICollection, IComparable, IContent, ICounted, IDecode, IDeref, IDisposable, IEmptyableCollection, IEncode, IEquiv, IEvented, IFind, IFn, IFold, IFunctor, IHideable, IHierarchy, IHtml, IInclusive, IIndexed, IInsertable, IKVReduce, ILookup, IMap, IMapEntry, IMatch, INext, IObject, IOtherwise, IPrependable, IPublish, IReduce, IReset, IReversible, ISeq, ISeqable, ISet, ISteppable, ISubscribe, ISwap, IText, IView} from "./core/protocols";
import {hash} from "./core/protocols/iencode/concrete";
import {fmap} from "./core/protocols/ifunctor/concrete";
import {reducing} from "./core/protocols/ireduce/concrete";
import {unless, fork} from "./core/predicates";

import * as T from "./core/types";
import {_ as v} from "param.macro";

export * from "./core/core";
export * from "./core/types";
export * from "./core/protocols";
export * from "./core/protocols/iappendable/concrete";
export * from "./core/protocols/iarray/concrete";
export * from "./core/protocols/iassociative/concrete";
export * from "./core/protocols/ibounds/concrete";
export * from "./core/protocols/icloneable/concrete";
export * from "./core/protocols/icollection/concrete";
export * from "./core/protocols/icomparable/concrete";
export * from "./core/protocols/icontent/concrete";
export * from "./core/protocols/iconverse/concrete";
export * from "./core/protocols/icounted/concrete";
export * from "./core/protocols/idecode/concrete";
export * from "./core/protocols/ideref/concrete";
export * from "./core/protocols/idispatch/concrete";
export * from "./core/protocols/idisposable/concrete";
export * from "./core/protocols/iemptyablecollection/concrete";
export * from "./core/protocols/iencode/concrete";
export * from "./core/protocols/iequiv/concrete";
export * from "./core/protocols/ievented/concrete";
export * from "./core/protocols/ifind/concrete";
export * from "./core/protocols/ifn/concrete";
export * from "./core/protocols/ifold/concrete";
export * from "./core/protocols/ifunctor/concrete";
//export * from "./core/protocols/ihash/concrete";
export * from "./core/protocols/ihideable/concrete";
export * from "./core/protocols/ihierarchy/concrete";
export * from "./core/protocols/ihtml/concrete";
export * from "./core/protocols/iindexed/concrete";
export * from "./core/protocols/iinclusive/concrete";
export * from "./core/protocols/iinsertable/concrete";
export * from "./core/protocols/ikvreduce/concrete";
export * from "./core/protocols/ilookup/concrete";
export * from "./core/protocols/imap/concrete";
export * from "./core/protocols/imapentry/concrete";
export * from "./core/protocols/imatch/concrete";
export * from "./core/protocols/imiddleware/concrete";
export * from "./core/protocols/inamed/concrete";
export * from "./core/protocols/inext/concrete";
export * from "./core/protocols/iobject/concrete";
export * from "./core/protocols/iotherwise/concrete";
export * from "./core/protocols/iprependable/concrete";
export * from "./core/protocols/ipublish/concrete";
export * from "./core/protocols/irecord/concrete";
export * from "./core/protocols/ireduce/concrete";
export * from "./core/protocols/ireset/concrete";
export * from "./core/protocols/ireversible/concrete";
export * from "./core/protocols/iseq/concrete";
export * from "./core/protocols/iseqable/concrete";
export * from "./core/protocols/isequential/concrete";
export * from "./core/protocols/iset/concrete";
export * from "./core/protocols/isteppable/concrete";
export * from "./core/protocols/isubscribe/concrete";
export * from "./core/protocols/iswap/concrete";
export * from "./core/protocols/itemplate/concrete";
export * from "./core/protocols/itext/concrete";
export * from "./core/protocols/ivalue/concrete";
export * from "./core/protocols/iview/concrete";
export * from "./core/protocols/iyank/concrete";
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

export const appendTo  = realized(flip(IAppendable.append));
export const prependTo = realized(flip(IPrependable.prepend));
export const transpose = fork(IInclusive.includes, IYank.yank, ICollection.conj);

function include3(self, value, want){
  const has = IInclusive.includes(self, value);
  const f = want ? has ? identity : ICollection.conj : IYank.yank;
  return f(self, value);
}

function include2(self, value){
  return include3(self, value, true);
}

export const include = overload(null, null, include2, include3);

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
  include3(classes(self), name, want);
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
  return unless(isEmpty, comp(prepend(v, before), append(v, after)));
}

function one3(self, key, callback){
  const unsub = IEvented.on(self, key, effect(callback, function(){
    unsub();
  }));
  return unsub;
}

function one4(self, key, selector, callback){
  const unsub = IEvented.on(self, key, selector, effect(callback, function(){
    unsub();
  }));
  return unsub;
}

export const one = overload(null, null, null, one3, one4);

/*

function checkStatus(resp){
  return resp.ok ? Promise.resolve(resp) : Promise.reject(resp);
}

export const request = _.chain(_.request,
  _.prepend(function(params){
    return Object.assign({
      credentials: "same-origin",
      method: "GET",
      headers: {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose"
      }
    }, params);
  }),
  _.append(checkStatus),
  _.append(function(resp){
    return resp.json();
  }),
  _.append(_.getIn(["d", "results"])));
*/
