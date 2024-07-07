import {identity, type} from "./core.js";
import {multimethod} from "./types/multimethod/construct.js";
import {satisfies} from "./types/protocol/concrete.js";
import {IMapEntry} from "./protocols/imapentry/instance.js";
import {key as k} from "./protocols/imapentry/concrete.js";

function key(self){
  if (satisfies(IMapEntry, "key", self)) {
    return k(self);
  } else {
    return self; //coercible fallback
  }
}

//hide the details of using `key` for potential cross-realm compatibility
export const coerce = multimethod(function(source, Type){
  return  [key(type(source)), key(Type)];
});
