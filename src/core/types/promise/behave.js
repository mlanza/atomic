import {IFunctor, IForkable, IOtherwise, IEquiv} from "../../protocols.js";
import {identity, does, overload, constantly} from "../../core.js";
import {implement} from "../protocol.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function fmap(self, resolve){
  return self.then(resolve);
}

function fork(self, reject, resolve){
  self.then(resolve, reject);
}

function otherwise(self, other){
  return fmap(self, function(value){
    return value == null ? other : value;
  });
}

function equiv(self, other){
  return self === other; //regardless of its result, every promise is distinct
}

export default does(
  keying("Promise"),
  implement(IEquiv, {equiv}),
  implement(IOtherwise, {otherwise}),
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap}));
