import {XMLDocument} from "dom";
export {XMLDocument} from "dom"; //XMLDocument || Document; ensure IE fallback

export function isXMLDocument(self){
  return self instanceof XMLDocument;
}