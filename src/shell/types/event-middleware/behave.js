import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {IMiddleware} from "../../protocols.js";

function handle(self, event, next){
  p.pub(self.emitter, event);
  next(event);
}

export default _.does(
  _.keying("EventMiddleware"),
  _.implement(IMiddleware, {handle}));
