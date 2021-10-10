import * as _ from "atomic/core";
import {IContent, ISelectable} from "../../protocols.js";
import {matches} from "../../shared.js";

function seq2(self, idx){
  return idx < self.length ? _.lazySeq(function(){
    return _.cons(self.item(idx), seq2(self, idx + 1));
  }) : null;
}

function seq(self){
  return seq2(self, 0);
}

function lookup(self, idx) {
  return self[idx];
}

const first = _.comp(_.first, seq);
const rest = _.comp(_.rest, seq);
const next = _.comp(_.next, seq);
const children = _.comp(_.children, seq);
const descendants = _.comp(_.descendants, seq);
const nextSibling = _.comp(_.nextSibling, seq);
const nextSiblings = _.comp(_.nextSiblings, seq);
const prevSibling = _.comp(_.prevSibling, seq);
const prevSiblings = _.comp(_.prevSiblings, seq);
const siblings = _.comp(_.siblings, seq);
const parent = _.comp(_.parent, seq);
const parents = _.comp(_.parents, seq);
const contents = _.comp(_.contents, seq);

function sel(self, selector){
  return _.maybe(self, seq, _.filter(matches(?, selector), ?));
}

function closest(self, selector){
  return _.maybe(self, seq, _.closest(?, selector));
}

function reduce(self, f, init){
  return _.reduce(f, init, seq(self));
}

function count(self){
  return self.length;
}

export default _.does(
  _.iterable,
  _.naming("NodeList"),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IIndexed, {nth: lookup}),
  _.implement(_.ICounted, {count}),
  _.implement(_.ISeq, {first, rest}),
  _.implement(_.IReduce, {reduce}),
  _.implement(_.INext, {next}),
  _.implement(_.ICoercible, {toArray: Array.from}),
  _.implement(_.IHierarchy, {parent, parents, closest, nextSiblings, nextSibling, prevSiblings, prevSibling, siblings, children, descendants}),
  _.implement(_.ISequential),
  _.implement(_.ISeqable, {seq}),
  _.implement(IContent, {contents}),
  _.implement(ISelectable, {sel}));
