import {does, implement, ILookup} from 'cloe/core';
import {IMiddleware} from "../../protocols/imiddleware/instance"

function handle(self, command, next){
  const type = ILookup.lookup(command, "type");
  const handler = ILookup.lookup(self.handlers, type) || self.fallback;
  IMiddleware.handle(handler, command, next);
}

export default does(
  implement(IMiddleware, {handle}));