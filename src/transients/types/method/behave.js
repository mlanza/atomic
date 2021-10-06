import * as _ from "atomic/core";
import Symbol from "symbol";

function invoke(self, args){
  return _.apply(self.f, args);
}

function handles(self, args){
  return _.apply(self.pred, args);
}

export default _.does(
  _.naming(?, Symbol("Method")),
  _.implement(_.IHandler, {handles}),
  _.implement(_.IFn, {invoke}));
