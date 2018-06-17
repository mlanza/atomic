import {effect, partial} from '../../core';
import {implement} from '../protocol';
import {IFn, IAssociative, ILookup, IEncode, IAppendable, IPrependable} from '../../protocols';

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

export default effect(
  implement(IAppendable, {append}),
  implement(IPrependable, {prepend: partial}),
  implement(IEncode, {encode}),
  implement(IFn, {invoke}));