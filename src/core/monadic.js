import {implement} from "./types/protocol.js";
import {does, chain} from "./core.js";
import {IFunctor, IFlatMappable, IDeref} from "./protocols.js";

export default function monadic(construct, flat){

  function fmap(self, f){
    return construct(f(self.value));
  }

  function flatMap(self, f){
    return chain(self, IFlatMappable.flat, IFunctor.fmap(?, f));
  }

  function deref(self){
    return self.value;
  }

  return does(
    implement(IDeref, {deref}),
    implement(IFlatMappable, {flatMap, flat}),
    implement(IFunctor, {fmap}));
}
