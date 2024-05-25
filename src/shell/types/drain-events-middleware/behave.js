import * as _ from "atomic/core";
import * as $ from "../../effects.js";
import * as p from "../../protocols/concrete.js";
import {IMiddleware} from "../../protocols.js";

function handle(self, command, next){
  next(command);
  $.each(function(message){
    p.handle(self.eventBus, message, next);
  }, p.release(self.provider));
}

export default _.does(
  _.keying("DrainEventsMiddleware"),
  _.implement(IMiddleware, {handle}));
