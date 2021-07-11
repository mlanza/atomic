import {IMatchable} from "./instance.js";
import {pre, isString} from "../../core.js";
import {isRegExp} from "../../types/reg-exp/construct.js";

function checkPattern(_, pattern){
  return isString(pattern) || isRegExp(pattern);
}

export const matches = pre(IMatchable.matches, checkPattern);
