import {flip} from '../core.js';
import {protocol} from '../protocol.js';
export const Associative = protocol({
  assoc: null,
  hasKey: null
});
export const assoc = flip(Associative.assoc, 3);
export const hasKey = flip(Associative.hasKey, 2);
export default Associative;