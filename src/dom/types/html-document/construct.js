import {HTMLDocument, document} from "dom";
import {handle, partial} from "atomic/core";

export function isHTMLDocument(self){
  return self instanceof HTMLDocument;
}

export function passDocumentDefault(f){
  return handle([isHTMLDocument, f], partial(f, document));
}
