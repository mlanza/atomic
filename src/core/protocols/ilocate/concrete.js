import ILocate from "./instance";
import {satisfies} from "../../types/protocol/concrete";
import {first} from "../../protocols/iseq/concrete";
import {query} from "../../protocols/iqueryable/concrete";
export function locate(self, criteria){
  return satisfies(ILocate, self) ? ILocate.locate(self, criteria) : first(query(self, criteria));
}