import {identity, apply, noop, slice, partial, replace, concat, template, key, val, join, mashup, filter, map, remove, isObject, specify, implement, doto, assoc, dissoc, get, str, include, includes, overload, conj, yank, transpose, append, absorb, fmap, each, obj, IReduce, first, query, locate, descendants, matches, reducekv, Number, String, Nil} from "cloe/core";
import * as _ from "cloe/core";
import {attrs} from "./types/attrs/construct";
import {props} from "./types/props/construct";
import {classes} from "./types/space-sep/construct";
import {style} from "./types/nested-attrs/construct";
import {fragment} from "./types/document-fragment/construct";
import {element} from "./types/element/construct";
import {mounts} from "./protocols/imountable/concrete";
import IValue from "./protocols/ivalue/instance";
import IEmbeddable from "./protocols/iembeddable/instance";
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

export function addStyle(self, key, value) {
  const s = style(self);
  if (!includes(s, [key, value])) {
    assoc(s, key, value);
  }
  return self;
}

function removeStyle2(self, key) {
  dissoc(style(self), key);
  return self;
}

function removeStyle3(self, key, value) {
  const s = style(self);
  if (includes(s, [key, value])) {
    dissoc(s, key);
  }
  return self;
}

export const removeStyle = overload(null, null, removeStyle2, removeStyle3);

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
  return self.classList.contains(name);
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

function mount3(render, config, parent){
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

function mount4(create, render, config, parent){
  mount3(function(config){
    const $bus = create(config);
    return doto(render($bus),
      $.on(v, "mounting mounted", function(e){
        e.detail.bus = $bus;
      }));
  }, absorb({changed: [], commands: []}, config || {}), parent);
}

export const mount = overload(null, null, null, mount3, mount4);
export const tagged = obj(function(name, ...contents){
  const attrs = map(function(entry){
    return template("{0}=\"{1}\"", key(entry), replace(val(entry), /"/g, '&quot;'));
  }, apply(mashup, filter(isObject, contents)));
  const content = map(str, remove(isObject, contents));
  return join("", concat(["<" + name + " " + join(" ", attrs) + ">"], content, "</" + name + ">"));
}, Infinity);

export function tag(){
  return apply(partial, element, slice(arguments));
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

function attr3(node, key, value) {
  return assoc(attrs(node), key, value);
}

function attr2(node, key) {
  return get(attrs(node), key);
}

export const attr = overload(null, null, attr2, attr3);

(function(){

  function embed(self, parent, nextSibling) {
    IEmbeddable.embed(document.createTextNode(self), parent, nextSibling);
  }

  doto(String, implement(IEmbeddable, {embed}));

})();

(function(){

  function embed(self, parent, nextSibling) {
    IEmbeddable.embed(document.createTextNode(str(self)), parent, nextSibling);
  }

  doto(Number, implement(IEmbeddable, {embed}));

})();

(function(){

  function embed(self, parent) {
    each(function(entry){
      assoc(parent, key(entry), val(entry));
    }, self);
  }

  doto(Object, implement(IEmbeddable, {embed}));

})();


(function(){

  doto(Nil, implement(IEmbeddable, {embed: identity}));

})();