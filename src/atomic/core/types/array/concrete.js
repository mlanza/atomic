import {coerce} from "../../coerce.js";

export const isArray = Array.isArray;
export const toArray = x => coerce(x, Array);
