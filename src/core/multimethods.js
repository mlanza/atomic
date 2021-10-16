import {multimethod} from "./types/multimethod/construct.js";
import {key} from "./protocols/imapentry/concrete.js";
import {type} from "./core.js";

export const coerce = multimethod(function(source, Type){
  return  [key(type(source)), key(Type)];
});
