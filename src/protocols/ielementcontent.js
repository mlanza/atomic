import {protocol, satisfies} from "../protocol";
function _appendTo(child, parent){
  parent.appendChild(child);
}
export const IElementContent = protocol({
  appendTo: _appendTo
});
export const appendTo = IElementContent.appendTo;
export const isElementContent = satisfies(IElementContent);
export default IElementContent;

export function appendChild(parent, child){
  appendTo(child, parent);
  return parent;
}