import {does, maybe, cons, implement, lazySeq, filter, comp, iterable, IMatchable, ILookup, IIndexed, ICounted, ISeq, INext, ISeqable, ISequential, IHierarchy, IReduce, ICoerceable} from "atomic/core";
import {IContent, ISelectable} from "../../protocols.js";

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

function sel(self, selector){
  return maybe(self, seq, filter(IMatchable.matches(?, selector), ?));
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

export default does(
  iterable,
  implement(ILookup, {lookup}),
  implement(IIndexed, {nth: lookup}),
  implement(ICounted, {count}),
  implement(ISeq, {first, rest}),
  implement(IReduce, {reduce}),
  implement(INext, {next}),
  implement(IContent, {contents}),
  implement(ICoerceable, {toArray: Array.from}),
  implement(ISelectable, {sel}),
  implement(IHierarchy, {parent, parents, closest, nextSiblings, nextSibling, prevSiblings, prevSibling, siblings, children, descendants}),
  implement(ISequential),
  implement(ISeqable, {seq}));
