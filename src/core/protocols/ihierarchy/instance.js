import {protocol} from "../../types/protocol.js";
export const IHierarchy = protocol({
  root: null,
  parent: null,
  parents: null,
  closest: null,
  children: null,
  descendants: null,
  siblings: null,
  nextSibling: null,
  nextSiblings: null,
  prevSibling: null,
  prevSiblings: null
});