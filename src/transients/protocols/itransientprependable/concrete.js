import {ITransientPrependable} from "./instance.js";
import {overload, noop, doing, reverse} from "atomic/core";
export const prepend = overload(null, noop, ITransientPrependable.prepend, doing(ITransientPrependable.prepend, reverse));