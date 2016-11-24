import {protocol} from '../protocol';
export const Seq = protocol({
  first: null,
  rest: null
});
export const first = Seq.first;
export const rest = Seq.rest;
export default Seq;