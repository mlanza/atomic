import {does, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {ISeq, ISeqable} from "../../protocols.js";
import {behaveAsLazySeq} from "../lazy-seq/behave.js";
import Symbol from "symbol";

function first(self){
  return self.head;
}

function rest(self){
  return self.tail;
}

export const behaveAsList = does(
  behaveAsLazySeq,
  implement(ISeqable, {seq: identity}),
  implement(ISeq, {first, rest}));