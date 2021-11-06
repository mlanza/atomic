import {implement} from "./types/protocol.js";
import {does} from "./core.js";
import {IFunctor, IChainable, IDeref} from "./protocols.js";

export default function monadic(construct, isMonad){

  function fmap(self, f){
    return construct(f(self.value));
  }

  function chain(self, f){
    const value = f(self.value);
    return isMonad(value) ? value : construct(value);
  }

  function deref(self){
    return self.value;
  }

  return does(
    implement(IDeref, {deref}),
    implement(IChainable, {chain}),
    implement(IFunctor, {fmap}));
}
