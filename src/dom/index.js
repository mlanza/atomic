import {constantly, identity, apply, noop, slice, partial, replace, concat, template, key, val, join, merge, filter, map, remove, isObject, specify, implement, doto, assoc, get, str, includes, overload, conj, yank, append, absorb, fmap, each, obj, IReduce, first, query, locate, descendants, matches, reducekv, Number, String, Nil} from "cloe/core";
import * as _ from "cloe/core";
import {fragment} from "./types/document-fragment/construct";
import {element} from "./types/element/construct";
import {mounts} from "./protocols/imountable/concrete";
import InvalidHostElementError from "./types/invalid-host-element-error";
import IValue from "./protocols/ivalue/instance";
import IEmbeddable from "./protocols/iembeddable/instance";
import Promise from "promise";
import {_ as v} from "param.macro";
import * as $ from "cloe/reactives";
export * from "./types";
export * from "./protocols";
export * from "./protocols/concrete";

function prop3(self, key, value){
  self[key] = value;
  return self;
}

function prop2(self, key){
  return self[key];
}

export const prop = overload(null, null, prop2, prop3);

export function addStyle(self, key, value) {
  self.style[key] = value;
  return self;
}

function removeStyle2(self, key) {
  self.style.removeProperty(key);
  return self;
}

function removeStyle3(self, key, value) {
  if (self.style[key] === value) {
    self.style.removeProperty(key);
  }
  return self;
}

export const removeStyle = overload(null, null, removeStyle2, removeStyle3);

export function addClass(self, name){
  self.classList.add(name);
  return self;
}

export function removeClass(self, name){
  self.classList.remove(name);
  return self;
}

function toggleClass2(self, name){
  return toggleClass3(self, name, !self.classList.contains(name));
}

function toggleClass3(self, name, want){
  self.classList[want ? "add" : "remove"](name);
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

export function assert(el, selector){
  if (!matches(el, selector)) {
    throw new InvalidHostElementError(el, selector);
  }
}

function component3(render, config, el){
  return component4(constantly(null), render, config, el);
}

function component4(create, render, config, el){
  $.trigger(el, "installing", {bubbles: true, detail: {config}});
  const bus = create(config),
        detail = {config, bus};
  doto(el,
    $.on(v, "mounting mounted", function(e){
      Object.assign(e.detail, detail);
    }),
    render(v, config, bus),
    mounts);
  $.trigger(el, "installed", {bubbles: true, detail});
  return bus;
}

export const component = overload(null, null, null, component3, component4);

function view2(render, config){
  return view3(constantly(null), render, config);
}

function view3(create, render, config){
  const bus = create(config),
        detail = {config, bus};
  return doto(render(config, bus),
    $.on(v, "mounting mounted", function(e){
      Object.assign(e.detail, detail);
    }),
    mounts);
}

export const view = overload(null, null, view2, view3);

function load(config, parent, promise) {
  return config.spinner ? new Promise(function(resolve, reject){
    const loading = element('img', config.spinner);
    append(parent, loading);
    fire(parent, "loading", config.what, {config});
    fmap(promise,
      doto(v, resolve),
      function(child){
        yank(loading);
        fire(parent, "loaded", config.what, {config, child});
      });
  }) : promise;
}

function mount3(render, config, parent, bus){
  const detail = {config, bus};
  return load(config, parent, new Promise(function(resolve, reject){
    fmap(Promise.resolve(render(config, bus)),
      doto(v,
        $.on(v, "mounting mounted", function(e){
          Object.assign(e.detail, detail);
        }),
        mounts,
        append(parent, v),
        function(el){
          resolve([el, detail]);
        }));
  }));
}

function mount4(create, render, config, parent){
  return mount3(render, config, parent, create(config));
}

export const mount = overload(null, null, null, mount3, mount4);

export const markup = obj(function(name, ...contents){
  const attrs = map(function(entry){
    return template("{0}=\"{1}\"", key(entry), replace(val(entry), /"/g, '&quot;'));
  }, apply(merge, filter(isObject, contents)));
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

function attr3(self, key, value) {
  self.setAttribute(key, value);
  return self;
}

function attr2(self, key) {
  return self.getAttribute(key);
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