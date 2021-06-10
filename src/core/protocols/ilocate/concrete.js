import {ILocate} from "./instance.js";
import {satisfies} from "../../types/protocol/concrete.js";
import {first} from "../../protocols/iseq/concrete.js";
import {query} from "../../protocols/iqueryable/concrete.js";
export function locate(self, criteria){
  return satisfies(ILocate, self) ? ILocate.locate(self, criteria) : first(query(self, criteria));
}