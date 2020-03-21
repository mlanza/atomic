import {IDivisible} from "./instance";
import {overload, identity} from "../../core";
import {reducing} from "../ireduce/concrete";
export const divide = overload(null, identity, IDivisible.divide, reducing(IDivisible.divide));