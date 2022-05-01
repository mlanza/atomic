import {protocol, satisfies} from "../../types/protocol.js";
import {invoke} from "../../protocols/ifn/concrete.js";
import {key as k} from "../../protocols/imapentry/concrete.js";
import {type} from "../../core.js";
import {multimethod} from "../../types/multimethod/construct.js";
import {addMethod as _addMethod} from "../../types/multimethod/concrete.js";

function key(self){
  try {
    return k(self);
  } catch {
    return self; //coercible fallback
  }
}

//hide the details of using `key` for potential cross-frame compatibility
const mm = multimethod(function(source, Type){
  return  [key(type(source)), key(Type)];
});

const coerce = invoke(mm, ?, ?);

export const ICoercible = protocol({
  coerce
});

ICoercible.addMethod = function addMethod(match, f){
  if (match == null) {
    return mm;
  } else if (typeof match === "function") {
    return function(Type){
      addMethod(match(Type), f);
    }
  } else {
    const [from, to] = match;
    _addMethod(mm, [key(from), key(to)], f);
  }
}
