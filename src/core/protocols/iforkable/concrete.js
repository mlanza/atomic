import {overload, noop} from "../../core.js";
import {IForkable} from "./instance.js";
function fork2(self, resolve){
  return IForkable.fork(self, noop, resolve);
}
export const fork = overload(null, null, fork2, IForkable.fork);