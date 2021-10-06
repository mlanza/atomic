import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import {IMiddleware} from "../../protocols.js";
import Symbol from "symbol";

function handle(self, event, next){
  $.pub(self.emitter, event);
  next(event);
}

export default _.does(
  _.naming(?, Symbol("EventMiddleware")),
  _.implement(IMiddleware, {handle}));
