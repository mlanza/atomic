import * as _ from "atomic/core";
import * as $ from "../../effects.js";
import {ICollection} from "./instance.js";
export const conj = _.overload(null, _.noop, ICollection.conj, $.doing(ICollection.conj));
export const unconj = _.overload(null, _.noop, ICollection.unconj, $.doing(ICollection.unconj));
