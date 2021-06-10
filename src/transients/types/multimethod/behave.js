import {IFn, does, matches, implement, detect} from "atomic/core";
import {ITransientCollection} from "../../protocols.js";

function conj(self, method){
  self.methods.push(method);
}

function invoke(self, ...args){
  const method = detect(matches(?, args), self.methods);
  if (method) {
    return IFn.invoke(method, args);
  } else if (self.fallback) {
    return self.fallback(...args);
  } else {
    throw new Error("No handler for these args.");
  }
}

export const behaveAsMultimethod = does(
  implement(IFn, {invoke}),
  implement(ITransientCollection, {conj}));