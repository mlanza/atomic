const HTMLDocument = window.HTMLDocument || window.Document; //IE fallback

export default HTMLDocument;

export function isHTMLDocument(self){
  return self instanceof HTMLDocument;
}