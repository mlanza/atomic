import {HTMLDocument} from "dom";
export {HTMLDocument} from "dom"; //HTMLDocument || Document; ensure IE fallback

export function isHTMLDocument(self){
  return self instanceof HTMLDocument;
}