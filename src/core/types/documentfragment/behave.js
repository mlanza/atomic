import {identity, constantly, effect, overload, subj} from '../../core';
import {implement} from '../protocol';
import {IReduce, ISeqable, ISeq, INext, IMatch, IHierarchy} from '../../protocols';
import behave from "../element/behave";
import {lazySeq} from "../lazyseq/construct";
import {map, filter} from "../lazyseq/concrete";
import {cons} from "../list/construct";
import {comp} from "../function/concrete";
import {members} from "../members/construct";
import {downward, upward, closest} from "../element/behave";
import EmptyList from "../emptylist/construct";

function seq(self){
  return cons(self);
}

function reduce(self, xf, init){
  return IReduce.reduce(self.childNodes, xf, init);
}

function children(self){
  return ISeqable.seq(self.children);
}

const descendants = comp(members, downward(children));

function sel(self, selector){
  return members(filter(function(node){
    return IMatch.matches(node, selector);
  }, descendants(self)));
}

function contents(self){
  return ISeqable.seq(self.childNodes);
}

export default effect(
  behave,
  implement(IHierarchy, {closest, children, descendants, sel, nextSibling: constantly(null), nextSiblings: constantly(EmptyList.EMPTY), prevSibling: constantly(null), prevSiblings: constantly(EmptyList.EMPTY), siblings: constantly(EmptyList.EMPTY), parent: constantly(null), parents: constantly(EmptyList.EMPTY)}),
  implement(INext, {next: constantly(null)}),
  implement(ISeq, {first: identity, rest: constantly(EmptyList.EMPTY)}),
  implement(ISeqable, {seq}),
  implement(IReduce, {reduce}));