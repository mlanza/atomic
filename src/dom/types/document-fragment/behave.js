import {identity, constantly, does, doto, overload, implement, cons, emptyList, IReduce, ISeqable, ISeq, INext, IMatchable, IHierarchy, ICoerceable} from "atomic/core";
import {behaveAsElement} from "../element/behave.js";

export const behaveAsDocumentFragment = does(
  behaveAsElement,
  implement(IHierarchy, {nextSibling: constantly(null), nextSiblings: emptyList, prevSibling: constantly(null), prevSiblings: emptyList, siblings: emptyList, parent: constantly(null), parents: emptyList}),
  implement(INext, {next: constantly(null)}),
  implement(ISeq, {first: identity, rest: emptyList}),
  implement(ISeqable, {seq: cons}));