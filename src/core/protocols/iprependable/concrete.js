import {IPrependable} from "./instance";
import {overload, identity} from "../../core";
import {reducing} from "../ireduce/concrete";
import {reverse} from "../ireversible";
export const prepend = overload(null, identity, IPrependable.prepend, reducing(IPrependable.prepend, reverse));