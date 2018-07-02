import IPrependable from "./instance";
import {overload, identity} from "../../core";
import {reducing} from "../ireduce/concrete";
export const prepend = overload(null, identity, IPrependable.prepend, reducing(IPrependable.prepend));