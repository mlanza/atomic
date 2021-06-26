import {identity, constantly, does, doto, overload, implement, cons, emptyList, IReduce, ISeqable, ISeq, INext, IMatchable, IHierarchy, ICoerceable} from "atomic/core";
import ielement from "../element/behave.js";

export default does(
  ielement,
  implement(IHierarchy, {nextSibling: constantly(null), nextSiblings: emptyList, prevSibling: constantly(null), prevSiblings: emptyList, siblings: emptyList, parent: constantly(null), parents: emptyList}),
  implement(INext, {next: constantly(null)}),
  implement(ISeq, {first: identity, rest: emptyList}),
  implement(ISeqable, {seq: cons}));