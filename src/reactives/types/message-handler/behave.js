import {does, implement, ILookup} from "atomic/core";
import {IMiddleware} from "../../protocols/imiddleware/instance.js"

function handle(self, command, next){
  const type = ILookup.lookup(command, "type");
  const handler = ILookup.lookup(self.handlers, type) || self.fallback;
  IMiddleware.handle(handler, command, next);
}

export const behaveAsMessageHandler = does(
  implement(IMiddleware, {handle}));