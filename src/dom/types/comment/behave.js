import {does, implement} from 'atomic/core';
import {IEmbeddable} from "../../protocols";

function embed(self, parent) {
  parent.appendChild(self);
  return self;
}

export default does(
  implement(IEmbeddable, {embed}));