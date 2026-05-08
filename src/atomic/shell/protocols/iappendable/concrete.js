import * as _ from "atomic/core";
import * as $ from "../../effects.js";
import {IAppendable} from "./instance.js";
export const append = _.overload(null, _.noop, IAppendable.append, $.doing(IAppendable.append));
