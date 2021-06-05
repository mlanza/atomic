import {does, identity} from '../../core';
import {implement} from '../protocol';
import {ISeq, ISeqable} from '../../protocols';
import {behaveAsLazySeq} from '../lazy-seq/behave';
import Symbol from 'symbol';

function first(self){
  return self.head;
}

function rest(self){
  return self.tail;
}

export const behaveAsList = does(
  behaveAsLazySeq,
  implement(ISeqable, {seq: identity}),
  implement(ISeq, {first, rest}));