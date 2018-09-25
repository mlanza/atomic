import {protocol, when} from "cloe/core";
export const IEvented = protocol({
  on: when,
  off: null,
  trigger: null
});
export default IEvented;