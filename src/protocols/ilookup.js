import {protocol, satisfies} from "../types/protocol";
export const ILookup = protocol({
  lookup: null
});
export const lookup = ILookup.lookup;
export default ILookup;