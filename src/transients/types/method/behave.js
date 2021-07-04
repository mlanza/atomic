import * as _ from "atomic/core";

function invoke(self, args){
  return _.apply(self.f, args);
}

function matches(self, args){
  return _.apply(self.pred, args);
}

export default _.does(
  _.implement(_.IMatchable, {matches}),
  _.implement(_.IFn, {invoke}));
