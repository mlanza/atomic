import {IPrependable} from "./instance.js";
import {overload, identity} from "../../core.js";
import {reducing} from "../ireduce/concrete.js";
import {reverse} from "../ireversible.js";
export const prepend = overload(null, identity, IPrependable.prepend, reducing(IPrependable.prepend, reverse));