import * as _ from "atomic/core";

export function isHTMLDocument(self){
  return _.is(self, HTMLDocument);
}
