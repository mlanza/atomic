import {protocol, satisfies} from "../protocol";
import {partial} from "../core";

export const ISeq = protocol({
  first: null,
  rest: null,
  toArray: null
});

export const first = ISeq.first;
export const rest  = ISeq.rest;
export const toArray = ISeq.toArray;
export const isSeq = partial(satisfies, ISeq);
export default ISeq;