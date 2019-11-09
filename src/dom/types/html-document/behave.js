import {implement, IHierarchy, IMatch, constantly, does, emptyList} from 'atomic/core';
import {behaveAsElement} from "../element/behave";

export const behaveAsHTMLDocument = does(
  behaveAsElement,
  implement(IMatch, {matches: constantly(false)}),
  implement(IHierarchy, {closest: constantly(null), nextSibling: constantly(null), nextSiblings: emptyList, prevSibling: constantly(null), prevSiblings: emptyList, siblings: emptyList, parent: constantly(null), parents: emptyList}));