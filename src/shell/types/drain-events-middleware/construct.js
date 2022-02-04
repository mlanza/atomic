import * as _ from "atomic/core";

export function DrainEventsMiddleware(provider, eventBus){
  this.provider = provider;
  this.eventBus = eventBus;
}

DrainEventsMiddleware.prototype[Symbol.toStringTag] = "DrainEventsMiddleware";

export const drainEventsMiddleware = _.constructs(DrainEventsMiddleware);
