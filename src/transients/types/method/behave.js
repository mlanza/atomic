import {does, implement, apply, IFn, IMatch} from "atomic/core";

function invoke(self, args){
  return apply(self.f, args);
}

function matches(self, args){
  return apply(self.pred, args);
}

export const behaveAsMethod = does(
  implement(IMatch, {matches}),
  implement(IFn, {invoke}));