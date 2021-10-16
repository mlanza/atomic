import {does, partial} from "../../core.js";
import {implement} from "../protocol.js";
import {apply} from "./concrete.js";
import {INamable, IFn, IAppendable, IPrependable} from "../../protocols.js";
import * as p from "./protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";

export function append(f, ...applied){
  return function(...args){
    return f.apply(this, args.concat(applied));
  }
}

function invoke(self, ...args){
  return self.apply(null, args);
}

function name(self){
  return self.name ? self.name : p.get(/function (.+)\s?\(/.exec(self.toString()), 1); //latter is for IE
}

export default does(
  keying("Function"),
  implement(INamable, {name}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend: partial}),
  implement(IFn, {invoke}));
