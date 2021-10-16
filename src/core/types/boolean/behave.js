import {does, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {IInverse, IComparable} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function compare(self, other){
  return self === other ? 0 : self === true ? 1 : -1;
}

function inverse(self){
  return !self;
}

export default does(
  keying("Boolean"),
  implement(IComparable, {compare}),
  implement(IInverse, {inverse}));
