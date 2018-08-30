import {identity, constantly, does, overload, partial, doto, noop} from '../../core';
import {implement, satisfies} from '../protocol';
import {IValue, IMountable, ISequential, IText, IHtml, IHideable, IMatch, IYank, IInclusive, IInsertable, IArray, IAppendable, IPrependable, IEvented, IAssociative, IMap, IEquiv, ICloneable, ICollection, INext, ISeq, ISeqable, IIndexed, ICounted, ILookup, IReduce, IEmptyableCollection, IHierarchy, IContent} from '../../protocols';
import {transpose} from '../../protocols/iinclusive/concrete';
import * as imountable from '../../protocols/imountable/concrete';
import * as iassociative from '../../protocols/iassociative/concrete';
import * as ilookup from '../../protocols/ilookup/concrete';
import {downward, upward} from '../../protocols/ihierarchy/concrete';
import {each} from '../lazy-seq/concrete';
import EmptyList, {emptyList} from '../empty-list/construct';
import {concat} from '../concatenated/construct';
import {cons} from '../list/construct';
import {lazySeq} from '../lazy-seq/construct';
import {mapa, detect, compact, distinct, filter, last} from '../lazy-seq/concrete';
import {comp} from '../function/concrete';
import {isObject} from '../object/construct';
import {isString} from '../string/construct';
import {isFunction} from '../function/construct';
import {reduced} from '../reduced/construct';
import {nestedAttrs} from '../nested-attrs/construct';
import {trim, split, str} from '../string/concrete';
import {isElement} from './construct';
import {weakMap} from "../weak-map/construct";
import {isDocumentFragment} from '../document-fragment/construct';
import {isIdentical} from '../../predicates';
import {_ as v} from "param.macro";

const hides = ["display", "none"];

function toggles4(on, off, want, self){
  return want(self) ? on(self) : off(self);
}

function toggles5(on, off, _, self, want){
  return want ? on(self) : off(self);
}

export const hidden = comp(IInclusive.includes(v, hides), nestedAttrs(v, "style"));
export const toggles = overload(null, null, null, null, toggles4, toggles5);

const toggle = partial(toggles, show, hide, hidden);

function hide(self){
  ICollection.conj(nestedAttrs(self, "style"), hides);
}

function show(self){
  IYank.yank(nestedAttrs(self, "style"), hides);
}

function before(self, inserted){
  inserted = isFunction(inserted) ? inserted() : inserted;
  const parent = IHierarchy.parent(self);
  parent.insertBefore(inserted, self);
  return self;
}

function after(self, inserted){
  inserted = isFunction(inserted) ? inserted() : inserted;
  const relative = IHierarchy.nextSibling(self), parent = IHierarchy.parent(self);
  relative ? parent.insertBefore(inserted, relative) : parent.prependChild(inserted);
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
    self.addEventListener(key, callback);
    return self;
  }

  function on4(self, key, selector, callback){
    on3(self, key, doto(function(e){
      if (e.target.matches(selector)) {
        callback.call(e.target, e);
      } else {
        var found = closest(e.target, selector);
        if (found && self.contains(found)) {
          callback.call(found, e);
        }
      }
    }, iassociative.assoc(catalog, callback, v)));
    return self;
  }

  const on = overload(null, null, null, on3, on4);

  function off(self, key, callback){
    self.removeEventListener(key, ilookup.get(catalog, callback, callback));
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

function mountable(self){
  return !parent(self);
}

function mount(self, parent){
  IEvented.trigger(self, "mounting", {bubbles: false, detail: {parent}});
  parent.appendChild(self);
  IEvented.trigger(self, "mounted", {bubbles: false, detail: {parent}});
  return self;
}

function conj(self, other){
  if (satisfies(IMountable, other)) {
    imountable.mount(other, self);
  } else if (isFunction(other)){
    return conj(self, other());
  } else if (isAttrs(other)){
    each(function([key, value]){
      assoc(self, key, value);
    }, other);
  } else if (isString(other)) {
    self.appendChild(document.createTextNode(other));
  } else {
    self.appendChild(other);
  }
  return self;
}

function prepend(self, other){
  if (isAttrs(other)){
    each(function([key, value]){
      assoc(self, key, value);
    }, other);
  } else {
    self.prepend(isString(other) ? document.createTextNode(other) : other);
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

const parents = upward(parent);

const root = comp(last, parents);

export function closest(self, selector){
  let target = IHierarchy.parent(self);
  while(target){
    if (matches(target, selector)){
      return target;
    }
    target = IHierarchy.parent(target);
  }
}

function sel(self, selector){
  return isFunction(selector) ? filter(function(node){
    return IMatch.matches(node, selector);
  }, IHierarchy.descendants(self)) : self.querySelectorAll(selector);
}

function sel1(self, selector){
  return isFunction(selector) ? ISeq.first(IHierarchy.sel(self, selector)) : self.querySelector(selector);
}

function children(self){
  return ISeqable.seq(self.children);
}

const descendants = downward(IHierarchy.children);

function nextSibling(self){
  return self.nextElementSibling;
}

const nextSiblings = upward(IHierarchy.nextSibling);

function prevSibling(self){
  return self.prevElementSibling;
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
    each(function([key, value]){
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
    return detect(isIdentical(target, v), children(self));
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
    return detect(isString(target) ? function(node){
      return node.nodeType === Node.TEXT_NODE && node.data === target;
    } : function(node){
      return node === target;
    }, contents(self));
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
  self.innerHTML = html;
  return self;
}

export const html = overload(null, html1, html2);

function value1(self){
  return self.value != null ? self.value : null;
}

function value2(self, value){
  if (self.value != null) {
    self.value = value;
  }
}

export const value = overload(null, value1, value2);

function reduce(self, xf, init){
  return IReduce.reduce(IHierarchy.descendants(self), xf, init);
}

export const ihierarchy = implement(IHierarchy, {root, parent, parents, closest, children, descendants, sel, sel1, nextSibling, nextSiblings, prevSibling, prevSiblings, siblings});
export const icontents = implement(IContent, {contents});
export const ireduce = implement(IReduce, {reduce});
export const ievented = implement(IEvented, {on, off, trigger});

export default does(
  ihierarchy,
  icontents,
  ireduce,
  ievented,
  implement(IText, {text}),
  implement(IHtml, {html}),
  implement(IValue, {value}),
  implement(IMountable, {mountable, mount}),
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