import {constantly, protocol} from "cloe/core";
const terminal = constantly(false);
export const ICheckable = protocol({
  check: null,
  complaint: null,
  terminal
});
export default ICheckable;