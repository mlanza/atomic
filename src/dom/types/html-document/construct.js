import {global} from "atomic/core";

export const HTMLDocument = global.HTMLDocument || global.Document; //IE fallback

export function isHTMLDocument(self){
  return self instanceof HTMLDocument;
}