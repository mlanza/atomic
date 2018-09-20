import {protocol} from "../../types/protocol";
import {when} from "../../core";
export const IEvented = protocol({
  on: when,
  off: null,
  trigger: null
});
export default IEvented;