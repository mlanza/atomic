import {identity, always, noop, is} from '../core';
import {extend} from '../protocol';
import {indexedSeq} from './indexed-seq';
import Query from '../protocols/query';
import Hierarchy from '../protocols/hierarchy';
import Associative from '../protocols/associative';
import Lookup from '../protocols/lookup';
import Collection from '../protocols/collection';
import {query, fetch} from '../types/html-document';
export {query, fetch} from '../types/html-document';

export function parent(self){
  return self.parentNode;
}

export function closest(self, selector){
  return self == null ? null : self.matches(selector) ? self : Hierarchy.closest(parent(self), selector);
}

export function hasKey(self, key){
  return !!self.attributes.getNamedItem(key);
}

export function assoc(self, key, value){
  var attr  = document.createAttribute(key);
  attr.value = value;
  self.attributes.setNamedItem(attr);
  return self;
}

export function get(self, key){
  var attr = self.attributes.getNamedItem(key);
  return attr ? attr.value : null;
}

export function conj(self, child){
  self.appendChild(is(child, String) ? document.createTextNode(child) : child);
  return self;
}

export function cons(self, child){
  self.insertBefore(is(child, String) ? document.createTextNode(child) : child, self.firstChild);
  return self;
}

export function text(self){
  return self.textContent;
}

export function style(self, key, value){
  self.style[key] = value;
  return self;
}

export function show(self){
  return style(self, "display", "inherit");
}

export function hide(self){
  return style(self, "display", "none");
}

export function remove(self){
  self.parentElement.removeChild(self);
  return self;
}

export function hasClass(self, str){
  return self.classList.contains(str);
}

export function addClass(self, str){
  self.classList.add(str);
  return self;
}

export function removeClass(self, str){
  self.classList.remove(str);
  return self;
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