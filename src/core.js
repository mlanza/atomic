import {overload, identity, obj, partly, doto, constantly} from "./core/core";
import {IDecorated, IEventProvider, IAppendable, IHash, ITemplate, IMiddleware, IDispatch, IYank, IArray, IAssociative, IBounds, IInverse, ICloneable, ICollection, IComparable, IContent, ICounted, IDecode, IDeref, IDisposable, IEmptyableCollection, IEncode, IEquiv, IEvented, IFind, IFn, IFork, IFunctor, IHideable, IHierarchy, IHtml, IInclusive, IIndexed, IInsertable, IKVReduce, ILookup, IMap, IMapEntry, IMatch, INext, IObject, IOtherwise, IPrependable, IPublish, IReduce, IReset, IReversible, ISeq, ISeqable, ISet, ISteppable, ISubscribe, ISwap, IText} from "./core/protocols";
import {spread, specify, maybe, each, see, props, classes, isEmpty, duration, compact, remove, flatten, map, fragment, element, sort, set, flip, realized, comp, isNumber, observable, detect, mapSomeVals, isFunction, apply} from "./core/types";
import {transient, persistent, mounts, deref, get, assoc, yank, conj, hash, otherwise, fmap, reducing, reducekv, includes, excludes} from "./core/protocols/concrete";
import {toggles} from "./core/types/element/behave";
import {resolve} from "./core/types/promise/concrete";
import {and, unless} from "./core/predicates";
import {absorb} from "./core/associatives";
import {_ as v} from "param.macro";

export * from "./core/core";
export * from "./core/types";
export * from "./core/protocols";
export * from "./core/protocols/concrete";
export * from "./core/predicates";
export * from "./core/associatives";
export * from "./core/multimethods";

export const second = comp(ISeq.first, INext.next);

function add2(self, n){
  return ISteppable.step(n, self);
}

export const add = overload(null, null, add2, reducing(add2));

function subtract2(self, n){
  return ISteppable.step(IInverse.inverse(n), self);
}

export const subtract = overload(null, null, subtract2, reducing(subtract2));

function prop3(self, key, value){
  return assoc(props(self), key, value);
}

function prop2(self, key){
  return get(props(self), key);
}

export const prop = overload(null, null, prop2, prop3);

export function addClass(self, name){
  conj(classes(self), name);
  return self;
}

export function removeClass(self, name){
  yank(classes(self), name);
  return self;
}

function toggleClass2(self, name){
  transpose(classes(self), name);
  return self;
}

function toggleClass3(self, name, want){
  include(classes(self), name, want);
  return self;
}

export const toggleClass = overload(null, null, toggleClass2, toggleClass3);

function install5(defaults, create, render, config, parent){
  config = absorb({changed: [], commands: []}, defaults || {}, config || {});
  var bus = create(config);
  IAppendable.append(parent, mounts(render(bus), bus));
  each(ISubscribe.sub(bus, v), config.changed);
  each(IDispatch.dispatch(bus, v), config.commands);
}

function install4(defaults, render, config, parent){
  config = absorb({}, defaults || {}, config || {});
  var img = tag('img'),
      loading = img({src: config.spinner, alt: "Loading..."});
  IAppendable.append(parent, loading);
  fmap(resolve(render(config)),
    mounts,
    IAppendable.append(parent, v),
    function(){
      IYank.yank(loading);
    });
}

export const install = overload(null, null, null, null, install4, install5);

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

export function envelop(before, after){
  return unless(isEmpty, comp(IPrependable.prepend(v, before), IAppendable.append(v, after)));
}

function isNotConstructor(text){
  return !/^[A-Z]./.test(text.name);
}

//convenience for wrapping batches of functions.
export function impart(self, f){ //set retraction to identity to curb retraction overhead
  return reducekv(function(memo, key, value){
    return assoc(memo, key, isFunction(value) && isNotConstructor(value) ? f(value) : value);
  }, {}, self);
}

function include2(self, value){
  return toggles(conj(v, value), yank(v, value), includes(v, value), self);
}

function include3(self, value, want){
  return toggles(conj(v, value), yank(v, value), includes(v, value), self, want);
}

export const include = overload(null, null, include2, include3);

export function opt(value, ...fs){
  return otherwise(fmap(maybe(value), ...fs), null);
}

export function withMutations(self, f){
  return persistent(f(transient(self)));
}