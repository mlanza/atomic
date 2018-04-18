import {protocol, satisfies} from "../protocol";
import {partial} from "../core";

export const IAssociative = protocol({
  assoc: null,
  contains: null
});

export const assoc = IAssociative.assoc;
export const contains = IAssociative.contains;
export const isAssociative = partial(satisfies, IAssociative);
export default IAssociative;