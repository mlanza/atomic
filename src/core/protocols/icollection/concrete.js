import {ICollection} from "./instance.js";
import {overload, identity} from "../../core.js";
import {reducing} from "../ireduce/concrete.js";
export const conj = overload(null, identity, ICollection.conj, reducing(ICollection.conj));