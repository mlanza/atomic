import {HTMLDocument} from "dom";

export function isHTMLDocument(self){
  return self instanceof HTMLDocument;
}