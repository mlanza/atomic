import * as _ from "atomic/core";
import {document} from "dom";
import {IEmbeddable} from "../../protocols.js";
import Symbol from "symbol";

function embeddables(self){
  return [self];
}

export default _.does(
  _.naming(?, Symbol("Attrs")),
  _.implement(IEmbeddable, {embeddables}));
