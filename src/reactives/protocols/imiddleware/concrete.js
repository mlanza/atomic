import {does, overload, noop} from "atomic/core";
import {IMiddleware} from "./instance.js";
function handle2(self, message){
  return IMiddleware.handle(self, message, noop);
}
export const handle = overload(null, null, handle2, IMiddleware.handle);