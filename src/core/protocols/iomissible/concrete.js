import {overload, identity} from "../../core.js";
import {IOmissible} from "./instance.js";
import {reducing} from "../ireducible/concrete.js";
export const omit = overload(null, identity, IOmissible.omit, reducing(IOmissible.omit));
