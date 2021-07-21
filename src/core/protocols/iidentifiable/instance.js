import {protocol} from "../../types/protocol.js";
export const IIdentifiable = protocol({
  identifier: null //machine-friendly name (lowercase, no embedded spaces) offering reasonable uniqueness within a context
});
