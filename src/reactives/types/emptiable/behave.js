import {does, implement, ISeq, ISeqable} from "atomic/core";
import * as _ from "atomic/core";

const forward = _.forwardTo("coll");
const first = forward(ISeq.first);
const rest = forward(ISeq.rest);
const seq = forward(ISeqable.seq);

//support iteration (e.g. `each`)
export const behaveAsEmptiable = does(
  implement(ISeq, {first, rest}),
  implement(ISeqable, {seq}));