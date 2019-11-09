import {identity, constantly, does, doto, overload, implement, specify, each, cons, emptyList, IReduce, ISeqable, ISeq, INext, IMatch, IHierarchy, ICoerce} from 'atomic/core';
import {behaveAsElement} from "../element/behave";

export const behaveAsDocumentFragment = does(
  behaveAsElement,
  implement(IHierarchy, {nextSibling: constantly(null), nextSiblings: emptyList, prevSibling: constantly(null), prevSiblings: emptyList, siblings: emptyList, parent: constantly(null), parents: emptyList}),
  implement(INext, {next: constantly(null)}),
  implement(ISeq, {first: identity, rest: emptyList}),
  implement(ISeqable, {seq: cons}));