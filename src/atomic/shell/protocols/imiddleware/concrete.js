import * as _ from "atomic/core";
import {IMiddleware} from "./instance.js";
function handle2(self, message){
  return IMiddleware.handle(self, message, _.noop);
}
export const handle = _.overload(null, null, handle2, IMiddleware.handle);
export const {addMiddleware, addHandler} = IMiddleware;
