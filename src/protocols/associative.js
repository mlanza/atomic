import {protocol} from '../protocol';
export const Associative = protocol({
  assoc: null,
  dissoc: null,
  hasKey: null
});
export const assoc = Associative.assoc;
export const dissoc = Associative.dissoc;
export const hasKey = Associative.hasKey;
export default Associative;