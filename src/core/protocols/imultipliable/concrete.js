import {IMultipliable} from "./instance";
import {overload, constantly, identity} from "../../core";
import {reducing} from "../ireduce/concrete";
export const mult = overload(constantly(1), identity, IMultipliable.mult, reducing(IMultipliable.mult));