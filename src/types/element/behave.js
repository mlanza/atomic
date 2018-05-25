import {implement, surrogates} from '../protocol';
import {IAssociative, IEquiv, ICollection, INext, IArr, ISeq, IShow, ISeqable, IIndexed, ICounted, ILookup, IReduce, IEmptyableCollection, IHierarchy, IContent} from '../../protocols';
import {EMPTY} from '../../types/empty';
import {identity, constantly, effect} from '../../core';
import Element from './construct';

function contents(self){
  return ISeqable.seq(self.childNodes);
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

export default effect(
  implement(ILookup, {lookup}),
  implement(IContent, {contents}),
  implement(IHierarchy, {parent, children, nextSibling, prevSibling}),
  implement(IAssociative, {assoc, contains}));