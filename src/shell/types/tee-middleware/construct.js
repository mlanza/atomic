import * as _ from "atomic/core";
import Symbol from "symbol";

export function TeeMiddleware(effect){
  this.effect = effect;
}

TeeMiddleware.prototype[Symbol.toStringTag] = "TeeMiddleware";

export const teeMiddleware = _.constructs(TeeMiddleware);
