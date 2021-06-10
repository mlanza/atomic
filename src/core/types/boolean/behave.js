import {does, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {IInverse, IComparable} from "../../protocols.js";

function compare(self, other){
  return self === other ? 0 : self === true ? 1 : -1;
}

function inverse(self){
  return !self;
}

export const behaveAsBoolean = does(
  implement(IComparable, {compare}),
  implement(IInverse, {inverse}));