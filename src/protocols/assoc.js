import {extend} from '../protocol.js';
import protocol from '../protocol.js';
import {chain, subj} from '../core/function.js';
import * as object   from '../core/object.js';
import * as array    from '../core/array.js';
import * as string   from '../core/string.js';

function fail(){
  throw "fail";
}

const Assoc = chain(
  protocol({
    assoc: function(self, key, value){
      return self instanceof HTMLElement ? dom.setAttr(self, key, value) : fail();
    },
    hasKey: null
  }),
  extend(String, {
    assoc: string.assoc,
    hasKey: string.hasKey
  }), 
  extend(Array, {
    assoc: array.assoc,
    hasKey: array.hasKey
  }), 
  extend(Object, {
    assoc: object.assoc,
    hasKey: object.hasKey
  }));

export default Assoc;
export const assoc  = Assoc.assoc;
export const hasKey = Assoc.hasKey;
