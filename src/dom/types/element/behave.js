import {
  assoc as _assoc,
  called,
  identity,
  toggles,
  constantly,
  does,
  overload,
  partial,
  doto,
  noop,
  get,
  getIn,
  key,
  val,
  implement,
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
  detect,
  last,
  comp,
  isObject,
  isString,
  isNumber,
  trim,
  split,
  str,
  pre,
  apply,
  emptyList,
  weakMap,
  isIdentical,
  ISequential,
  IMatchable,
  IYankable,
  IInclusive,
  ICoerceable,
  IAssociative,
  IDescriptive,
  IMap,
  IClonable,
  ICollection,
  INext,
  ISeq,
  ISeqable,
  ICounted,
  ILookup,
  IReduce,
  IEmptyableCollection,
  IHierarchy
} from "atomic/core";
import {
  ITransientAssociative,
  ITransientMap,
  ITransientAppendable,
  ITransientPrependable,
  ITransientCollection,
  ITransientEmptyableCollection,
  ITransientInsertable,
  ITransientYankable
} from "atomic/transients";
import {IEvented} from "atomic/reactives";
import {isMountable} from "../../protocols/imountable/concrete.js"
import {IHtml, IText, IValue, IContent, IHideable, IEmbeddable, ISelectable} from "../../protocols.js";
import {embed as _embed} from "../../protocols/iembeddable/concrete.js";
import {nestedAttrs} from "../nested-attrs/construct.js";
import {isElement} from "../element/construct.js";
import {Text} from "dom";

const hides = ["display", "none"];
export const hidden = comp(IInclusive.includes(?, hides), nestedAttrs(?, "style"));
const toggle = partial(toggles, show, hide, hidden);

function hide(self){
  ITransientCollection.conj(nestedAttrs(self, "style"), hides);
}

function show(self){
  ITransientYankable.yank(nestedAttrs(self, "style"), hides);
}

function embed(self, parent, referenceNode) {
  if (isMountable(self)) {
    const detail = {parent};
    IEvented.trigger(self, "mounting", {bubbles: true, detail});
    if (referenceNode) {
      parent.insertBefore(self, referenceNode);
    } else {
      parent.appendChild(self);
    }
    IEvented.trigger(self, "mounted" , {bubbles: true, detail});
  } else {
    if (referenceNode) {
      parent.insertBefore(self, referenceNode);
    } else {
      parent.appendChild(self);
    }
  }
  return self;
}

function append(self, content){
  IEmbeddable.embed(content, self);
}

function prepend(self, content){
  IEmbeddable.embed(content, self, self.childNodes[0]);
}

function before(self, content){
  IEmbeddable.embed(content, IHierarchy.parent(self), self);
}

function after(self, content){
  IEmbeddable.embed(content, IHierarchy.parent(self), IHierarchy.nextSibling(self));
}

const conj = append;

function check(self, selector){
  return isString(selector);
}

const matches = pre(function matches(self, selector){
  return self.matches(selector);
}, check);

function isText(self){
  return self && self.constructor === Text;
}

function isAttrs(self){
  return !(self instanceof Node) && satisfies(IDescriptive, self);
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
      if (IMatchable.matches(e.target, selector)) {
        callback.call(e.target, e);
      } else {
        const found = closest(e.target, selector);
        if (found && self.contains(found)) {
          callback.call(found, e);
        }
      }
    }, _assoc(catalog, callback, ?)));
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
    event = self.ownerDocument.createEvent('HTMLEvents');
    event.initEvent(key, options.bubbles || false, options.cancelable || false);
    event.detail = options.detail;
  }
  self.dispatchEvent(event);
  return self;
}

function contents(self){
  return self.contentDocument || ISeqable.seq(self.childNodes);
}

function assoc(self, key, value){
  self.setAttribute(key, str(value));
}

function dissoc(self, key){
  self.removeAttribute(key);
}

function keys2(self, idx){
  return idx < self.attributes.length ? lazySeq(function(){
    return cons(self.attributes[idx].name, keys2(self, idx + 1));
  }) : emptyList();
}

function keys(self){
  return keys2(self, 0);
}

function vals2(self, idx){
  return idx < self.attributes.length ? lazySeq(function(){
    return cons(self.attributes[idx].value, keys2(self, idx + 1));
  }) : emptyList();
}

function vals(self){
  return vals2(self, 0);
}

function lookup(self, key){
  return self.getAttribute(key);
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
  let target = self;
  while(target){
    if (IMatchable.matches(target, selector)){
      return target;
    }
    target = IHierarchy.parent(target);
  }
}

function sel(self, selector){
  return self.querySelectorAll(selector);
}

function sel1(self, selector){
  return self.querySelector(selector);
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
        }, ICoerceable.toArray(curr)).join("").trim();
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
    return detect(isIdentical(target, ?), children(self));
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
}

function clone(self){
  return self.cloneNode(true);
}

function text1(self){
  return self.textContent;
}

function text2(self, text){
  self.textContent = text == null ? "" : text;
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
    _embed(html, self);
  }
  return self;
}

export const html = overload(null, html1, html2);

function value1(self){
  return "value" in self ? self.value : null;
}

function value2(self, value){
  if ("value" in self) {
    value = value == null ? "" : value;
    if (self.value != value) {
      self.value = value;
    }
  } else {
    throw new TypeError("Type does not support value property.");
  }
}

export const value = overload(null, value1, value2);

function reduce(self, xf, init){
  return IReduce.reduce(IHierarchy.descendants(self), xf, init);
}

export const ihierarchy = implement(IHierarchy, {root, parent, parents, closest, children, descendants, nextSibling, nextSiblings, prevSibling, prevSiblings, siblings});
export const icontents = implement(IContent, {contents});
export const ievented = implement(IEvented, {on, off, trigger});
export const iselectable = implement(ISelectable, {sel, sel1});

export default does(
  ihierarchy,
  icontents,
  ievented,
  iselectable,
  implement(IReduce, {reduce}),
  implement(IText, {text}),
  implement(IHtml, {html}),
  implement(IValue, {value}),
  implement(IEmbeddable, {embed}),
  implement(ITransientEmptyableCollection, {empty}),
  implement(ITransientInsertable, {before, after}),
  implement(IInclusive, {includes}),
  implement(IHideable, {show, hide, toggle}),
  implement(ITransientYankable, {yank}),
  implement(IMatchable, {matches}),
  implement(IClonable, {clone}),
  implement(ITransientAppendable, {append}),
  implement(ITransientPrependable, {prepend}),
  implement(ITransientCollection, {conj}),
  implement(ILookup, {lookup}),
  implement(IMap, {keys, vals}),
  implement(ITransientMap, {dissoc}),
  implement(IAssociative, {contains}),
  implement(ITransientAssociative, {assoc}));
