import {ako} from "../../protocols/imapentry/concrete.js";

export function isError(self){
  return ako(self, Error);
}
