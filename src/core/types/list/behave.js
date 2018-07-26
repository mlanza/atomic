import {effect, identity} from '../../core';
import {implement} from '../protocol';
import {ISeq, ISeqable, IEncode, IAssociative, IArray} from '../../protocols';
import behave from '../lazy-seq/behave';
import Symbol from '../symbol/construct';

function first(self){
  return self.head;
}

function rest(self){
  return self.tail;
}

function encode(self, label, refstore, seed){
  return IEncode.encode(IAssociative.assoc(IEncode.encode({data: Object.assign({}, self)}, label, refstore, seed), label, self[Symbol.toStringTag]), label, refstore, seed);
}

export default effect(
  behave,
  implement(IEncode, {encode}),
  implement(ISeqable, {seq: identity}),
  implement(ISeq, {first, rest}));