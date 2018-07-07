import IPrependable from "./instance";
import {overload, identity} from "../../core";
import {reducing} from "../ireduce/concrete";
import {flip, realized} from "../../types/function/concrete";

export const prepend = overload(null, identity, IPrependable.prepend, reducing(IPrependable.prepend));
export const prependTo = realized(flip(IPrependable.prepend));