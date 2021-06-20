import {constantly, identity, isString, apply, noop, slice, partial, replace, concat, template, key, val, join, merge, filter, map, remove, isObject, specify, implement, doto, get, str, includes, overload, fmap, each, eachkv, obj, IReduce, first, query, locate, descendants, matches, Nil, ICoerceable, extend, doing} from "atomic/core";
import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import {element} from "./types/element/construct.js";
import {mounts} from "./protocols/imountable/concrete.js";
import {InvalidHostElementError} from "./types/invalid-host-element-error.js";
import {IValue} from "./protocols/ivalue/instance.js";
import {IEmbeddable} from "./protocols/iembeddable/instance.js";
import * as $ from "atomic/reactives";
import Promise from "promise";
import {document} from "dom";

export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
export {append, prepend, before, after, yank, empty} from "atomic/transients";

function ready2(document, callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}

function ready1(callback){
  return ready2(document, callback);
}

const export ready = overload(null, ready1, ready2);

function attr2(self, key){
  if (isString(key)) {
    return self.getAttribute(key);
  } else {
    const pairs = key;
    eachkv(attr3(self, ?, ?), pairs);
  }
}

function attr3(self, key, value){
  self.setAttribute(key, str(value));
}

function attrN(self, ...kvps){
  const stop = kvps.length - 1;
  for(let i = 0; i <= stop; i += 2){
    attr3(self, kvps[i], kvps[i + 1]);
  }
}

export const attr = overload(null, null, attr2, attr3, attrN);

function removeAttr2(self, key){
  self.removeAttribute(key);
}

export const removeAttr = overload(null, null, removeAttr2, doing(removeAttr2));

function prop3(self, key, value){
  self[key] = value;
}

function prop2(self, key){
  return self[key];
}

export const prop = overload(null, null, prop2, prop3);

export function addStyle(self, key, value) {
  self.style[key] = value;
}

function removeStyle2(self, key) {
  self.style.removeProperty(key);
}

function removeStyle3(self, key, value) {
  if (self.style[key] === value) {
    self.style.removeProperty(key);
  }
}

export const removeStyle = overload(null, null, removeStyle2, removeStyle3);

export function addClass(self, name){
  self.classList.add(name);
}

export function removeClass(self, name){
  self.classList.remove(name);
}

function toggleClass2(self, name){
  toggleClass3(self, name, !self.classList.contains(name));
}

function toggleClass3(self, name, want){
  self.classList[want ? "add" : "remove"](name);
}

export const toggleClass = overload(null, null, toggleClass2, toggleClass3);

export function hasClass(self, name){
  return self.classList.contains(name);
}

export function assert(el, selector){
  if (!matches(el, selector)) {
    throw new InvalidHostElementError(el, selector);
  }
}

function mount3(render, config, el){
  return mount4(constantly(null), render, config, el);
}

function mount4(create, render, config, el){
  config.what && $.trigger(el, config.what + ":installing", {bubbles: true, detail: {config}});
  $.trigger(el, "installing", {bubbles: true, detail: {config}});

  const bus = create(config),
        detail = {config, bus};

  el |> $.on(?, "mounting mounted", function(e){
    Object.assign(e.detail, detail);
  });
  el |> render(?, config, bus);
  el |> mounts;

  config.what && $.trigger(el, config.what + ":installed", {bubbles: true, detail});
  $.trigger(el, "installed", {bubbles: true, detail});
  return bus;
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

function sel02(selector, context){
  return query(context, context.querySelectorAll ? selector : v => matches(v, selector));
}

function sel01(selector){
  return sel02(selector, document);
}

function sel00(){
  return descendants(document);
}

export const sel = overload(sel00, sel01, sel02);

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
  const value = overload(null, value1, value2);
  return doto(checkbox(...args),
    specify(IValue, {value: value}));
}

export function select(options, ...args){
  const select = tag('select'),
        option = tag('option'),
        el = select(...args);
  each(function(entry){
    mut.append(el, option({value: key(entry)}, val(entry)));
  }, options);
  return el;
}

export const textbox = tag('input', {type: "text"});

extend(ICoerceable, {toFragment: null});

export const toFragment = ICoerceable.toFragment;

(function(){

  function embed(self, parent, nextSibling) {
    IEmbeddable.embed(document.createTextNode(self), parent, nextSibling);
  }

  function toFragment(self){
    return document.createRange().createContextualFragment(self);
  }

  doto(String,
    implement(ICoerceable, {toFragment}),
    implement(IEmbeddable, {embed}));

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
      mut.assoc(parent, key(entry), val(entry));
    }, self);
  }

  doto(Object, implement(IEmbeddable, {embed}));

})();

(function(){

  function toFragment(_){
    return document.createRange().createContextualFragment("");
  }

  doto(Nil,
    implement(ICoerceable, {toFragment}),
    implement(IEmbeddable, {embed: identity}));

})();