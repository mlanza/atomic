import {does, partial, implement, each} from 'cloe/core';
import {pub} from "../../protocols/ipublish/concrete";
import {release} from "../../protocols/ieventprovider/concrete";
import {handle as _handle, IMiddleware} from "../../protocols/imiddleware"

function handle(self, command, next){
  next(command);
  each(function(event){
    _handle(self.bus, event);
    pub(self.publisher, event);
  }, release(self.events));
}

export default does(
  implement(IMiddleware, {handle}));