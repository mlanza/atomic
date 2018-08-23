import {does, overload, noop} from '../../core';
import IMiddleware from "./instance";
function handle2(self, message){
  return IMiddleware.handle(self, message, noop);
}
export const handle = overload(null, null, handle2, IMiddleware.handle);