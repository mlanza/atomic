import {protocol, satisfies} from "../types/protocol";
import {ISeqable} from "../protocols/iseqable";
export const IHierarchy = protocol({
  parent: null,
  children: null,
  nextSibling: null,
  prevSibling: null
});
export const isHierarchy = satisfies(isHierarchy);