import {identity, constantly, does, overload} from '../../core';
import {implement} from '../protocol';
import {IReduce, ISeqable, ISeq, INext, IMatch, IHierarchy, IMountable, IEvented} from '../../protocols';
import {lazySeq} from "../lazy-seq/construct";
import {each, map, filter} from "../lazy-seq/concrete";
import {cons} from "../list/construct";
import {ihierarchy, icontents, ireduce} from "../element/behave";
import {emptyList} from "../empty-list/construct";
import behave from "../element/behave";
import {_ as v} from "param.macro";

function mountable(self){
  return ISeqable.seq(IHierarchy.children(self));
}

function mount(self, parent){
  IEvented.trigger(self, "mounting", {bubbles: false, detail: {parent}});
  each(IMountable.mount(v, parent), IHierarchy.children(self));
  IEvented.trigger(self, "mounted" , {bubbles: false, detail: {parent}});
  return self;
}

export default does(
  behave,
  ihierarchy,
  icontents,
  ireduce,
  implement(IMountable, {mountable, mount}),
  implement(IHierarchy, {nextSibling: constantly(null), nextSiblings: emptyList, prevSibling: constantly(null), prevSiblings: emptyList, siblings: emptyList, parent: constantly(null), parents: emptyList}),
  implement(INext, {next: constantly(null)}),
  implement(ISeq, {first: identity, rest: emptyList}),
  implement(ISeqable, {seq: cons}));