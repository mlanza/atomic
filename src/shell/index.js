import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import * as p from "./protocols/concrete.js";
import {IDispatch} from "./protocols/idispatch/instance.js";
import {multimethod, method} from "./types/router/construct.js";
export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";

export function defs(construct, keys){
  return _.reduce(function(memo, key){
    return _.assoc(memo, key, construct(key));
  }, {}, keys);
}
export function dispatchable(Cursor){ //from `atomic/reactives`

  function dispatch(self, command){
    p.dispatch(self.source, _.update(command, "path", function(path){
      return _.apply(_.conj, self.path, path || []);
    }));
  }

  _.doto(Cursor,
     _.implement(IDispatch, {dispatch}));

}

(function(){

  function dispatch(self, args){
    return _.apply(self, args);
  }

  _.doto(Function,
    _.implement(IDispatch, {dispatch}));

})();

export const parseDate = multimethod(_.date);

parseDate
  |> _.deref
  |> mut.conj(?,
      method(_.test(_.mdy       , ?), _.fromMDY),
      method(_.test(_.jsonDate  , ?), _.fromJsonDate),
      method(_.test(_.serialDate, ?), _.fromSerialDate),
      method(_.test(_.localDate , ?), _.fromLocalDate),
      method(_.test(_.timestamp , ?), _.fromTimestamp));
