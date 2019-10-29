import ITransientPrependable from "./instance";
import {overload, noop, doing} from "atomic/core";
export const prepend = overload(null, noop, ITransientPrependable.prepend, doing(ITransientPrependable.prepend));