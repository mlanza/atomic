import {does, opt, implement, lazySeq, comp, iterable, ICounted, ISeq, INext, ISeqable, ISequential, IHierarchy, IQuery, ILocate, IReduce} from 'cloe/core';
import {IContent} from "../../protocols";
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
  return opt(self, seq, IQuery.query(v, selector)) || [];
}

function locate(self, selector){
  return opt(self, seq, ILocate.locate(v, selector));
}

function closest(self, selector){
  return opt(self, seq, IHierarchy.closest(v, selector));
}

function reduce(self, f, init){
  return IReduce.reduce(seq(self), f, init);
}

function count(self){
  return self.length;
}

export default does(
  iterable,
  implement(ICounted, {count}),
  implement(ISeq, {first, rest}),
  implement(IReduce, {reduce}),
  implement(INext, {next}),
  implement(IContent, {contents}),
  implement(IQuery, {query}),
  implement(ILocate, {locate}),
  implement(IHierarchy, {parent, parents, closest, nextSiblings, nextSibling, prevSiblings, prevSibling, siblings, children, descendants}),
  implement(ISequential),
  implement(ISeqable, {seq}));