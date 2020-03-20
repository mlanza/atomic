import {IMergeable} from "./instance";
import {identity, overload} from "../../core";
import {reducing} from "../ireduce/concrete";
export const merge = overload(null, identity, IMergeable.merge, reducing(IMergeable.merge));