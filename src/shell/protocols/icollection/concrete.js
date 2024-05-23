import * as _ from "atomic/core";
import {ICollection} from "./instance.js";
export const conj = _.overload(null, _.noop, ICollection.conj, _.doing(ICollection.conj));
export const unconj = _.overload(null, _.noop, ICollection.unconj, _.doing(ICollection.unconj));
