import {implement, IHierarchy, IMatchable, constantly, does, emptyList} from "atomic/core";
import {behaveAsElement} from "../element/behave.js";

export const behaveAsHTMLDocument = does(
  behaveAsElement,
  implement(IMatchable, {matches: constantly(false)}),
  implement(IHierarchy, {closest: constantly(null), nextSibling: constantly(null), nextSiblings: emptyList, prevSibling: constantly(null), prevSiblings: emptyList, siblings: emptyList, parent: constantly(null), parents: emptyList}));