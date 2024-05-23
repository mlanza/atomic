import * as _ from "atomic/core";
import {IPrependable} from "./instance.js";
export const prepend = _.overload(null, _.noop, IPrependable.prepend, _.doing(IPrependable.prepend, _.reverse));
