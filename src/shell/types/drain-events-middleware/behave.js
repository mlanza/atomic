import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {IMiddleware} from "../../protocols.js";

function handle(self, command, next){
  next(command);
  _.each(function(message){
    p.handle(self.eventBus, message, next);
  }, p.release(self.provider));
}

export default _.does(
  _.naming("DrainEventsMiddleware"),
  _.implement(IMiddleware, {handle}));
