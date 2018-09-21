import {assoc, str, overload, conj, yank, transpose, trigger, append, absorb, fmap, sub, dispatch, each, expansive, obj, IReduce, first, query, locate, descendants, matches} from "cloe/core";
import {props} from "./types/props/construct";
import {classes} from "./types/space-sep/construct";
import {fragment} from "./types/document-fragment/construct";
import {element} from "./types/element/construct";
import {_ as v} from "param.macro";
export * from "./types";

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
  what && trigger(parent, what + ":" + event, {bubbles: true, detail});
  trigger(parent, event, {bubbles: true, detail});
}

function install3(render, config, parent){
  var img = tag('img'),
      loading = config.spinner ? img(config.spinner) : null;
  loading && append(parent, loading);
  fire(parent, "loading", config.what, {config});
  fmap(resolve(render()),
    mounts,
    function(child){
      append(parent, child);
      loading && yank(loading);
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
    each(sub(bus, v), config.changed);
    each(dispatch(bus, v), config.commands);
    return render(bus);
  }, config, parent);
}

export const install = overload(null, null, null, install3, install4, install5);

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

function sel2(selector, context){
  return query(context, context.querySelectorAll ? selector : matches(v, selector));
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
  return first(descendants(document));
}

export const sel1 = overload(sel10, sel11, sel12);