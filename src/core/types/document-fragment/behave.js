import {identity, constantly, does, doto, overload} from '../../core';
import {implement, specify} from '../protocol';
import {IReduce, ISeqable, ISeq, INext, IMatch, IHierarchy, IMountable, IArray} from '../../protocols';
import {each} from "../lazy-seq/concrete";
import {cons} from "../list/construct";
import {emptyList} from "../empty-list/construct";
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