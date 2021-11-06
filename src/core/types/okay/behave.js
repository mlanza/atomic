import {IFunctor, IChainable, IForkable, IDeref} from "../../protocols.js";
import {is} from "../../protocols/imapentry/concrete.js"
import {does, overload} from "../../core.js";
import {implement} from "../protocol.js";
import {left} from "../left/construct.js";
import {okay, Okay} from "./construct.js";
import {isError} from "../error/concrete.js";
import * as p from "../../protocols/concrete.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function fmap(self, f){
  try{
    return okay(f(self.value));
  } catch (ex) {
    return left(ex);
  }
}

function chain(self, f){
  try{
    const value = f(self.value);
    return is(value, self.constructor) ? value : new self.constructor(value);
  } catch (ex) {
    return left(ex);
  }
}

function fork(self, reject, resolve){
  resolve(self);
}

function deref(self){
  return self.value;
}

export default does(
  keying("Okay"),
  implement(IDeref, {deref}),
  implement(IForkable, {fork}),
  implement(IChainable, {chain}),
  implement(IFunctor, {fmap}));
