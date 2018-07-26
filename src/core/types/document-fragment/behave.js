import {identity, constantly, effect, overload} from '../../core';
import {implement} from '../protocol';
import {IReduce, ISeqable, ISeq, INext, IMatch, IHierarchy} from '../../protocols';
import behave from "../element/behave";
import {lazySeq} from "../lazy-seq/construct";
import {map, filter} from "../lazy-seq/concrete";
import {cons} from "../list/construct";
import {ihierarchy, icontents, ireduce} from "../element/behave";
import {emptyList} from "../empty-list/construct";

export default effect(
  behave,
  ihierarchy,
  icontents,
  ireduce,
  implement(IHierarchy, {nextSibling: constantly(null), nextSiblings: emptyList, prevSibling: constantly(null), prevSiblings: emptyList, siblings: emptyList, parent: constantly(null), parents: emptyList}),
  implement(INext, {next: constantly(null)}),
  implement(ISeq, {first: identity, rest: emptyList}),
  implement(ISeqable, {seq: cons}));