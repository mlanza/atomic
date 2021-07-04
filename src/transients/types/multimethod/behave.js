import * as _ from "atomic/core";
import {ITransientCollection} from "../../protocols.js";

function conj(self, method){
  self.methods.push(method);
}

function invoke(self, ...args){
  const method = _.detect(_.matches(?, args), self.methods);
  if (method) {
    return _.invoke(method, args);
  } else if (self.fallback) {
    return self.fallback(...args);
  } else {
    throw new Error("No handler for these args.");
  }
}

export default _.does(
  _.implement(_.IFn, {invoke}),
  _.implement(ITransientCollection, {conj}));
