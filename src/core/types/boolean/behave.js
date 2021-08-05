import {does, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {IInverse, IComparable} from "../../protocols.js";
import {naming} from "../../protocols/inamable/concrete.js";
import Symbol from "symbol";

function compare(self, other){
  return self === other ? 0 : self === true ? 1 : -1;
}

function inverse(self){
  return !self;
}

export default does(
  naming(?, Symbol("Boolean")),
  implement(IComparable, {compare}),
  implement(IInverse, {inverse}));
