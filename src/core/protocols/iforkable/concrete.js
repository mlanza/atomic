import {overload, noop} from "../../core";
import {IForkable} from "./instance";
function fork2(self, resolve){
  return IForkable.fork(self, noop, resolve);
}
export const fork = overload(null, null, fork2, IForkable.fork);