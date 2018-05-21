import {protocol, satisfies} from "../protocol";
export const IHierarchicalSet = protocol({
  parent: null,
  children: null,
  nextSibling: null,
  prevSibling: null
});
export const parent = IHierarchicalSet.parent;
export const children = IHierarchicalSet.children;
export const nextSibling = IHierarchicalSet.nextSibling;
export const prevSibling = IHierarchicalSet.prevSibling;
export const isHierarchicalSet = satisfies(IHierarchicalSet);
export default IHierarchicalSet;