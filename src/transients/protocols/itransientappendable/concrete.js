import * as _ from "atomic/core";
import {ITransientAppendable} from "./instance.js";
export const append = _.overload(null, _.noop, ITransientAppendable.append, _.doing(ITransientAppendable.append));
