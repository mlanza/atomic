import {
  assoc as _assoc,
  identity,
  toggles,
  constantly,
  does,
  overload,
  partial,
  doto,
  noop,
  get,
  implement,
  specify,
  satisfies,
  downward,
  upward,
  concat,
  cons,
  lazySeq,
  each,
  map,
  compact,
  filter,
  last,
  comp,
  isObject,
  isString,
  isFunction,
  isNumber,
  trim,
  split,
  str,
  apply,
  emptyList,
  weakMap,
  isIdentical,
  ILocate,
  IQuery,
  ISequential,
  IMatch,
  IYank,
  IInclusive,
  IInsertable,
  IArray,
  IAppendable,
  IPrependable,
  IAssociative,
  IMap,
  ICloneable,
  ICollection,
  INext,
  ISeq,
  ISeqable,
  ICounted,
  ILookup,
  IReduce,
  IEmptyableCollection,
  IHierarchy
} from 'cloe/core';
import {IEvented} from "cloe/reactives";
import * as m from "../../protocols/imountable/concrete"
import {IHtml, IText, IValue, IContent, IHideable, IMountable} from "../../protocols";
import {nestedAttrs} from "../nested-attrs/construct";
import {isDocumentFragment} from "../document-fragment/construct";
import {isElement} from "../element/construct";
import {_ as v} from "param.macro";

const hides = ["display", "none"];
export const hidden = comp(IInclusive.includes(v, hides), nestedAttrs(v, "style"));
const toggle = partial(toggles, show, hide, hidden);

function hide(self){
  ICollection.conj(nestedAttrs(self, "style"), hides);
}

function show(self){
  IYank.yank(nestedAttrs(self, "style"), hides);
}

function before(self, inserted){
  const parent = IHierarchy.parent(self);
  parent.insertBefore(inserted, self);
  return self;
}

function after(self, inserted){
  const relative = IHierarchy.nextSibling(self), parent = IHierarchy.parent(self);
  if (relative) {
    parent.insertBefore(inserted, relative);
  } else {
    IAppendable.append(parent, inserted);
  }
  return self;
}

function matches(self, selector){
  return (isString(selector) && self.matches(selector)) || (isFunction(selector) && selector(self));
}

function isAttrs(self){
  return !isDocumentFragment(self) && !isElement(self) && satisfies(IAssociative, self);
}

function eventContext(catalog){
  function on3(self, key, callback){
    isString(key) ? each(function(key){
      self.addEventListener(key, callback);
    }, compact(key.split(" "))) : self.addEventListener(key, callback);
    return self;
  }

  function on4(self, key, selector, callback){
    on3(self, key, doto(function(e){
      if (IMatch.matches(e.target, selector)) {
        callback.call(e.target, e);
      } else {
        var found = closest(e.target, selector);
        if (found && self.contains(found)) {
          callback.call(found, e);
        }
      }
    }, _assoc(catalog, callback, v)));
    return self;
  }

  const on = overload(null, null, null, on3, on4);

  function off(self, key, callback){
    self.removeEventListener(key, get(catalog, callback, callback));
    return self;
  }

  return {on, off};
}

const {on, off} = eventContext(weakMap());

const eventConstructors = {
  "click": MouseEvent,
  "mousedown": MouseEvent,
  "mouseup": MouseEvent,
  "mouseover": MouseEvent,
  "mousemove": MouseEvent,
  "mouseout": MouseEvent,
  "focus": FocusEvent,
  "blur": FocusEvent
}

const eventDefaults = {
  bubbles: true
}

function trigger(self, key, options){
  options = Object.assign({}, eventDefaults, options || {});
  const Event = eventConstructors[key] || CustomEvent;
  let event = null;
  try {
    event = new Event(key, options);
  } catch (ex) {
    event = document.createEvent('HTMLEvents');
    event.initEvent(key, options.bubbles || false, options.cancelable || false);
    event.detail = options.detail;
  }
  self.dispatchEvent(event);
  return self;
}

function contents(self){
  return ISeqable.seq(self.childNodes);
}

function mounts(self){
  return doto(self,
    specify(IMountable, {mountable}));
}

function mountable(self){
  return !parent(self);
}

function mount(self, parent){
  parent.appendChild(self);
}

function conj(self, other){
  if (m.mountable(other)) {
    m.mount(other, self);
  } else if (isFunction(other)){
    return conj(self, other());
  } else if (isAttrs(other)){
    each(function(entry){
      const key = entry[0], value = entry[1];
      assoc(self, key, value);
    }, other);
  } else if (isString(other)) {
    self.appendChild(document.createTextNode(other));
  } else if (isNumber(other)) {
    self.appendChild(document.createTextNode(str(other)));
  } else {
    self.appendChild(other);
  }
  return self;
}

function prepend(self, other){
  if (isAttrs(other)){
    each(function(entry){
      const key = entry[0], value = entry[1];
      assoc(self, key, value);
    }, other);
  } else {
    const content = isString(other) ? document.createTextNode(other) : other;
    if (self.prepend) {
      self.prepend(content);
    } else if (self.childNodes.length) {
      self.insertBefore(content, self.childNodes[0]);
    } else {
      self.appendChild(content);
    }
  }
  return self;
}

function lookup(self, key){
  return self.getAttribute(key);
}

function assoc(self, key, value){
  self.setAttribute(key, value);
  return self;
}

function dissoc(self, key){
  self.removeAttribute(key);
  return self;
}

function keys2(self, idx){
  return idx < self.attributes.length ? lazySeq(self.attributes[idx].name, function(){
    return keys2(self, idx + 1);
  }) : emptyList();
}

function keys(self){
  return keys2(self, 0);
}

function vals2(self, idx){
  return idx < self.attributes.length ? lazySeq(self.attributes[idx].value, function(){
    return keys2(self, idx + 1);
  }) : emptyList();
}

function vals(self){
  return vals2(self, 0);
}

function contains(self, key){
  return self.hasAttribute(key);
}

function parent(self){
  return self && self.parentNode;
}

const parents = upward(function(self){
  return self && self.parentElement;
});

const root = comp(last, upward(parent));

export function closest(self, selector){
  let target = IHierarchy.parent(self);
  while(target){
    if (IMatch.matches(target, selector)){
      return target;
    }
    target = IHierarchy.parent(target);
  }
}

function query(self, selector){
  return self.querySelectorAll && isString(selector) ? self.querySelectorAll(selector) : filter(IMatch.matches(v, selector), IHierarchy.descendants(self));
}

function locate(self, selector){
  return isFunction(selector) ? ISeq.first(IQuery.query(self, selector)) : self.querySelector(selector);
}

function children(self){
  return ISeqable.seq(self.children || filter(isElement, self.childNodes)); //IE has no children on document fragment
}

const descendants = downward(IHierarchy.children);

function nextSibling(self){
  return self.nextElementSibling;
}

const nextSiblings = upward(IHierarchy.nextSibling);

function prevSibling(self){
  return self.previousElementSibling;
}

const prevSiblings = upward(IHierarchy.prevSibling);

export function siblings(self){
  return concat(prevSiblings(self), nextSiblings(self));
}

function yank1(self){ //no jokes, please!
  yank2(parent(self), self);
}

function yank2(self, node){
  if (isElement(node)) {
    self.removeChild(node);
  } else if (satisfies(ISequential, node)) {
    const keys = node;
    each(self.removeAttribute.bind(self), keys);
  } else if (isAttrs(node)) {
    const attrs = node;
    each(function(entry){
      const key = entry[0], value = entry[1];
      let curr = lookup(self, key);
      if (isObject(curr)){
        curr = mapa(function(pair){
          return pair.join(": ") + "; ";
        }, IArray.toArray(curr)).join("").trim();
      }
      curr == value && dissoc(self, key);
    }, attrs);
  } else if (isString(node)) {
    node = includes(self, node);
    self.removeChild(node);
  }
}

export const yank = overload(null, yank1, yank2);

function includes(self, target){
  if (isElement(target)) {
    return ILocate.locate(children(self), isIdentical(target, v));
  } else if (satisfies(ISequential, target)){
    const keys = target;
    return IReduce.reduce(keys, function(memo, key){
      return memo ? self.hasAttribute(key) : reduced(memo);
    }, true)
  } else if (isAttrs(target)) {
    return IKVReduce.reducekv(target, function(memo, key, value){
      return memo ? lookup(self, key) == value : reduced(memo);
    }, true);
  } else {
    return ILocate.locate(contents(self), isString(target) ? function(node){
      return node.nodeType === Node.TEXT_NODE && node.data === target;
    } : function(node){
      return node === target;
    });
  }
}

function empty(self){
  while (self.firstChild) {
    self.removeChild(self.firstChild);
  }
  return self;
}

function clone(self){
  return self.cloneNode(true);
}

function text1(self){
  return self.innerText;
}

function text2(self, text){
  self.innerText = text;
}

export const text = overload(null, text1, text2);

function html1(self){
  return self.innerHTML;
}

function html2(self, html){
  if (isString(html)){
    self.innerHTML = html;
  } else {
    empty(self);
    if (satisfies(ISequential, html)) {
      apply(conj, self, html);
    } else {
      conj(self, html);
    }
  }
  return self;
}

export const html = overload(null, html1, html2);

function value1(self){
  return self.value != null ? self.value : null;
}

function value2(self, value){
  if (!("value" in self)) {
    throw new TypeError("Type does not support value property.");
  }
  if (self.value != value) {
    self.value = value;
    //IEvented.trigger(self, "change", {bubbles: true});
  }
}

export const value = overload(null, value1, value2);

function reduce(self, xf, init){
  return IReduce.reduce(IHierarchy.descendants(self), xf, init);
}

export const ihierarchy = implement(IHierarchy, {root, parent, parents, closest, children, descendants, nextSibling, nextSiblings, prevSibling, prevSiblings, siblings});
export const icontents = implement(IContent, {contents});
export const ireduce = implement(IReduce, {reduce});
export const ievented = implement(IEvented, {on, off, trigger});
export const ilocate = implement(ILocate, {locate});
export const iquery = implement(IQuery, {query});

export default does(
  ihierarchy,
  icontents,
  ireduce,
  ievented,
  iquery,
  ilocate,
  implement(IText, {text}),
  implement(IHtml, {html}),
  implement(IValue, {value}),
  implement(IMountable, {mountable: constantly(false), mount, mounts}),
  implement(IEmptyableCollection, {empty}),
  implement(IInsertable, {before, after}),
  implement(IInclusive, {includes}),
  implement(IHideable, {show, hide, toggle}),
  implement(IYank, {yank}),
  implement(IMatch, {matches}),
  implement(ICloneable, {clone}),
  implement(IAppendable, {append: conj}),
  implement(IPrependable, {prepend}),
  implement(ICollection, {conj}),
  implement(ILookup, {lookup}),
  implement(IMap, {dissoc, keys, vals}),
  implement(IAssociative, {assoc, contains}));