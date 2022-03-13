import {implement} from "./types/protocol.js";
import {does} from "./core.js";
import {IFunctor, IFlatMappable, IDeref} from "./protocols.js";

export default function monadic(construct){

  function fmap(self, f){
    return construct(f(self.value));
  }

  function flatMap(self, f){
    return f(self.value);
  }

  function deref(self){
    return self.value;
  }

  return does(
    implement(IDeref, {deref}),
    implement(IFlatMappable, {flatMap}),
    implement(IFunctor, {fmap}));
}
