import {protocol} from "../../types/protocol";
import {identity} from "../../core";
export const IBlottable = protocol({
  blot: identity
});
export default IBlottable;