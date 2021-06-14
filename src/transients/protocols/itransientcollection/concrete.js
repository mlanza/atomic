import {ITransientCollection} from "./instance.js";
import {noop, overload, doing} from "atomic/core";
export const conj = overload(null, noop, ITransientCollection.conj, doing(ITransientCollection.conj));
export const unconj = overload(null, noop, ITransientCollection.unconj, doing(ITransientCollection.unconj));