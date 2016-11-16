import {protocol, satisfies} from '../protocol.js';
export const Seq = protocol({
  first: null,
  rest: null
});
export const first = Seq.first;
export const rest  = Seq.rest;
export const isSeq = satisfies(Seq);
export default Seq;