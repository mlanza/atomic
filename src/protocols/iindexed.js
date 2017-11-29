import {protocol} from "../protocol";

export const IIndexed = protocol({
  nth: null
});

export const nth = IIndexed.nth;
export default IIndexed;