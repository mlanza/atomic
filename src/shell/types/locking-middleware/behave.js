import * as _ from "atomic/core";
import * as $ from "../../effects.js";
import * as p from "../../protocols/concrete.js";
import {IMiddleware} from "../../protocols/imiddleware/instance.js";

function handle(self, message, next){
  if (self.handling) {
    self.queued.push(message);
  } else {
    try {
      self.handling = true;
      next(message);
    } finally {
      self.handling = false;
    }
    if (self.queued.length) {
      const queued = self.queued;
      self.queued = [];
      $.each(p.dispatch(self.bus, ?), queued);
    }
  }
}

export default _.does(
  _.keying("LockingMiddleware"),
  _.implement(IMiddleware, {handle}));
