import {protocol, satisfies} from "../protocol";
import {partial} from "../core";

export const ISeqable = protocol({
  seq: null
});

export const seq = ISeqable.seq;
export const isSeqable = partial(satisfies, ISeqable);
export default ISeqable;