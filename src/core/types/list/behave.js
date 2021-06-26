import {does, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {ISeq, ISeqable} from "../../protocols.js";
import ilazyseq from "../lazy-seq/behave.js";
import Symbol from "symbol";

function first(self){
  return self.head;
}

function rest(self){
  return self.tail;
}

export default does(
  ilazyseq,
  implement(ISeqable, {seq: identity}),
  implement(ISeq, {first, rest}));