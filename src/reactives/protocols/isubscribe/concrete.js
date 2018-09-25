import {overload, doing} from "cloe/core";
import ISubscribe from "./instance";
export const sub = overload(null, null, ISubscribe.sub, doing(ISubscribe.sub));
export const unsub = overload(null, null, ISubscribe.unsub, doing(ISubscribe.unsub));
export const subscribed = ISubscribe.subscribed;