import {IFunctor, IForkable, IOtherwise} from "../../protocols.js";
import {identity, does, overload} from "../../core.js";
import {implement} from "../protocol.js";
import Promise from "promise";
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

export default does(
  keying("Promise"),
  implement(IOtherwise, {otherwise}),
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap}));
