import * as _ from "atomic/core";
import {document} from "dom";
import {IEmbeddable} from "../../protocols.js";

function embeddables(self){
  return [self];
}

export default _.does(
  _.keying("Attrs"),
  _.implement(IEmbeddable, {embeddables}));
