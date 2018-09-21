import {does, partial} from '../../core';
import {implement} from '../protocol';
import {apply} from './concrete';
import {get} from "../../protocols/ilookup/concrete";
import {INamed, IFn, ICheckable, IAssociative, ILookup, IEncode, IAppendable, IPrependable, IDispatch} from '../../protocols';
import Symbol from '../symbol/construct';

export function append(f, ...applied){
  return function(...args){
    return f.apply(this, args.concat(applied));
  }
}

function invoke(self, ...args){
  return self.apply(null, args);
}

function encode(self, label, refstore, seed){
  IAssociative.contains(refstore, self) || IAssociative.assoc(refstore, self, seed());
  const id = ILookup.lookup(refstore, self);
  return IAssociative.assoc({id: id}, label, self[Symbol.toStringTag]);
}

function dispatch(self, args){
  return apply(self, args);
}

function check(self, text){
  return self(text);
}

function name(self){
  return self.name ? self.name : get(/function (.+)\s?\(/.exec(self.toString()), 1); //latter is for IE
}

export default does(
  implement(INamed, {name}),
  implement(ICheckable, {check}),
  implement(IDispatch, {dispatch}),
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend: partial}),
  implement(IEncode, {encode}),
  implement(IFn, {invoke}));