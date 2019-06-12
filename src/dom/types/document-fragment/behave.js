import {identity, constantly, does, doto, overload, implement, specify, each, cons, emptyList, IReduce, ISeqable, ISeq, INext, IMatch, IHierarchy, ICoerce} from 'atomic/core';
import behave from "../element/behave";
import {_ as v} from "param.macro";

export default does(
  behave,
  implement(IHierarchy, {nextSibling: constantly(null), nextSiblings: emptyList, prevSibling: constantly(null), prevSiblings: emptyList, siblings: emptyList, parent: constantly(null), parents: emptyList}),
  implement(INext, {next: constantly(null)}),
  implement(ISeq, {first: identity, rest: emptyList}),
  implement(ISeqable, {seq: cons}));