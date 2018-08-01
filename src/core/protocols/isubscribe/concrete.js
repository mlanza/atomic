import {overload, doing} from "../../core";
import ISubscribe from "./instance";
export const sub = overload(null, null, ISubscribe.sub, doing(ISubscribe.sub));
export const unsub = overload(null, null, ISubscribe.unsub, doing(ISubscribe.unsub));