import {XMLDocument} from "dom";

export function isXMLDocument(self){
  return self instanceof XMLDocument;
}