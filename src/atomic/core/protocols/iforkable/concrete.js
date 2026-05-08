import {overload, noop} from "../../core.js";
import {IForkable} from "./instance.js";
export const fork = overload(null, null, IForkable.fork(?, noop, ?), IForkable.fork);
