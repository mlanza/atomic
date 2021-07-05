import * as _ from "atomic/core";
import {IEmbeddable} from "../../protocols.js";

function embed(self, parent) {
  parent.appendChild(self);
}

export default _.does(
  _.implement(IEmbeddable, {embed}));
