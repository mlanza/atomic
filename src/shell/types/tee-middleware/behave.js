import * as _ from "atomic/core";
import {IMiddleware} from "../../protocols.js";
import Symbol from "symbol";

function handle(self, message, next){
  self.effect(message);
  next(message);
}

export default _.does(
  _.naming(?, Symbol("TeeMiddleware")),
  _.implement(IMiddleware, {handle}));
