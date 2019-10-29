import ITransientCollection from "./instance";
import {noop, overload, doing} from "atomic/core";
export const conj = overload(null, noop, ITransientCollection.conj, doing(ITransientCollection.conj));