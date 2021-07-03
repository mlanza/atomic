import {behaves, constantly, pre, handle, factory, called, identity, isString, apply, noop, slice, partial, replace, concat, template, key, val, join, merge, filter, map, remove, isObject, specify, implement, doto, get, str, includes, overload, fmap, each, eachkv, obj, IReduce, first, matches, Nil, ICoerceable, extend, doing, reduce} from "atomic/core";
import {element} from "./types/element/construct.js";
import {mounts} from "./protocols/imountable/concrete.js";
import {InvalidHostElementError} from "./types/invalid-host-element-error.js";
import {IValue} from "./protocols/ivalue/instance.js";
import {IEmbeddable} from "./protocols/iembeddable/instance.js";
import Promise from "promise";
import {document} from "dom";
import {passDocumentDefault} from "./types/html-document/construct.js";
import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import * as $ from "atomic/reactives";
export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
export {append, prepend, before, after, omit, empty} from "atomic/transients"; //TODO is reexporting a good idea?

import {behaviors} from "./behaviors.js";
export * from "./behaviors.js";
export const behave = behaves(behaviors, ?);

export const ready = passDocumentDefault(function ready(document, callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
});

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

function tags0(){
  return tags1(element(document));
}

const tags1 = factory;

function tags2(engine, keys){
  return tags3(engine, identity, keys);
}

function tags3(engine, f, keys){
  const tag = tags1(engine);
  return reduce(function(memo, key){
    memo[key] = f(tag(key));
    return memo;
  }, {}, keys);
}

export const tags = overload(tags0, tags1, tags2, tags3);
export const tag = tags();

export const checkbox = passDocumentDefault(function checkbox(document, ...args){
  const el = element(document, 'input', {type: "checkbox"}, ...args);
  function value1(el){
    return el.checked;
  }
  function value2(el, checked){
    el.checked = checked;
  }
  const value = overload(null, value1, value2);
  return doto(el,
    specify(IValue, {value: value}));
});

export const select = passDocumentDefault(function select(document, options, ...args){
  const tag = tags(element(document)),
    select = tag('select'),
    option = tag('option'),
    el = select(...args);
  each(function(entry){
    mut.append(el, option({value: key(entry)}, val(entry)));
  }, options);
  return el;
});

export const input = passDocumentDefault(function input(document, ...args){
  return element(document, 'input', {type: "text"}, ...args);
});

export const textbox = input;

extend(ICoerceable, {toFragment: null});

export const toFragment = ICoerceable.toFragment;

(function(){

  function embed(self, parent, nextSibling) {
    IEmbeddable.embed(parent.ownerDocument.createTextNode(self), parent, nextSibling);
  }

  function toFragment(self, document){
    return document.createRange().createContextualFragment(self);
  }

  doto(String,
    implement(ICoerceable, {toFragment}),
    implement(IEmbeddable, {embed}));

})();

(function(){

  function embed(self, parent, nextSibling) {
    IEmbeddable.embed(parent.ownerDocument.createTextNode(str(self)), parent, nextSibling);
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

  function toFragment(_, document){
    return document.createRange().createContextualFragment("");
  }

  doto(Nil,
    implement(ICoerceable, {toFragment}),
    implement(IEmbeddable, {embed: identity}));

})();
