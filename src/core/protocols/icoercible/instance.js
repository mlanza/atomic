import {protocol} from "../../types/protocol.js";
import * as mm from "../../types/multimethod/construct.js";
import {invoke} from "../../protocols/ifn/concrete.js";
import {key} from "../../protocols/imapentry/concrete.js";
import {type} from "../../core.js";

function coerce(self, Type){
  return invoke(ICoercible.multimethod, self, Type);
}

export const ICoercible = protocol({
  coerce,
  toArray: null
});

ICoercible.multimethod = mm.multimethod(function(source, Type){
  return  [key(type(source)), key(Type)];
});
