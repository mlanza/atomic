import {IInclusive} from "./instance.js";
import {branch} from "../../core.js";
import {yank} from "../iyankable/concrete.js";
import {conj} from "../icollection/concrete.js";

export const includes = IInclusive.includes;
export function excludes(self, value){
  return !includes(self, value);
}
export const transpose = branch(includes, yank, conj);