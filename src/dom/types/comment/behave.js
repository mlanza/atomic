import {does, implement} from 'cloe/core';
import {IEmbeddable} from "../../protocols";

function embed(self, parent) {
  parent.appendChild(self);
  return self;
}

export default does(
  implement(IEmbeddable, {embed}));