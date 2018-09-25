import {does, implement} from 'cloe/core';
import {IMiddleware} from "../../protocols/imiddleware/instance"

function handle(self, message, next){
  self.action(message);
  next(message);
}

export default does(
  implement(IMiddleware, {handle}));