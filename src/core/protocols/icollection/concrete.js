import ICollection from "./instance";
import {overload, identity} from "../../core";
import {reducing} from "../ireduce/concrete";
export const conj = overload(null, identity, ICollection.conj, reducing(ICollection.conj));