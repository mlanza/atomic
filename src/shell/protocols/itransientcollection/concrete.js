import * as _ from "atomic/core";
import {ITransientCollection} from "./instance.js";
export const conj = _.overload(null, _.noop, ITransientCollection.conj, _.doing(ITransientCollection.conj));
export const unconj = _.overload(null, _.noop, ITransientCollection.unconj, _.doing(ITransientCollection.unconj));
