import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import {IMiddleware} from "../../protocols.js";

function handle(self, event, next){
  $.pub(self.emitter, event);
  next(event);
}

export default _.does(
  _.naming("EventMiddleware"),
  _.implement(IMiddleware, {handle}));
