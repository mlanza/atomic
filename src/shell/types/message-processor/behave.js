import * as _ from "atomic/core";
import {IMiddleware} from "../../protocols/imiddleware/instance.js"

function handle(self, message, next){
  self.action(message);
  next(message);
}

export default _.does(
  _.implement(IMiddleware, {handle}));
