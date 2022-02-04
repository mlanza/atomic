import * as _ from "atomic/core";

export function TeeMiddleware(effect){
  this.effect = effect;
}

TeeMiddleware.prototype[Symbol.toStringTag] = "TeeMiddleware";

export const teeMiddleware = _.constructs(TeeMiddleware);
