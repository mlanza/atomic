import * as _ from "atomic/core";
import Symbol from "symbol";

export function EventMiddleware(emitter){
  this.emitter = emitter;
}

EventMiddleware.prototype[Symbol.toStringTag] = "EventMiddleware";

export const eventMiddleware = _.constructs(EventMiddleware);
