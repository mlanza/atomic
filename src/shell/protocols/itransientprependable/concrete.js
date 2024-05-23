import * as _ from "atomic/core";
import {ITransientPrependable} from "./instance.js";
export const prepend = _.overload(null, _.noop, ITransientPrependable.prepend, _.doing(ITransientPrependable.prepend, _.reverse));
