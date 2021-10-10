import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {IMiddleware} from "../../protocols/imiddleware/instance.js";

function handle(self, message, next){
  if (self.handling) {
    self.queued.push(message);
  } else {
    self.handling = true;
    next(message);
    self.handling = false;
    if (self.queued.length) {
      const queued = self.queued;
      self.queued = [];
      _.log("draining queued", queued);
      _.each(p.dispatch(self.bus, ?), queued);
    }
  }
}

export default _.does(
  _.naming("LockingMiddleware"),
  _.implement(IMiddleware, {handle}));
