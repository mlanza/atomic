import {identity, constantly, effect, overload, subj} from '../../core';
import {implement} from '../protocol';
import {IReduce, ISeqable, ISeq, INext, IMatch, IHierarchy} from '../../protocols';
import behave from "../element/behave";
import {lazySeq} from "../lazy-seq/construct";
import {map, filter} from "../lazy-seq/concrete";
import {cons} from "../list/construct";
import {ihierarchy, icontents, ireduce} from "../element/behave";
import EmptyList from "../empty-list/construct";

export default effect(
  behave,
  ihierarchy,
  icontents,
  ireduce,
  implement(IHierarchy, {nextSibling: constantly(null), nextSiblings: constantly(EmptyList.EMPTY), prevSibling: constantly(null), prevSiblings: constantly(EmptyList.EMPTY), siblings: constantly(EmptyList.EMPTY), parent: constantly(null), parents: constantly(EmptyList.EMPTY)}),
  implement(INext, {next: constantly(null)}),
  implement(ISeq, {first: identity, rest: constantly(EmptyList.EMPTY)}),
  implement(ISeqable, {seq: cons}));