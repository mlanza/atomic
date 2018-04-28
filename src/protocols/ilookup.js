import {protocol, satisfies} from "../protocol";
export const ILookup = protocol({
  lookup: null
});
export const lookup = ILookup.lookup;
export default ILookup;