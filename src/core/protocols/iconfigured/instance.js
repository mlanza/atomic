import {protocol} from "../../types/protocol";
import {constantly} from "../../core";
export const IConfigured = protocol({
  config: constantly(null)
});
export default IConfigured;