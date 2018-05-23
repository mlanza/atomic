import {implement, surrogates} from '../protocol';
import {IAssociative, IEquiv, ICollection, INext, IArr, ISeq, IShow, ISeqable, IIndexed, ICounted, ILookup, IReduce, IEmptyableCollection, IHierarchy, IElementEmbeddable} from '../../protocols';
import {EMPTY} from '../../types/empty';
import {identity, constantly, effect} from '../../core';
import Element from './construct';

function element(self){
  if (self instanceof Element) {
    return Element;
  }
}

function lookup(self, key){
  return self.getAttribute(key);
}

function assoc(self, key, value){
  self.setAttribute(key, value);
  return self;
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

function embedIn(self, parent){
  parent.appendChild(self);
}

//surrogates.unshift(element);

export default effect(
  implement(ILookup, {lookup}),
  implement(IElementEmbeddable, {embedIn}),
  implement(IHierarchy, {parent, children, nextSibling, prevSibling}),
  implement(IAssociative, {assoc, contains}));
