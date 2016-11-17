import {identity, noop, is} from '../core';
import {extend} from '../protocol';
import Seqable from '../protocols/seqable';
import Query from '../protocols/query';
import Hierarchy from '../protocols/hierarchy';
import Associative from '../protocols/associative';
import Lookup from '../protocols/lookup';
import Collection from '../protocols/collection';
import IndexedSeq from './indexed-seq';
import {each} from '../coll';

export function text(el){
  return el.textContent;
}

export function attr(obj, el){
  each(Seqable.seq(obj), function(pair){
    assoc(el, pair[0], pair[1]);
  });
  return el
}

export function css(obj, el){
  each(Seqable.seq(obj), function(pair){
    el.style[pair[0]] = pair[1];
  });
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

//TODO extract logic in util.js tag for passing in unrealized functions until non-functions are passed in and all results are fully resolved
export function tag(name){
  return function(){
    var el = document.createElement(name);
    array.each(arguments, function(item){
      object.is(item, Object) ? object.each(item, function(pair){
        assoc(el, pair[0], pair[1]);
      }) : append(el, item);
    });
    return el;
  }
}

function fetch(self, selector){
  return self.querySelector(selector) || null;
}

function query(self, selector){
  return new IndexedSeq(self.querySelectorAll(selector));
}

function parent(el){
  return el.parentNode;
}

function closest(el, selector){
  return el == null ? null : el.matches(selector) ? el : Hierarchy.closest(parent(el), selector);
}

function remove(el){
  el.parentElement.removeChild(el);
  return el;
}

function hasKey(el, key){
  return !!el.attributes.getNamedItem(key);
}

function assoc(el, key, value){
  var attr  = document.createAttribute(key);
  attr.value = value;
  el.attributes.setNamedItem(attr);
  return el;
}

function get(el, key){
  var attr = el.attributes.getNamedItem(key);
  return attr ? attr.value : null;
}

function conj(el, child){
  el.appendChild(is(child, String) ? document.createTextNode(child) : child);
  return el;
}

function cons(el, child){
  el.insertBefore(is(child, String) ? document.createTextNode(child) : child, el.firstChild);
  return el;
}

extend(Collection, HTMLElement, {
  cons: cons,
  conj: conj
});

extend(Lookup, HTMLElement, {
  get: get
})

extend(Associative, HTMLElement, {
  assoc: assoc,
  hasKey: hasKey
});

extend(Query, HTMLElement, {
  query: query,
  fetch: fetch
});

extend(Hierarchy, HTMLElement, {
  parent: parent,
  closest: closest,
  remove: remove
});

export default HTMLElement;