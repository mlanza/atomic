import {protocol, satisfies} from "../types/protocol";
import {ISeqable} from "../protocols/iseqable";
export const IHierarchy = protocol({
  parent: null,
  parents: null,
  closest: null,
  children: null,
  sel: null,
  sel1: null,
  descendants: null,
  siblings: null,
  nextSibling: null,
  nextSiblings: null,
  prevSibling: null,
  prevSiblings: null
});
export const isHierarchy = satisfies(isHierarchy);