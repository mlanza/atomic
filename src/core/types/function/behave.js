import {does, partial} from "../../core.js";
import {implement} from "../protocol.js";
import {apply} from "./concrete.js";
import {get} from "../../protocols/ilookup/concrete.js";
import {INameable, IFn, IAssociative, ILookup, IAppendable, IPrependable} from "../../protocols.js";
import Symbol from "symbol";

export function append(f, ...applied){
  return function(...args){
    return f.apply(this, args.concat(applied));
  }
}

function invoke(self, ...args){
  return self.apply(null, args);
}

function name(self){
  return self.name ? self.name : get(/function (.+)\s?\(/.exec(self.toString()), 1); //latter is for IE
}

export default does(
  implement(INameable, {name}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend: partial}),
  implement(IFn, {invoke}));