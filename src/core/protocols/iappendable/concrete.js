import IAppendable from "./instance";
import {overload, identity} from "../../core";
import {reducing} from "../ireduce/concrete";
export const append = overload(null, identity, IAppendable.append, reducing(IAppendable.append));