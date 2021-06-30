import {IQueryable} from "./instance.js";
import {pre} from "../../core.js";
import {isString} from "../../types/string/construct.js";

function check(self, selector){
  return isString(selector);
}

export const query = pre(IQueryable.query, check);
