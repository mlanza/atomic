import {does} from "../../core";
import {matches} from "../../protocols/imatch/concrete";
import {implement} from '../protocol';
import {detect} from "../lazy-seq/concrete";
import {IFn, IAppendable, IPrependable} from '../../protocols';
import {_ as v} from "param.macro";

function append(self, method){
  self.methods.push(method);
  return self;
}

function prepend(self, method){
  self.methods.unshift(method);
  return self;
}

function invoke(self, ...args){
  const method = detect(matches(v, args), self.methods);
  if (method) {
    return IFn.invoke(method, args);
  } else if (self.fallback) {
    return self.fallback(...args);
  } else {
    throw new Error("No handler for these args.");
  }
}

export default does(
  implement(IFn, {invoke}),
  implement(IPrependable, {prepend}),
  implement(IAppendable, {append}));