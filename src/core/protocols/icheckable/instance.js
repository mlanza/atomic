import {constantly} from "../../core";
import {protocol} from "../../types/protocol";
const terminal = constantly(false);
export const ICheckable = protocol({
  check: null,
  complaint: null,
  terminal
});
export default ICheckable;