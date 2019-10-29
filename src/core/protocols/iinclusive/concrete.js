import IInclusive from "./instance";
import {branch} from "../../core";
import {yank} from "../iyankable/concrete";
import {conj} from "../icollection/concrete";

export const includes = IInclusive.includes;
export function excludes(self, value){
  return !includes(self, value);
}
export const transpose = branch(includes, yank, conj);