import {protocol, satisfies} from "../protocol";
import {ISeqable} from "../protocols/iseqable";
function _parent(self){
  return self.parentNode;
}
function _children(self){
  return ISeqable.seq(self.children);
}
function _nextSibling(self){
  return self.nextElementSibling;
}
function _prevSibling(self){
  return self.previousElementSibling;
}
export const IHierarchy = protocol({
  parent: _parent,
  children: _children,
  nextSibling: _nextSibling,
  prevSibling: _prevSibling
});
export const parent = IHierarchy.parent;
export const children = IHierarchy.children;
export const nextSibling = IHierarchy.nextSibling;
export const prevSibling = IHierarchy.prevSibling;
export const isHierarchy = satisfies(isHierarchy);
export default IHierarchy;