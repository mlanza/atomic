import {ISeq} from "./instance.js";
import {comp} from "../../core.js";
export const first = ISeq.first;
export const rest = ISeq.rest;
export const second = comp(ISeq.first, ISeq.rest);
