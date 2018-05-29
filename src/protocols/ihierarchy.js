import {protocol, satisfies} from "../types/protocol";
import {ISeqable} from "../protocols/iseqable";
function parent(self){
  return self.parentNode;
}
function children(self){
  return ISeqable.seq(self.children);
}
function nextSibling(self){
  return self.nextElementSibling;
}
function prevSibling(self){
  return self.previousElementSibling;
}
export const IHierarchy = protocol({
  parent: parent,
  children: children,
  nextSibling: nextSibling,
  prevSibling: prevSibling
});
export const isHierarchy = satisfies(isHierarchy);