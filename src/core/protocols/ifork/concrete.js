import {overload, noop} from "../../core";
import {IFork} from "./instance";
function fork2(self, resolve){
  return IFork.fork(self, noop, resolve);
}
export const fork = overload(null, null, fork2, IFork.fork);