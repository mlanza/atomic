import {extend} from '../protocol.js';
import protocol from '../protocol.js';
import {chain, multimethod} from '../core/function.js';
import * as object   from '../core/object.js';
import * as array    from '../core/array.js';
import * as string   from '../core/string.js';
import * as dom      from '../core/dom.js';

function fail(target){
  throw new Error("Cannot resolve protocol for target: " + target);
}

function whenElement(f){
  return function(target){
    return target instanceof HTMLElement ? f : fail;
  }
}

const Extend = chain(
  protocol({ //TODO protocol should provide secondary means of dynamically extending -- use multimethod as defaultFn
    append: multimethod(whenElement(dom.append)), //TODO provide a dynamic means of setting defaultFn of protocol.
    prepend: multimethod(whenElement(dom.prepend)) //TODO alternately, provide a way of wrapping an existing function with an alternative handler -- this mechanism doesn't make a multimethod easy to extend (or unextend) and it should be
  }),
  extend(String, {
    append: string.append,
    prepend: string.prepend
  }), 
  extend(Array, {
    append: array.append,
    prepend: array.prepend
  }), 
  extend(Object, {
    append: object.append,
    prepend: object.prepend
  }));

export default Extend;
export const append  = Extend.append;
export const prepend = Extend.prepend;
