import {protocol} from "../protocol";

export const INext = protocol({
  next: null
});

export const next = INext.next;
export default INext;