import {does, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {ISeq, ISeqable, IHashable} from "../../protocols.js";
import lazyseq from "../lazy-seq/behave.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {hashSeq as hash} from "../../protocols/ihashable/hashers.js";

function first(self){
  return self.head;
}

function rest(self){
  return self.tail;
}

export default does(
  lazyseq,
  keying("List"),
  implement(IHashable, {hash}),
  implement(ISeqable, {seq: identity}),
  implement(ISeq, {first, rest}));
