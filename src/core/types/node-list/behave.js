import {does} from '../../core';
import {implement} from '../protocol';
import {ISeq, INext, ISeqable, ISequential, IContent, IHierarchy, IQuery, IReduce} from '../../protocols';
import {lazySeq, filter} from '../lazy-seq';
import {comp, isFunction} from '../function';
import {iterable} from '../lazy-seq/behave';
import {_ as v} from "param.macro";

function seq2(self, idx){
  return idx < self.length ? lazySeq(self.item(idx), function(){
    return seq2(self, idx + 1);
  }) : null;
}

function seq(self){
  return seq2(self, 0);
}

const first = comp(ISeq.first, seq);
const rest = comp(ISeq.rest, seq);
const next = comp(INext.next, seq);
const children = comp(IHierarchy.children, seq);
const descendants = comp(IHierarchy.descendants, seq);
const nextSibling = comp(IHierarchy.nextSibling, seq);
const nextSiblings = comp(IHierarchy.nextSiblings, seq);
const prevSibling = comp(IHierarchy.prevSibling, seq);
const prevSiblings = comp(IHierarchy.prevSiblings, seq);
const siblings = comp(IHierarchy.siblings, seq);
const parent = comp(IHierarchy.parent, seq);
const parents = comp(IHierarchy.parents, seq);
const contents = comp(IContent.contents, seq);

function query(self, selector){
  const match = isFunction(selector) ? selector : matches(v, selector);
  return filter(match, seq(self));
}

function closest(self, selector){
  return IHierarchy.closest(seq(self), selector);
}

function reduce(self, f, init){
  return IReduce.reduce(seq(self), f, init);
}

export default does(
  iterable,
  implement(ISeq, {first, rest}),
  implement(IReduce, {reduce}),
  implement(INext, {next}),
  implement(IContent, {contents}),
  implement(IQuery, {query}),
  implement(IHierarchy, {parent, parent, closest, nextSiblings, nextSibling, prevSiblings, prevSibling, siblings, children, descendants}),
  implement(ISequential),
  implement(ISeqable, {seq}));