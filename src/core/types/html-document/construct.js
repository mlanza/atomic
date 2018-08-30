const HTMLDocument = window.HTMLDocument || window.Document;

export default HTMLDocument;

export function isHTMLDocument(self){
  return self instanceof HTMLDocument;
}