import * as Cloe from "./core";
import * as transducers from "./transducers";
import * as signals from "./signals";

//convenience for executing partially-applied functions without macros.
function addPartly(target, source){
  return Cloe.mapSomeVals(source, Cloe.partly, Cloe.isFunction, target);
}

export default Object.assign(addPartly(Cloe.placeholder, Cloe), {
  transducers: addPartly({}, transducers),
  signals: addPartly({}, signals)
});