import {IFunctor, IForkable} from "../../protocols.js";
import {does, overload} from "../../core.js";
import {implement} from "../protocol.js";
import {left} from "../left/construct.js";
import {okay} from "./construct.js";
import {isError} from "../error/concrete.js";
import {keying} from "../../protocols/imapentry/concrete.js";

function fmap(self, f){
  try{
    return okay(f(self.value));
  } catch (ex) {
    return left(ex);
  }
}

function fork(self, reject, resolve){
  resolve(self);
}

export default does(
  keying("Okay"),
  implement(IForkable, {fork}),
  implement(IFunctor, {fmap}));
