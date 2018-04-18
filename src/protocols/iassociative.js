import {protocol, satisfies} from "../protocol";
import {partial} from "../core";

export const IAssociative = protocol({
  assoc: null,
  containsKey: null
});

export const assoc = IAssociative.assoc;
export const containsKey = IAssociative.containsKey;
export const isAssociative = partial(satisfies, IAssociative);
export default IAssociative;