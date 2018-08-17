import IFork from "./instance";
import {subj} from "../../core";
export const fork = subj(IFork.fork, 3);