import * as _ from "atomic/core";
import {IAppendable} from "./instance.js";
export const append = _.overload(null, _.noop, IAppendable.append, _.doing(IAppendable.append));
