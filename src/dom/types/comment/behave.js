import {does, implement} from 'atomic/core';
import {IEmbeddable} from "../../protocols";

function embed(self, parent) {
  parent.appendChild(self);
}

export const behaveAsComment = does(
  implement(IEmbeddable, {embed}));