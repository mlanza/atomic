import {flip} from '../core';
import {protocol} from '../protocol';
export const Associative = protocol({
  assoc: null,
  hasKey: null
});
export const assoc = flip(Associative.assoc, 3);
export const hasKey = flip(Associative.hasKey, 2);
export default Associative;