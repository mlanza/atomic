import IAppendable from "./instance";
import {overload, identity} from "../../core";
import {reducing} from "../ireduce/concrete";
import {flip, realized} from "../../types/function/concrete";

export const append = overload(null, identity, IAppendable.append, reducing(IAppendable.append));
export const appendTo = realized(flip(IAppendable.append));