import {implement, IHierarchy, IMatch, constantly, does, emptyList} from 'atomic/core';
import behave from "../element/behave";

export default does(
  behave,
  implement(IMatch, {matches: constantly(false)}),
  implement(IHierarchy, {closest: constantly(null), nextSibling: constantly(null), nextSiblings: emptyList, prevSibling: constantly(null), prevSiblings: emptyList, siblings: emptyList, parent: constantly(null), parents: emptyList}));