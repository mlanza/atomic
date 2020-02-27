import {global} from "atomic/core";
export const XMLDocument = global.XMLDocument || global.Document; //IE fallback

export function isXMLDocument(self){
  return self instanceof XMLDocument;
}