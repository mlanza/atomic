import {is} from '../core';
import {extend} from '../protocol';
import Query from '../protocols/query';
import Hierarchy from '../protocols/hierarchy';
import Associative from '../protocols/associative';
import Lookup from '../protocols/lookup';
import Collection from '../protocols/collection';
import Append from '../protocols/append';
import Prepend from '../protocols/prepend';
import IndexedSeq from './indexed-seq';
import {each, coll} from '../coll';

function hasKey(el, key){
  return !!el.attributes.getNamedItem(key);
}

function assoc(el, key, value){
  var attr = document.createAttribute(key);
  attr.value = value;
  el.attributes.setNamedItem(attr);
  return el;
}

export function text(el){
  return el.textContent;
}

export function attr(obj, el){
  each(function(pair){
    assoc(el, pair[0], pair[1]);
  }, obj);
  return el
}

export function css(obj, el){
  each(function(pair){
    el.style[pair[0]] = pair[1];
  }, obj);
  return el;
}

export function hasClass(str, el){
  return el.classList.contains(str);
}

export function addClass(str, el){
  el.classList.add(str);
  return el;
}

export function removeClass(str, el){
  el.classList.remove(str);
  return el;
}

export function toggleClass(str, el){
  return setClass(!hasClass(str, el), str, el)
}

export function setClass(on, str, el){
  el.classList[on ? 'add' : 'remove'](str);
  return f(str, el);
}

export function tag(name, ...params){
  var el = document.createElement(name);
  each(function(item){
    is(Object, item) ? attr(item, el) : append(el, item);
  }, params);
  return el;
}

function fetch(self, selector){
  return self.querySelector(selector) || null;
}

function query(self, selector, top){
  const xs = top === 1 ? coll(self.querySelector(selector)) : new IndexedSeq(self.querySelectorAll(selector));
  return arguments.length === 2 ? xs : take(top, xs);
}

function parent(el){
  return el.parentNode;
}

function closest(el, selector){
  return el == null ? null : el.matches(selector) ? el : Hierarchy.closest(parent(el), selector);
}

function detach(el){
  el.parentElement.removeChild(el);
  return el;
}

function get(el, key){
  var attr = el.attributes.getNamedItem(key);
  return attr ? attr.value : null;
}

function append(el, child){
  el.appendChild(is(String, child) ? document.createTextNode(child) : child);
  return el;
}

function prepend(el, child){
  el.insertBefore(is(String, child) ? document.createTextNode(child) : child, el.firstChild);
  return el;
}

export default extend(HTMLElement, Append, {
  append: append
}, Prepend, {
  prepend: prepend
}, Collection, {
  conj: append
}, Lookup, {
  get: get
}, Associative, {
  assoc: assoc,
  hasKey: hasKey
}, Query, {
  query: query,
  fetch: fetch
}, Hierarchy, {
  parent: parent,
  closest: closest,
  detach: detach
});