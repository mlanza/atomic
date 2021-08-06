import {ako} from "../../protocols/inamable/concrete.js";

export function isError(self){
  return ako(self, Error);
}
