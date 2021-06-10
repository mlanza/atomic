import {does, maybe, cons, implement, lazySeq, comp, iterable, ILookup, IIndexed, ICounted, ISeq, INext, ISeqable, ISequential, IHierarchy, IQueryable, ILocate, IReduce, ICoerceable} from "atomic/core";
import {IContent} from "../../protocols.js";

function seq2(self, idx){
  return idx < self.length ? lazySeq(function(){
    return cons(self.item(idx), seq2(self, idx + 1));
  }) : null;
}

function seq(self){
  return seq2(self, 0);
}

function lookup(self, idx) {
  return self[idx];
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
  return maybe(self, seq, IQueryable.query(?, selector)) || [];
}

function locate(self, selector){
  return maybe(self, seq, ILocate.locate(?, selector));
}

function closest(self, selector){
  return maybe(self, seq, IHierarchy.closest(?, selector));
}

function reduce(self, f, init){
  return IReduce.reduce(seq(self), f, init);
}

function count(self){
  return self.length;
}

export const behaveAsNodeList = does(
  iterable,
  implement(ILookup, {lookup}),
  implement(IIndexed, {nth: lookup}),
  implement(ICounted, {count}),
  implement(ISeq, {first, rest}),
  implement(IReduce, {reduce}),
  implement(INext, {next}),
  implement(IContent, {contents}),
  implement(ICoerceable, {toArray: Array.from}),
  implement(IQueryable, {query}),
  implement(ILocate, {locate}),
  implement(IHierarchy, {parent, parents, closest, nextSiblings, nextSibling, prevSiblings, prevSibling, siblings, children, descendants}),
  implement(ISequential),
  implement(ISeqable, {seq}));