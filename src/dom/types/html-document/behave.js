import {implement, IHierarchy, constantly, does, emptyList} from 'cloe/core';
import behave from "../element/behave";

export default does(
  behave,
  implement(IHierarchy, {closest: constantly(null), nextSibling: constantly(null), nextSiblings: emptyList, prevSibling: constantly(null), prevSiblings: emptyList, siblings: emptyList, parent: constantly(null), parents: emptyList}));