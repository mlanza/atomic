import * as _ from "atomic/core";
import {IMiddleware} from "../../protocols.js";

function handle(self, message, next){
  self.effect(message);
  next(message);
}

export default _.does(
  _.implement(IMiddleware, {handle}));
