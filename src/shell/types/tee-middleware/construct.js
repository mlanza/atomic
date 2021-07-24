import * as _ from "atomic/core";

export function TeeMiddleware(effect){
  this.effect = effect;
}

export const teeMiddleware = _.constructs(TeeMiddleware);
