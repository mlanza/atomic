import {protocol} from '../protocol';
import {of} from '../coll';

function _vals(self){
  return of(self.values.bind(self));
}

function _keys(self){
  return of(self.keys.bind(self));
}

export const Associative = protocol({
  assoc: null,
  dissoc: null,
  hasKey: null,
  hasVal: null, //TODO?
  keys: _keys,
  vals: _vals
});

export const assoc = Associative.assoc;
export const dissoc = Associative.dissoc;
export const hasKey = Associative.hasKey;
export const keys = Associative.keys;
export const vals = Associative.vals;
export default Associative;