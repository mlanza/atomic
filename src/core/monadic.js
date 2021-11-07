import {implement} from "./types/protocol.js";
import {does} from "./core.js";
import {IFunctor, IChainable, IDeref} from "./protocols.js";

export default function monadic(construct){

  function fmap(self, f){
    return construct(f(self.value));
  }

  function chain(self, f){
    return f(self.value);
  }

  function deref(self){
    return self.value;
  }

  return does(
    implement(IDeref, {deref}),
    implement(IChainable, {chain}),
    implement(IFunctor, {fmap}));
}
