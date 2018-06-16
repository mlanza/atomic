import {identity, constantly, effect, overload, subj} from '../../core';
import {implement, surrogates} from '../protocol';
import {isAssociative, isSequential, IYank, IInclusive, IArray, IAppendable, IPrependable, IEvented, IAssociative, IMap, IEquiv, ICloneable, ICollection, INext, ISeq, IShow, ISeqable, IIndexed, ICounted, ILookup, IReduce, IEmptyableCollection, IHierarchy, IContent} from '../../protocols';
import {each, mapcat} from '../lazyseq/concrete';
import EmptyList from '../emptylist/construct';
import {concat} from '../concatenated/construct';
import {cons} from '../list/construct';
import {lazySeq} from '../lazyseq/construct';
import {mapa, detect, compact, distinct, filter} from '../lazyseq/concrete';
import {maybe} from '../pipeline/concrete';
import {isObject} from '../object/construct';
import {isString} from '../string/construct';
import {isFunction} from '../function/construct';
import {reduced} from '../reduced/construct';
import {trim, split, str} from '../string/concrete';
import Element, {isElement} from './construct';
import {matches} from "../../multimethods/matches";
import {members} from "../members/construct";

const matching = subj(matches);

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

function fromNestedAttrs(text){
  return text == null ? {} : IReduce.reduce(mapa(function(text){
    return mapa(trim, split(text, ":"));
  }, compact(split(text, ";"))), function(memo, pair){
    return ICollection.conj(memo, pair);
  }, {});
}

function toNestedAttrs(obj){
  if (isString(obj)) {
    return obj;
  } else {
    return obj == null || !isAttrs(obj) ? mapa(function([key, value]){
      return str(key, ": ", value, ";");
    }, ISeqable.seq(obj)).join(" ") : null;
  }
}

function fromSpaceSeparated(text){
  return text == null ? [] : mapa(trim, compact(split(text, " ")));
}

function toSpaceSeparated(xs){
  if (isString(xs)){
    return xs;
  } else {
    return xs == null || !isSequential(xs) ? null : IArray.toArray(distinct(xs)).join(" ");
  }
}

const readers = {
  class: fromSpaceSeparated,
  style: fromNestedAttrs
}

const writers = {
  class: toSpaceSeparated,
  style: toNestedAttrs
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
  const reader = readers[key] || identity;
  return reader(self.getAttribute(key));
}

function assoc(self, key, value){
  const writer = writers[key] || identity;
  self.setAttribute(key, writer(value));
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

function closest(self, selector){
  let target = IHierarchy.parent(self);
  while(target){
    if (matches(target, selector)){
      return target;
    }
    target = IHierarchy.parent(target);
  }
}

function sel(self, selector){
  return members(filter(matching(selector), descendants(self)));
}

function children(self){
  return ISeqable.seq(self.children);
}

const descendants = downward(children);

function nextSibling(self){
  return self.nextElementSibling;
}

const nextSiblings = upward(nextSibling);

function prevSibling(self){
  return self.prevElementSibling;
}

const prevSiblings = upward(prevSibling);

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

export default effect(
  implement(IEmptyableCollection, {empty}),
  implement(IInclusive, {includes}),
  implement(IYank, {yank}),
  implement(ICloneable, {clone}),
  implement(IAppendable, {append: conj}),
  implement(IPrependable, {prepend}),
  implement(ICollection, {conj}),
  implement(IEvented, {on, off}),
  implement(ILookup, {lookup}),
  implement(IContent, {contents}),
  implement(IHierarchy, {parent, parents, closest, children, descendants, sel, nextSibling, nextSiblings, prevSibling, prevSiblings, siblings}),
  implement(IMap, {dissoc, keys, vals}),
  implement(IAssociative, {assoc, contains}));