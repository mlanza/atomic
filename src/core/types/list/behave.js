import {does, identity} from '../../core';
import {implement} from '../protocol';
import {ISeq, ISeqable, IEncode, IAssociative, IMatch} from '../../protocols';
import {behaveAsLazySeq} from '../lazy-seq/behave';
import {Symbol} from '../symbol/construct';

function first(self){
  return self.head;
}

function rest(self){
  return self.tail;
}

function encode(self, label, refstore, seed){
  return IEncode.encode(IAssociative.assoc(IEncode.encode({data: Object.assign({}, self)}, label, refstore, seed), label, self[Symbol.toStringTag]), label, refstore, seed);
}

export const behaveAsList = does(
  behaveAsLazySeq,
  implement(IEncode, {encode}),
  implement(ISeqable, {seq: identity}),
  implement(ISeq, {first, rest}));