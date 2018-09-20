import {implement} from '../protocol';
import {IHierarchy} from '../../protocols';
import {constantly, does} from '../../core';
import behave from "../element/behave";
import {emptyList} from "../empty-list/construct";

export default does(
  behave,
  implement(IHierarchy, {closest: constantly(null), nextSibling: constantly(null), nextSiblings: emptyList, prevSibling: constantly(null), prevSiblings: emptyList, siblings: emptyList, parent: constantly(null), parents: emptyList}));