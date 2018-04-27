import {protocol, satisfies} from "../protocol";
import {partial} from "../core";

export const IIndexed = protocol({
  nth: null
});

export const nth = IIndexed.nth;
export const isIndexed = partial(satisfies, IIndexed);
export default IIndexed;