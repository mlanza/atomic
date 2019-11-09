import {ITransientAppendable} from "./instance";
import {overload, noop, doing} from "atomic/core";
export const append = overload(null, noop, ITransientAppendable.append, doing(ITransientAppendable.append));