import * as _ from "atomic/core";

export function EventMiddleware(emitter){
  this.emitter = emitter;
}

EventMiddleware.prototype[Symbol.toStringTag] = "EventMiddleware";

export const eventMiddleware = _.constructs(EventMiddleware);
