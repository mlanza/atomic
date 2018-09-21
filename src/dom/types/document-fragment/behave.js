import {identity, constantly, does, doto, overload, implement, specify, each, cons, emptyList, IReduce, ISeqable, ISeq, INext, IMatch, IHierarchy, IMountable, IArray} from 'cloe/core';
import behave from "../element/behave";
import {_ as v} from "param.macro";

function mountable(self){
  return ISeqable.seq(IHierarchy.children(self));
}

function mount(self, parent){
  each(IMountable.mount(v, parent), IArray.toArray(IHierarchy.children(self)));
}

function mounts(self){
  return doto(self,
    specify(IMountable, {mountable}));
}

export default does(
  behave,
  implement(IMountable, {mountable: constantly(false), mount, mounts}),
  implement(IHierarchy, {nextSibling: constantly(null), nextSiblings: emptyList, prevSibling: constantly(null), prevSiblings: emptyList, siblings: emptyList, parent: constantly(null), parents: emptyList}),
  implement(INext, {next: constantly(null)}),
  implement(ISeq, {first: identity, rest: emptyList}),
  implement(ISeqable, {seq: cons}));