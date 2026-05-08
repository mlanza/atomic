import * as _ from "atomic/core";
import * as $ from "../../effects.js";
import {IPrependable} from "./instance.js";
export const prepend = _.overload(null, _.noop, IPrependable.prepend, $.doing(IPrependable.prepend, _.reverse));
