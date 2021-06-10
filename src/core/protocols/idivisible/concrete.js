import {IDivisible} from "./instance.js";
import {overload, identity} from "../../core.js";
import {reducing} from "../ireduce/concrete.js";
export const divide = overload(null, identity, IDivisible.divide, reducing(IDivisible.divide));