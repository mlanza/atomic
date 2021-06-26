import {does, implement, apply, IFn, IMatchable} from "atomic/core";

function invoke(self, args){
  return apply(self.f, args);
}

function matches(self, args){
  return apply(self.pred, args);
}

export default does(
  implement(IMatchable, {matches}),
  implement(IFn, {invoke}));