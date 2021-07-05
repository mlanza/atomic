import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {release} from "../../protocols/ieventprovider/concrete.js";
import {handle as _handle, IMiddleware} from "../../protocols/imiddleware.js"

function handle(self, command, next){
  next(command);
  _.each(function(event){
    p.handle(self.bus, event);
    p.pub(self.observer, event);
  }, p.release(self.events));
}

export default _.does(
  _.implement(IMiddleware, {handle}));
