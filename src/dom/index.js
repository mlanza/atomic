import {specify, doto, assoc, str, include, includes, overload, conj, yank, transpose, append, absorb, fmap, each, expansive, obj, IReduce, first, query, locate, descendants, matches, reducekv} from "cloe/core";
import * as _ from "cloe/core";
import {props} from "./types/props/construct";
import {classes} from "./types/space-sep/construct";
import {fragment} from "./types/document-fragment/construct";
import {element} from "./types/element/construct";
import {mounts} from "./protocols/imountable/concrete";
import IValue from "./protocols/ivalue/instance";
import Promise from "promise";
import {_ as v} from "param.macro";
import * as $ from "cloe/reactives";
export * from "./types";
export * from "./protocols";
export * from "./protocols/concrete";

function prop3(self, key, value){
  return assoc(props(self), key, value);
}

function prop2(self, key){
  return get(props(self), key);
}

export const prop = overload(null, null, prop2, prop3);

export function addClass(self, name){
  const clss = classes(self);
  if (!includes(clss, name)) {
    conj(clss, name);
  }
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

export function hasClass(self, name){
  return includes(classes(self), name);
}

function fire(parent, event, what, detail){
  what && $.trigger(parent, what + ":" + event, {bubbles: true, detail});
  $.trigger(parent, event, {bubbles: true, detail});
}

function view2(render, config){
  return doto(render(config),
    _.config(v, config),
    mounts);
}

function view3(create, render, config){
  const $bus = create(config);
  return doto(render(config, $bus),
    _.config(v, config),
    mounts,
    $.on(v, "mounting mounted", function(e){
      e.detail.bus = $bus;
    }));
}

export const view = overload(null, null, view2, view3);

function load3(render, config, parent){
  const img = tag('img'),
        loading = config.spinner ? img(config.spinner) : null;
  loading && append(parent, loading);
  fire(parent, "loading", config.what, {config});
  fmap(Promise.resolve(render(config)),
    mounts,
    function(child){
      append(parent, child);
      loading && yank(loading);
      fire(parent, "loaded", config.what, {config, child});
    });
}

function load4(create, render, config, parent){
  load3(function(config){
    const $bus = create(config);
    return doto(render($bus),
      $.on(v, "mounting mounted", function(e){
        e.detail.bus = $bus;
      }));
  }, absorb({changed: [], commands: []}, config || {}), parent);
}

export const load = overload(null, null, null, load3, load4);
export const tag  = obj(expansive(element), Infinity);
export const frag = expansive(fragment);

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

export function checkbox(...args){
  const checkbox = tag('input', {type: "checkbox"});
  function value1(el){
    return el.checked;
  }
  function value2(el, checked){
    el.checked = checked;
  }
  var value = overload(null, value1, value2);
  return doto(checkbox(...args),
    specify(IValue, {value: value}));
}

export function select(options, ...args){
  const select = tag('select'),
        option = tag('option');
  return reducekv(function(memo, key, value){
    return append(memo, option({value: key}, value));
  }, select(...args), options);
}

export const textbox = tag('input', {type: "text"});