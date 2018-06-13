export default DocumentFragment;

export function isDocumentFragment(self){
  return self && self instanceof DocumentFragment;
}