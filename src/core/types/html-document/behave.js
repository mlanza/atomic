import {implement} from '../protocol';
import {IHierarchy} from '../../protocols';
import {constantly, does} from '../../core';
import {ihierarchy, icontents, ievented} from "../element/behave";
import {emptyList} from "../empty-list/construct";

export default does(
  ihierarchy,
  icontents,
  ievented,
  implement(IHierarchy, {closest: constantly(null), nextSibling: constantly(null), nextSiblings: emptyList, prevSibling: constantly(null), prevSiblings: emptyList, siblings: emptyList, parent: constantly(null), parents: emptyList}));