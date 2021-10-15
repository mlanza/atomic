import {does, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {ISeq, ISeqable, IHashable} from "../../protocols.js";
import ilazyseq from "../lazy-seq/behave.js";
import {naming} from "../../protocols/inamable/concrete.js";
import {hashSeq as hash} from "../../protocols/ihashable/concrete.js";

function first(self){
  return self.head;
}

function rest(self){
  return self.tail;
}

export default does(
  ilazyseq,
  naming("List"),
  implement(IHashable, {hash}),
  implement(ISeqable, {seq: identity}),
  implement(ISeq, {first, rest}));
