import * as _ from "atomic/core";
import {ITransientCollection} from "../../protocols.js";

function conj(self, method){
  self.methods.push(method);
}

function handles(self, args){
  return _.detect(_.handles(?, args), self.methods) || self.fallback;
}

function invoke(self, ...args){
  const method = handles(self, args);
  if (method) {
    return _.invoke(method, args);
  } else {
    throw new Error("No suitable method for args.");
  }
}

export default _.does(
  _.naming("Multimethod"),
  _.implement(_.IFn, {invoke}),
  _.implement(ITransientCollection, {conj}));
