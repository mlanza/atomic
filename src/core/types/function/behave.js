import {effect} from '../../core';
import {implement} from '../protocol';
import {IFn, IAssociative, ILookup, IEncode} from '../../protocols';

function invoke(self, ...args){
  return self.apply(null, args);
}

function encode(self, label, refstore, seed){
  IAssociative.contains(refstore, self) || IAssociative.assoc(refstore, self, seed());
  const id = ILookup.lookup(refstore, self);
  return IAssociative.assoc({id: id}, label, self[Symbol.toStringTag]);
}

export default effect(
  implement(IEncode, {encode}),
  implement(IFn, {invoke}));