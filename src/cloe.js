import * as Cloe from "./core";
import * as transducers from "./transducers";
import * as signals from "./signals";

//convenience for executing partially-applied functions without macros.
function addPartly(target, source){
  return Cloe.reducekv(function(memo, key, f){
    memo[key] = Cloe.isFunction(f) ? Cloe.partly(f) : f;
    return memo;
  }, target, source);
}

export default Object.assign(addPartly(Cloe.placeholder, Cloe), {
  transducers: addPartly({}, transducers),
  signals: addPartly({}, signals)
});