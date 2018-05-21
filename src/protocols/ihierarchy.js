import {protocol, satisfies} from "../protocol";
export const IHierarchy = protocol({
  parent: null,
  children: null,
  nextSibling: null,
  prevSibling: null
});
export const parent = IHierarchy.parent;
export const children = IHierarchy.children;
export const nextSibling = IHierarchy.nextSibling;
export const prevSibling = IHierarchy.prevSibling;
export const isHierarchy = satisfies(isHierarchy);
export default IHierarchy;