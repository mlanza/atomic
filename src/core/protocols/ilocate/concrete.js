import {ILocate} from "./instance.js";
import {pre} from "../../core.js";
import {isString} from "../../types/string/construct.js";

function check(self, selector){
  return isString(selector);
}

export const locate = pre(ILocate.locate, check);
