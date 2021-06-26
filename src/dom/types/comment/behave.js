import {does, implement} from "atomic/core";
import {IEmbeddable} from "../../protocols.js";

function embed(self, parent) {
  parent.appendChild(self);
}

export default does(
  implement(IEmbeddable, {embed}));