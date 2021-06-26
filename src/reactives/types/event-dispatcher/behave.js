import {does, partial, implement, each} from "atomic/core";
import {pub} from "../../protocols/ipublish/concrete.js";
import {release} from "../../protocols/ieventprovider/concrete.js";
import {handle as _handle, IMiddleware} from "../../protocols/imiddleware.js"

function handle(self, command, next){
  next(command);
  each(function(event){
    _handle(self.bus, event);
    pub(self.observer, event);
  }, release(self.events));
}

export default does(
  implement(IMiddleware, {handle}));