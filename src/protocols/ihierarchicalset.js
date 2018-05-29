import {protocol, satisfies} from "../types/protocol";
export const IHierarchicalSet = protocol({
  parent: null,
  children: null,
  nextSibling: null,
  prevSibling: null
});
export const isHierarchicalSet = satisfies(IHierarchicalSet);