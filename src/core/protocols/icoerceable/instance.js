import {protocol} from "../../types/protocol.js";
export const ICoerceable = protocol({
  toArray: null,
  toObject: null,
  toPromise: null,
  toDuration: null
});