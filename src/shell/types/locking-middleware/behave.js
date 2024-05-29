import * as _ from "atomic/core";
import * as $ from "../../effects.js";
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
      p.log("draining queued", queued);
      $.each(p.dispatch(self.bus, ?), queued);
    }
  }
}

export default _.does(
  _.keying("LockingMiddleware"),
  _.implement(IMiddleware, {handle}));
