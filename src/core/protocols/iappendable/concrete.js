import {IAppendable} from "./instance.js";
import {overload, identity} from "../../core.js";
import {reducing} from "../ireducible/concrete.js";
export const append = overload(null, identity, IAppendable.append, reducing(IAppendable.append));
