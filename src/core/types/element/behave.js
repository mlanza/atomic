import {identity, constantly, effect, overload} from '../../core';
import {implement} from '../protocol';
import {isAssociative, isSequential, IValue, IText, IHtml, IHideable, IMatch, IYank, IInclusive, IInsertable, IArray, IAppendable, IPrependable, IEvented, IAssociative, IMap, IEquiv, ICloneable, ICollection, INext, ISeq, ISeqable, IIndexed, ICounted, ILookup, IReduce, IEmptyableCollection, IHierarchy, IContent} from '../../protocols';
import {each, mapcat} from '../lazyseq/concrete';
import EmptyList from '../emptylist/construct';
import {concat} from '../concatenated/construct';
import {cons} from '../list/construct';
import {lazySeq} from '../lazyseq/construct';
import {mapa, detect, compact, distinct, filter} from '../lazyseq/concrete';
import {comp} from '../function/concrete';
import {isObject} from '../object/construct';
import {isString} from '../string/construct';
import {isFunction} from '../function/construct';
import {reduced} from '../reduced/construct';
import {nestedattrs} from '../nestedattrs/construct';
import {trim, split, str} from '../string/concrete';
import Element, {isElement} from './construct';

const hidden = ["display", "none"];

function toggle(self){
  return transpose(nestedattrs(self, "style"), hidden);
}

function hide(self){
  ICollection.conj(nestedattrs(self, "style"), hidden);
  return self;
}

function show(self){
  IYank.yank(nestedattrs(self, "style"), hidden);
  return self;
}

function before(self, other){
  other = isFunction(other) ? other() : other;
  const parent = IHierarchy.parent(self);
  parent.insertBefore(other, self);
  return self;
}

function after(self, other){
  other = isFunction(other) ? other() : other;
  const relative = IHierarchy.nextSibling(self), parent = IHierarchy.parent(self);
  relative ? parent.insertBefore(other, relative) : parent.prependChild(other);
  return self;
}
function matches(self, selector){
  return (isString(selector) && self.matches(selector)) || (isFunction(selector) && selector(self));
}

export function downward(f){
  return function down(self){
    const xs = f(self),
          ys = mapcat(down, xs);
    return concat(xs, ys);
  }
}

export function upward(f){
  return function up(self){
    const other = f(self);
    return other ? cons(other, up(other)) : EmptyList.EMPTY;
  }
}

function isAttrs(self){
  return !isElement(self) && isAssociative(self);
}

function on(self, key, callback){
  self.addEventListener(key, callback);
  return function(){
    off(self, key, callback);
  }
}

function off(self, key, callback){
  self.removeEventListener(key, callback);
}

function contents(self){
  return ISeqable.seq(self.childNodes);
}

function conj(self, other){
  if (isFunction(other)){
    return conj(self, other());
  } else if (isAttrs(other)){
    each(function([key, value]){
      assoc(self, key, value);
    }, other);
  } else {
    self.appendChild(isString(other) ? document.createTextNode(other) : other);
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
  }) : EmptyList.EMPTY;
}

function keys(self){
  return keys2(self, 0);
}

function vals2(self, idx){
  return idx < self.attributes.length ? lazySeq(self.attributes[idx].value, function(){
    return keys2(self, idx + 1);
  }) : EmptyList.EMPTY;
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
  return yank2(parent(self), self);
}

function yank2(self, node){
  if (isSequential(node)) {
    const keys = node;
    each(self.removeAttribute.bind(self), keys);
    return self;
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
    return self;
  } else if (isString(node)) {
    node = includes(self, node);
  }
  self.removeChild(node);
  return self;
}

export const yank = overload(null, yank1, yank2);

function includes(self, target){
  if (isSequential(target)){
    const keys = target;
    return IReduce.reduce(keys, function(memo, key){
      return memo ? self.hasAttribute(key) : reduced(memo);
    }, true)
  } else if (isAttrs(target)) {
    return IKVReduce.reducekv(target, function(memo, key, value){
      return memo ? lookup(self, key) == value : reduced(memo);
    }, true);
  }
  return detect(isString(target) ? function(node){
    return node.nodeType === Node.TEXT_NODE && node.data === target;
  } : function(node){
    return node === target;
  }, contents(self));
}

function empty(self){
  each(self.removeChild.bind(self), contents(self));
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

export const ihierarchy = implement(IHierarchy, {parent, parents, closest, children, descendants, sel, nextSibling, nextSiblings, prevSibling, prevSiblings, siblings});
export const icontents = implement(IContent, {contents});
export const ireduce = implement(IReduce, {reduce});

export default effect(
  ihierarchy,
  icontents,
  ireduce,
  implement(IText, {text}),
  implement(IHtml, {html}),
  implement(IValue, {value}),
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
  implement(IEvented, {on, off}),
  implement(ILookup, {lookup}),
  implement(IMap, {dissoc, keys, vals}),
  implement(IAssociative, {assoc, contains}));