import {protocol, satisfies} from "../types/protocol";
export const INext = protocol({
  next: null
});
export const next = INext.next;
export default INext;