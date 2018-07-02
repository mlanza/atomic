import {protocol} from "../../types/protocol";
export const IEvented = protocol({
  on: null,
  off: null,
  trigger: null
});
export default IEvented;