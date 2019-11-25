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

function encode(self, label){
  return IEncode.encode(IAssociative.assoc(IEncode.encode({data: Object.assign({}, self)}, label), label, self[Symbol.toStringTag]), label);
}

export const behaveAsList = does(
  behaveAsLazySeq,
  implement(IEncode, {encode}),
  implement(ISeqable, {seq: identity}),
  implement(ISeq, {first, rest}));