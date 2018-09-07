const XMLDocument = window.XMLDocument || window.Document; //IE fallback

export default XMLDocument;

export function isXMLDocument(self){
  return self instanceof XMLDocument;
}