import {protocol, satisfies} from "../protocol";
import {partial} from "../core";

export const ILookup = protocol({
  lookup: null
});

export const lookup = ILookup.lookup;
export default ILookup;