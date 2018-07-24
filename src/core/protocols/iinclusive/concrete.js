import IInclusive from "./instance";
import {fork} from "../../predicates";
import {yank} from "../iyank/concrete";
import {conj} from "../icollection/concrete";

export const includes = IInclusive.includes;
export const transpose = fork(includes, yank, conj);