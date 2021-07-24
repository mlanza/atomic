import * as _ from "atomic/core";

export function EventMiddleware(emitter){
  this.emitter = emitter;
}

export const eventMiddleware = _.constructs(EventMiddleware);
