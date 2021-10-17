import {protocol} from "../../types/protocol.js";
import {invoke} from "../../protocols/ifn/concrete.js";
import {key} from "../../protocols/imapentry/concrete.js";
import {type} from "../../core.js";
import {multimethod} from "../../types/multimethod/construct.js";
import {addMethod} from "../../types/multimethod/concrete.js";

//hide the details of using `key` for potential cross-frame compatibility
const mm = multimethod(function(source, Type){
  return  [key(type(source)), key(Type)];
});

const coerce = invoke(mm, ?, ?);

export const ICoercible = protocol({
  coerce
});

ICoercible.addMethod = function([from, to], f){
  addMethod(mm, [key(from), key(to)], f);
}

ICoercible.to = function(to, f){
  return function(from){
    ICoercible.addMethod([from, to], f);
  }
}
