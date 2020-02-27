import {does, partial} from '../../core';
import {implement} from '../protocol';
import {apply} from './concrete';
import {get} from "../../protocols/ilookup/concrete";
import {INameable, IFn, IAssociative, ILookup, IAppendable, IPrependable} from '../../protocols';
import {Symbol} from '../symbol/construct';

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

export const behaveAsFunction = does(
  implement(INameable, {name}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend: partial}),
  implement(IFn, {invoke}));