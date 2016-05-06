import {extend} from '../protocol.js';
import protocol from '../protocol.js';
import {isEmpty} from '../protocols/empty.js';
import {first, rest} from '../protocols/seq.js';
import {isIdentical} from '../core/core.js';
import {chain, subj} from '../core/function.js';
import * as index    from '../core/index.js';
import * as array    from '../core/array.js';
import * as cons     from '../core/cons.js';
import Cons          from '../core/cons.js';

export function sameContent(self, other){
  if (self == null || other == null) return self == other;
  return isEmpty(self) && isEmpty(other) || (eq(first(self), first(other)) && sameContent(rest(self), rest(other)));
}

const Eq = chain(
  protocol({
    eq: sameContent
  }),
  extend(Cons, {
    eq: sameContent
  }),
  extend(Number, {
    eq: isIdentical
  }),
  extend(String, {
    eq: isIdentical
  }), 
  extend(Array, {
    eq: function(self, other){
      return self.constructor === self.constructor && self.length === self.length && sameContent(self, other);
    }
  }));

export default Eq;
export const eq  = Eq.eq;
