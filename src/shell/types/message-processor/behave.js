import * as _ from "atomic/core";
import {IMiddleware} from "../../protocols/imiddleware/instance.js"
import Symbol from "symbol";

function handle(self, message, next){
  self.action(message);
  next(message);
}

export default _.does(
  _.naming(?, Symbol("MessageProcessor")),
  _.implement(IMiddleware, {handle}));
