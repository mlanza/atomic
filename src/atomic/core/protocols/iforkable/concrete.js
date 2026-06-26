import {overload, noop} from "../../core.js";
import {IForkable} from "./instance.js";
export const fork = overload(null, null, (self, resolve) => IForkable.fork(self, noop, resolve), IForkable.fork);
