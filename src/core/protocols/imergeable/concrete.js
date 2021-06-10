import {IMergeable} from "./instance.js";
import {identity, overload} from "../../core.js";
import {reducing} from "../ireduce/concrete.js";
export const merge = overload(null, identity, IMergeable.merge, reducing(IMergeable.merge));