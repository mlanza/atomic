import {overload, identity, obj, partly, doto, constantly, branch, unspread, applying} from "./core/core";
import {IDecorated, IEventProvider, IAppendable, IHash, ITemplate, IMiddleware, IDispatch, IYank, IArray, IAssociative, IBounds, IInverse, ICloneable, ICollection, IComparable, IContent, ICounted, IDecode, IDeref, IDisposable, IEmptyableCollection, IEncode, IEquiv, IEvented, IFind, IFn, IFork, IFunctor, IHideable, IHierarchy, IHtml, IInclusive, IIndexed, IInsertable, IKVReduce, ILookup, IMap, IMapEntry, IMatch, INext, IObject, IOtherwise, IPrependable, IPublish, IReduce, IReset, IReversible, ISeq, ISeqable, ISet, ISteppable, ISubscribe, ISwap, IText} from "./core/protocols";
import {filter, spread, specify, maybe, each, see, props, classes, isEmpty, duration, compact, remove, flatten, map, fragment, element, sort, set, flip, realized, comp, isNumber, observable, mapSomeVals, isFunction, apply} from "./core/types";
import {descendants, query, locate, transient, persistent, mounts, deref, get, assoc, yank, conj, hash, otherwise, fmap, reducing, reducekv, includes, excludes} from "./core/protocols/concrete";
import {toggles} from "./core/types/element/behave";
import {resolve} from "./core/types/promise/concrete";
import {str} from "./core/types/string/concrete";
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

function fire(parent, event, what, detail){
  what && IEvented.trigger(parent, what + ":" + event, {bubbles: true, detail});
  IEvented.trigger(parent, event, {bubbles: true, detail});
}

function install3(render, config, parent){
  var img = tag('img'),
      loading = config.spinner ? img(config.spinner) : null;
  loading && IAppendable.append(parent, loading);
  fire(parent, "loading", config.what, {config});
  fmap(resolve(render()),
    mounts,
    function(child){
      IAppendable.append(parent, child);
      loading && IYank.yank(loading);
      fire(parent, "loaded", config.what, {config, child});
    });
}

function install4(defaults, render, config, parent){
  config = absorb({}, defaults || {}, config || {});
  install3(function(){
    return render(config);
  }, config, parent);
}

function install5(defaults, create, render, config, parent){
  config = absorb({changed: [], commands: []}, defaults || {}, config || {});
  install3(function(){
    const bus = create(config);
    each(ISubscribe.sub(bus, v), config.changed);
    each(IDispatch.dispatch(bus, v), config.commands);
    return render(bus);
  }, config, parent);
}

export const install = overload(null, null, null, install3, install4, install5);

export function argumented(f, g){
  return comp(spread(f), unspread(g));
}

export function expansive(f){
  const expand = argumented(
    branch(unspread(locate(v, isFunction)), postpone, f),
    comp(IArray.toArray, compact, flatten));
  function postpone(...contents){
    return function(value){
      const resolve = isFunction(value) ? comp(value, v) : applying(value);
      return expand(...map(branch(isFunction, resolve, identity), contents));
    }
  }
  return expand;
}

export const fmt = expansive(str);
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

function sel2(selector, context){
  return query(context, selector);
}

function sel1(selector){
  return sel2(selector, document);
}

function sel0(){
  return descendants(document);
}

export const sel = overload(sel0, sel1, sel2);

function sel12(selector, context){
  return locate(context, selector);
}

function sel11(selector){
  return sel12(selector, document);
}

function sel10(){
  return ISeq.first(descendants(document));
}

export const sel1 = overload(sel10, sel11, sel12);