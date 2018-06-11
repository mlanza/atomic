import {implement, surrogates} from '../protocol';
import {IAppendable, IPrependable, IEvented, IAssociative, IMap, IEquiv, ICloneable, ICollection, INext, ISeq, IShow, ISeqable, IIndexed, ICounted, ILookup, IReduce, IEmptyableCollection, IHierarchy, IContent} from '../../protocols';
import {each} from '../lazyseq/concrete';
import EmptyList from '../emptylist/construct';
import {lazySeq} from '../lazyseq/construct';
import {isString} from '../string/construct';
import {identity, constantly, effect} from '../../core';
import {yank} from '../../multimethods/amalgam';
import Element from './construct';

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

function append(self, other){
  appendChild(isString(other) ? document.createTextNode(other) : other);
  return self;
}

function prepend(self, other){
  self.prepend(isString(other) ? document.createTextNode(other) : other);
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
  return self.parentNode;
}

function children(self){
  return ISeqable.seq(self.children);
}

function nextSibling(self){
  return self.nextElementSibling;
}

function prevSibling(self){
  return self.prevElementSibling;
}

function empty(self){
  each(yank, children(self));
}

function clone(self){
  return self.cloneNode(true);
}

export default effect(
  implement(IEmptyableCollection, {empty}),
  implement(ICloneable, {clone}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend}),
  implement(ICollection, {conj: append}),
  implement(IEvented, {on, off}),
  implement(ILookup, {lookup}),
  implement(IContent, {contents}),
  implement(IHierarchy, {parent, children, nextSibling, prevSibling}),
  implement(IMap, {dissoc, keys, vals}),
  implement(IAssociative, {assoc, contains}));