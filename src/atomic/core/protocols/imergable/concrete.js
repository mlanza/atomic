import {IMergable} from "./instance.js";
import {identity, overload} from "../../core.js";
import {reducing} from "../ireducible/concrete.js";
export const merge = overload(null, identity, IMergable.merge, reducing(IMergable.merge));
