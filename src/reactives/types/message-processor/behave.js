import {does, implement} from 'atomic/core';
import {IMiddleware} from "../../protocols/imiddleware/instance"

function handle(self, message, next){
  self.action(message);
  next(message);
}

export default does(
  implement(IMiddleware, {handle}));