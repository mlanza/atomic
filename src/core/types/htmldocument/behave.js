import {implement} from '../protocol';
import {IHierarchy} from '../../protocols';
import {constantly, effect} from '../../core';
import {ihierarchy, icontents} from "../element/behave";
import EmptyList from "../emptylist/construct";

export default effect(
  ihierarchy,
  icontents,
  implement(IHierarchy, {closest: constantly(null), nextSibling: constantly(null), nextSiblings: constantly(EmptyList.EMPTY), prevSibling: constantly(null), prevSiblings: constantly(EmptyList.EMPTY), siblings: constantly(EmptyList.EMPTY), parent: constantly(null), parents: constantly(EmptyList.EMPTY)}));