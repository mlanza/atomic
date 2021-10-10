import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as p from "../../protocols/concrete.js";
import {release} from "../../protocols/ieventprovider/concrete.js";
import {IMiddleware} from "../../protocols.js";

function handle(self, command, next){
  next(command);
  _.each(function(event){
    p.handle(self.bus, event);
    $.pub(self.observer, event);
  }, p.release(self.events));
}

export default _.does(
  _.naming("EventDispatcher"),
  _.implement(IMiddleware, {handle}));
