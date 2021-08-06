import * as _ from "atomic/core";
import {HTMLDocument} from "dom";

export function isHTMLDocument(self){
  return _.ako(self, HTMLDocument);
}
