import {IMultipliable} from "./instance.js";
import {overload, constantly, identity} from "../../core.js";
import {reducing} from "../ireducible/concrete.js";
export const mult = overload(constantly(1), identity, IMultipliable.mult, reducing(IMultipliable.mult));
